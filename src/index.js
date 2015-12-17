var spawn = require('child_process').spawn;
var _ = require('underscore');
var path = require('path');
var uuid = require('node-uuid').v1;

var env = process.env;
var phantomjsPath = path.join(__dirname, '../bin');
var isWin = /^win/.test(process.platform);
env.PHANTOMJS_EXECUTABLE = phantomjsPath + '/phantomjs_2.0' +
    (isWin ? '.exe' : '');
env.PATH += ';' + phantomjsPath;
console.log(env.PHANTOMJS_EXECUTABLE);
var mgrUuid = uuid();
var children = [];
var tasks = [];
var client;
var started = false;

console.log('spawned mgr ' + process.pid);
function start (file) {
    addTasks(file);
}

function addTasks (taskFilename) {
    if (taskFilename) {
        tasks.push({
            id: uuid(),
            name: path.basename(taskFilename),
            tasks: taskFilename
        });
        spawnChild(taskFilename);
    }
};

function spawnChild(tasks) {
    var child = spawn(
        path.join(__dirname, '../node_modules/casperjs/bin/casperjs'),
        [path.join(__dirname, './bots/worker.js'), '--tasks=' + tasks]
    );
    console.log('spawned child ' + child.pid + ' with tasks ' + tasks);
    children.push({
        id: uuid(),
        name: child.pid.toString(),
        child: child
    });
    bindChild(child);
    return child;
}

function bindChild(child) {
    child.on('error', function () {
        console.log('error', arguments);
    });

    child.on('exit', function () {
        console.log('exit', arguments);
    });

    child.on('close', function () {
        console.log('close', arguments);
    });

    child.on('disconnect', function () {
        console.log('disconnect', arguments);
    });

    child.on('message', function () {
        console.log('message', arguments);
    });

    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.stderr.on('data', function (data) {
        console.log('## ERRROR: ', data.toString());
    });
}

module.exports = {
    start: start
};
