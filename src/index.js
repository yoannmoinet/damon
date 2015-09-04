var spawn = require('child_process').spawn;
var faye = require('faye');
var _ = require('underscore');
var path = require('path');
var uuid = require('node-uuid').v1;
var dbConnection = require('./db').connect;
var db;

var env = process.env;
var phantomjsPath = process.cwd() + '\\bin';
env.PHANTOMJS_EXECUTABLE = phantomjsPath + '\\phantomjs_2.0';
env.PATH += ';' + phantomjsPath;

var mgrUuid = uuid();
var children = [];
var tasks = [];
var client;
var started = false;

console.log('spawned mgr ' + process.pid);

function start () {
    addTasks('./src/bots/tasks/login.json');
}

function addTasks (taskFilename) {
    if (taskFilename) {
        tasks.push({
            id: uuid(),
            name: path.basename(taskFilename),
            tasks: taskFilename
        });
        spawnChild(taskFilename);
        setInterval(update, 15000);
    }
};

client = new faye.Client('http://localhost:5555/bots');
client.subscribe('/manager/' + mgrUuid + '/actions',
    function (message) {
        console.log('Got Message', message);
    }
);

function update() {
    client.publish('/manager/updates', {
        managers: [{
            id: mgrUuid,
            name: process.pid.toString(),
            children: _.pluck(children, 'name'),
            tasks: _.pluck(tasks, 'name')
        }]
    });
};

function spawnChild(tasks) {
    var child = spawn(
        '.\\node_modules\\casperjs\\bin\\casperjs',
        ['./src/bots/worker.js', '--tasks=' + tasks]
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

dbConnection('mongodb://localhost/bots').then(function (resp) {
    db = resp;
    start();
}, function (err) {
    console.error('ERROR', err);
});
