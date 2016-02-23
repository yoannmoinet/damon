var Emitter = require('events').EventEmitter;
var util = require('util');
var spawn = require('child_process').spawn;
var fs = require('fs-extra');
var path = require('path');
var uuid = require('node-uuid').v1;
var readline = require('readline');
var chalk = require('chalk');
var _ = require('underscore');

// Will parse the log file.
// type [1] [TYPE]
// date [2] and time [3] (1234/12/12 hh:mm:ss)
// message [4] ...
var regexLog = /^\[([^\]]*)\]\(([^\)]*) ([^\)]*)\):([^\n]*)/gm;

function Runner () {
    Emitter.call(this);

    this.uuid = uuid();

    this.folder = path.join(__dirname, './bots/files/', this.uuid);
    this.captures = path.join(this.folder, 'captures');
    this.log = path.join(this.folder, 'log.txt');
    this.cookie = path.join(this.folder, 'cookies.txt');
    this.logs = {};
    this.tasks = {};
    this.children = {};

    this.createFiles();
    this.bindings();
}

// Extend Event.Emitter.
util.inherits(Runner, Emitter);

Runner.prototype.createFiles = function createFiles () {
    // Create its captures folder.
    fs.mkdirsSync(this.captures);
    // Create the log file.
    fs.closeSync(fs.openSync(this.log, 'w'));
    // Create the cookie file.
    fs.closeSync(fs.openSync(this.cookie, 'w'));
};

Runner.prototype.bindings = function bindings () {
    // Listen for the agent's files.
    fs.watch(this.folder, function (evt, filename) {
        // If it's a new log.
        if (evt === 'change' && filename === 'log.txt') {
            this.parseLog(path.join(this.folder, filename));
        }
    }.bind(this));
};

// Throttle the call.
Runner.prototype.parseLog = function parseLog (logFile) {
    clearTimeout(this.timeoutParse);
    this.timeoutParse = setTimeout(
        this.doParseLog.bind(this, logFile),
    10);
};

Runner.prototype.doParseLog = function doParseLog (logFile) {
    var reader = readline.createInterface({
        input: fs.createReadStream(logFile),
        terminal: false
    });

    reader.on('line', function (line) {
        this.parseLine(line);
    }.bind(this));
};

Runner.prototype.parseLine = function parseLine (line) {
    var result, logObject, key;
    while (result = regexLog.exec(line)) {
        logObject = {
            type: result[1],
            date: result[2],
            time: result[3],
            message: result[4]
        };
        this.handleLog(logObject);
    }
};

Runner.prototype.handleLog = function handleLog (logObject) {
    var key = logObject.type + logObject.date + logObject.time;
    // If we already have it we don't need to do anything.
    if (this.logs[key]) {
        return;
    }
    // Try to get an object out of its message.
    try {
        // Remove escaped characters.
        logObject.message = logObject.message
            .replace(/\\\\\\\\/g, '\\')
            .replace(/\\\\\//g, '\/')
            .replace(/\\\\"/g, '\"');
        logObject.message = JSON.parse(logObject.message);
    } catch (e) {
        // Not and object.
    }
    this.logs[key] = logObject;

    switch (this.logs[key].type) {
        case 'TASK.START':
            this.pending(logObject);
            break;
        case 'TASK.FAIL':
            this.fail(logObject);
            this.test(logObject);
            break;
        case 'TASK.ERROR':
            this.error(logObject);
            break;
        case 'TASK.END':
            this.test(logObject);
            break;
        default:
            console.log(chalk.bgRed('Log not taken into account'));
            console.log(logObject);
            break;
    }
};

// Run all the tasks.
Runner.prototype.run = function run (files) {
    this.emit('begin', files);
    this.files = files;
    this.runTask();
};

// Run the next task.
Runner.prototype.runTask = function runTask () {
    var file = this.files.shift();
    if (file) {
        // When the runner ends its suite.
        // Do the next one.
        this.once('end', this.runTask.bind(this));
        this.start(file.tasks);
    } else {
        this.finish();
    }
};

// When a new suite begins
Runner.prototype.start = function start (tasks) {
    this.emit('start', tasks);
    this.spawn(tasks);
};

// When a suite ends
Runner.prototype.end = function end (code, err) {
    this.emit('end', code, err);
};

// When everything is done.
Runner.prototype.finish = function finish () {
    this.emit('finish');
};

// A task is pending.
Runner.prototype.pending = function pending (task) {
    this.tasks[task.logId] = task.message;
    this.emit('pending', this.tasks[task.logId]);
};

// A task got an error
Runner.prototype.error = function error (task) {
    if (!this.tasks[task.logId]) {
        this.pending(task);
    }
    this.tasks[task.logId].error = task.message.error;
};

// A task failed
Runner.prototype.fail = function fail (task) {
    if (!this.tasks[task.logId]) {
        this.pending(task);
    }
    this.tasks[task.logId].failed = true;
    this.emit('fail', this.tasks[task.logId], this.tasks[task.logId].error);
};

// A task succeed
Runner.prototype.test = function test (task) {
    if (!this.tasks[task.logId]) {
        this.pending(task);
    }
    this.emit('test', this.tasks[task.logId]);
    if (!this.tasks[task.logId].failed) {
        this.emit('pass', this.tasks[task.logId]);
    }
};

// Spawn the casper
Runner.prototype.spawn = function spawnChild (tasks) {
    // Spawn the child.
    var child = spawn(
        path.join(__dirname, '../node_modules/casperjs/bin/casperjs'),
        [
            path.join(__dirname, './bots/worker.js'),
            '--tasks=' + tasks,
            '--cwd=' + this.folder,
            '--cookies-file=' + this.cookie,
            '--web-security=no',
            '--log-file=' + this.log
        ]
    );
    child.uuid = this.uuid + '-' + child.pid;

    this.children[child.uuid] = {
        id: child.uuid,
        name: child.pid.toString(),
        child: child,
        logFile: this.log
    };
    this.bindChild(child);
};

// Clean agent's files.
Runner.prototype.clean = function clean () {
    fs.removeSync(this.folder);
};

// Bind the casper.
Runner.prototype.bindChild = function bindChild (child) {

    child.on('close', this.end.bind(this));

    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.stderr.on('data', function (data) {
        console.log(chalk.bgRed(' -[ ERROR ]- '), data.toString());
    });
};

module.exports = new Runner();
