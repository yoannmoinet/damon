var Emitter = require('events').EventEmitter;
var util = require('util');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
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
    this.initialize();
}

// Extend Event.Emitter.
util.inherits(Runner, Emitter);

Runner.prototype.initialize = function () {
    this.uuid = uuid();

    this.folder = path.join(__dirname, './bots/files/', this.uuid);
    this.captures = path.join(this.folder, 'captures');
    this.download = path.join(this.folder, 'download');
    this.log = path.join(this.folder, 'log.txt');
    this.cookie = path.join(this.folder, 'cookies.txt');

    this.cancelled = false;
    this.children = {};

    this.createFiles();
};

Runner.prototype.createFiles = function createFiles () {
    // Create its captures folder.
    fs.mkdirsSync(this.captures);
    // Create its download folder
    fs.mkdirsSync(this.download);
    // Create the log file.
    fs.closeSync(fs.openSync(this.log, 'w'));
    // Create the cookie file.
    fs.closeSync(fs.openSync(this.cookie, 'w'));
};

Runner.prototype.bindings = function bindings () {
    // To avoid multiple watchers we unbind before.
    this.unbindings();
    // Listen for the agent's files.
    this.watcher = fs.watch(this.folder, function (evt, filename) {
        // If it's a new log.
        if (filename === 'log.txt' && (evt === 'rename' || evt === 'change')) {
            this.parseLog(path.join(this.folder, filename));
        }
    }.bind(this));
};

Runner.prototype.unbindings = function unbindings () {
    if (this.watcher) {
        this.watcher.close();
    }
};

