var spawn = require('child_process').spawn;
var _ = require('underscore');
var path = require('path');
var uuid = require('node-uuid').v1;
var fs = require('fs');
var glob = require('glob');

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

function deleteCookies (cb) {
    console.log('deleting cookies....');
    fs.unlink(cookieFile, function (err) {
        // If we have an error different
        // from inexistent file log it.
        if (err && err.code !== 'ENOENT') {
            console.log('Can\'t delete cookie file', err);
        }
        if (typeof cb === 'function') {
            cb();
        }
    });
}

function end (code, err) {
    deleteCookies(function () {
        if (err) {
            console.log(err);
        }
        process.exit(code);
    });
}

function getFiles (path) {
    var absolutePath = parsePath(path);
    return glob.sync(absolutePath);
}

function parsePath (filePath) {
    if (path.resolve(filePath) === path.normalize(filePath)) {
        return filePath;
    } else {
        return path.join(process.cwd(), filePath);
    }
}

function start (filesPath) {
    var filesList = [];
    if (filesPath) {
        filesPath.forEach(function (path) {
            filesList = filesList.concat(getFiles(path));
        });

        filesList.forEach(function (file) {
            addFiles(file);
        });
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
        spawnChild(file.tasks);
    } else {
        end(0);
    }
}

function spawnChild(tasks) {
    var child = spawn(
        path.join(__dirname, '../node_modules/casperjs/bin/casperjs'),
        [path.join(__dirname, './bots/worker.js'), '--tasks=' + tasks,
        '--cookies-file=./' + cookieFile, '--web-security=no']
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
            end(1, error);
        } else {
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
        console.log('## ERROR: ', data.toString());
    });
}

process.on('SIGINT', function (code, error) {
    end(0);
});

module.exports = {
    start: start
};
