var spawn = require('child_process').spawn;
var _ = require('underscore');
var path = require('path');
var uuid = require('node-uuid').v1;
var fs = require('fs');

var env = process.env;
var phantomjsPath = path.join(__dirname, '../bin');
var isWin = /^win/.test(process.platform);
env.PHANTOMJS_EXECUTABLE = phantomjsPath + '/phantomjs_2.0' +
    (isWin ? '.exe' : '');
env.PATH += ';' + phantomjsPath;

var mgrUuid = uuid();
var children = [];
var files = [];
var client;
var started = false;
var cookieFile = 'cookies.txt';

console.log('spawned mgr ' + process.pid);
function start (files) {
    if (files) {
        if(_.isArray(files)){
            _.each(files, function (file) {
                addFiles(file);
            });     
        }
        else {
            addFiles(files);
        }
        runTask();
    }
}

function addFiles (taskFilename) {
    files.push({
        id: uuid(),
        name: path.basename(taskFilename),
        tasks: taskFilename
    });
};

function runTask () {
    var file = files.shift();
    if (file) {
        console.log("spawn next child")
        spawnChild(file.tasks);
    } 
    else {
        console.log("deleting cookies....");
        fs.unlink(cookieFile, function() {
            console.log("tasks finished");
            process.exit(0);
        });
    }
}

function spawnChild(tasks) {
    var child = spawn(
        path.join(__dirname, '../node_modules/casperjs/bin/casperjs'),
        [path.join(__dirname, './bots/worker.js'), '--tasks=' + tasks,
        '--cookies-file=./'+ cookieFile]
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

    child.on('exit', function (code, error) {
        console.log('exit', arguments);
    });

    child.on('close', function (code, error) {
        console.log('close', arguments);
        if (error) {
            fs.unlink(cookieFile, function() {
                process.exit(error);
            });
        } 
        else {
            runTask();
        }
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

process.on("SIGINT", function (code, error) {
    fs.unlink(cookieFile, function() {
        process.exit(error);
    });
});

module.exports = {
    start: start
};