Runner.prototype.createReport = function createReport () {
    this.report = {
        tasks: this.tasks,
        timing: {}
    };

    if (!_.isEmpty(this.tasks)) {
        return this.report;
    }

    // Total time of everything
    this.report.timing.total = _.reduce(this.tasks, function (memo, task) {
        return memo + task.test.duration;
    }, 0);
    // The longest task
    this.report.timing.slowest = _.max(this.tasks, function (task) {
        return task.test.duration;
    });
    // The fastest task
    this.report.timing.fastest = _.min(this.tasks, function (task) {
        return task.test.duration;
    });
    // All the tasks that are above the median
    this.report.timing.above = _.filter(this.tasks, function (task) {
        return task.test.duration >
            (this.report.timing.slowest.test.duration / 2);
    }.bind(this));

    // All the errors
    this.report.errors = {
        byTask: {},
        byError: {}
    };

    // Different indexation
    _.each(this.tasks, function (task) {
        if (task.errors.length) {
            this.report.errors.byTask[task.test.it || task.test.type] =
                task.errors;
        }

        _.each(task.errors, function (error) {
            this.report.errors.byError[error.message] =
                this.report.errors.byError[error.message] || [];
            this.report.errors.byError[error.message].error = error;
            this.report.errors.byError[error.message].push(task);
        }.bind(this));
    }.bind(this));

    return this.report;
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
            .replace(/\\\\\//g, '\/')
            .replace(/\\\\"/g, '\"')
            .replace(/\\"/g, '\"');
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
    if (this.started) {
        return;
    }
    this.bindings();
    this.clear();
    this.started = true;
    this.files = files;
    this.emit('begin', this.files);
    this.runTask();
};

// Clear sored data.
Runner.prototype.clear = function clear () {
    this.logs = {};
    this.tasks = {};
    this.currentFile = -1;
    this.started = false;
};

// Kill all subprocesses
Runner.prototype.killAll = function killAll () {
    this.cancelled = true;
    for (var i in this.children) {
        if (this.children.hasOwnProperty(i)) {
            this.killChild(i);
        }
    }
};

// Kill a specific subprocesses
Runner.prototype.killChild = function killChild (uuid) {
    if (!this.children[uuid]) {
        return;
    }

    var child = this.children[uuid].child;

    if (typeof child.disconnect === 'function') {
        child.disconnect();
    }

    if (typeof child.kill === 'function') {
        //Child process can't be killed if it has a subprocess still running
        //So, PhantomJs has to be killed first in order to kill CasperJs
        var isWin = /^win/.test(process.platform);
        var killCommand = 'kill -9 ' + child.PhantomPID;

        if (isWin) {
            killCommand = 'taskkill /PID ' + child.PhantomPID + ' /F';
        }

        //Kill PhantomJs using a kill command depending on the platform
        exec(killCommand, function (error, stdout, stderr) {
            if (error !== null) {
                console.log(
                    chalk.bgRed(' -[ ERROR ]- Cannot end PhantomJs: '),
                    error
                );
                return;
            }
            //Kill CasperJs if PhantomJs has been successfully killed
            child.kill('SIGTERM');
        });
    }

    //Clean the child process if it has been successfully killed
    if (child.killed) {
        this.cleanChild(uuid);
    }
};

// Clean instance of child
Runner.prototype.cleanChild = function cleanChild (uuid) {
    delete this.children[uuid];
};

// Run the next task.
Runner.prototype.runTask = function runTask () {
    this.currentFile += 1;
    var file = this.files[this.currentFile];
    if (file) {
        // When the runner ends its suite.
        // Clean the previous child and do the next one.
        this.once('end', function (child, code, signal) {
            if (child) {
                this.cleanChild(child.uuid);
            }
            // Do the next one.
            this.runTask();
        }.bind(this));

        this.start(file.tasks);
    } else {
        this.finish();
    }
};

// Update the stored task to be sure to have all updated infos.
Runner.prototype.updateTest = function (test) {
    this.tasks[test.logId].test = _.extend(
        this.tasks[test.logId].test,
        test
    );
};

// When a new suite begins
Runner.prototype.start = function start (tasks) {
    this.emit('start', tasks);
    if (this.cancelled) {
        this.end(null, null, 'SIGTERM');
        return;
    }
    this.spawn(tasks);
};

// When a suite ends
Runner.prototype.end = function end (child, code, signal) {
    this.emit('end', child, code, signal);
};

// When everything is done.
Runner.prototype.finish = function finish () {
    this.started = false;
    this.cancelled = false;
    this.emit('finish', this.createReport());
    this.unbindings();
};

// A task is pending.
Runner.prototype.pending = function pending (log) {
    var test = log.message;
    if (!this.tasks[test.logId]) {
        this.tasks[test.logId] = {
            errors: [],
            failed: false,
            logs: []
        };
    }
    this.tasks[test.logId].test = test;
    this.tasks[test.logId].logs.push(log);
    this.emit('pending', this.tasks[test.logId].test);
};

// A task got an error
Runner.prototype.error = function error (log) {
    var test = log.message;
    if (!this.tasks[test.logId]) {
        this.pending(log);
    } else {
        this.tasks[test.logId].logs.push(log);
    }
    var error = {
        message: test.error,
        details: test.details,
        type: test.type
    };
    // Ignore 'Operation Cancelled' type of error.
    if (/Operation canceled/.test(test.error)) {
        return;
    }
    this.tasks[test.logId].errors.push(error);
    this.emit('error', error);
};

// A task failed
Runner.prototype.fail = function fail (log) {
    var test = log.message;
    if (!this.tasks[test.logId]) {
        this.pending(log);
    } else {
        this.tasks[test.logId].logs.push(log);
    }
    this.updateTest(test);
    this.tasks[test.logId].failed = true;
    var lastError = this.tasks[test.logId].errors.slice(-1)[0];
    this.emit(
        'fail',
        this.tasks[test.logId].test,
        lastError ? lastError.message : null
    );
};

// A task succeeded
Runner.prototype.test = function test (log) {
    var test = log.message;
    if (!this.tasks[test.logId]) {
        this.pending(log);
    } else {
        this.tasks[test.logId].logs.push(log);
    }
    this.updateTest(test);
    this.emit('test', this.tasks[test.logId].test);

    // If it hasn't failed yet, it's succeeded
    if (!this.tasks[test.logId].failed) {
        this.emit('pass', this.tasks[test.logId].test);
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
            '--ssl-protocol=any',
            '--ignore-ssl-errors=yes',
            '--log-file=' + this.log
        ],
        {
            env: process.env
        }
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

    child.on('close', this.end.bind(this, child));

    child.stdout.on('data', function (data) {
        var output = data.toString();

        //PhantomJS PID is passed as 'PhantomJS PID: PID'
        //Extract PhantomJS's PID once received
        //Otherwise, console.log the output message
        if (output.indexOf('PhantomJS PID: ') > -1) {
            child.PhantomPID = parseInt(output.split(': ')[1]);
        } else {
            console.log(chalk.blue(' -[ child ]- '), output);
        }
    });

    child.stderr.on('data', function (data) {
        console.log(chalk.bgRed(' -[ ERROR ]- '), data.toString());
    });
};

module.exports = new Runner();
