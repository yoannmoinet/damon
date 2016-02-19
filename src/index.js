var path = require('path');
var uuid = require('node-uuid').v1;
var glob = require('glob');
var runner = require('./runner.js');

var env = process.env;
var phantomjsPath = path.join(__dirname, '../bin');
var isWin = /^win/.test(process.platform);
env.PHANTOMJS_EXECUTABLE = phantomjsPath + '/phantomjs_2.0' +
    (isWin ? '.exe' : '');
env.PATH += ';' + phantomjsPath;

var files = [];

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

        runner.on('finish', exitHandler.bind(null, {exit: true}));
        runner.run(files);
    }
}

function addFiles (taskFilename) {
    files.push({
        id: uuid(),
        name: path.basename(taskFilename),
        tasks: taskFilename
    });
}

var timeoutExit;
function exitHandler (options, err) {
    if (options.cleanup) {
        runner.clean();
    }

    if (err) {
        console.log(err.stack);
    }

    if (options.exit) {
        clearTimeout(timeoutExit);
        // Delay the exit to let async task to finish.
        // Runner's logging for example.
        timeoutExit = setTimeout(function () {
            process.exit();
        }, 100);
    }
}

// so the program will not close instantly
process.stdin.resume();
// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup:true }));
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit:true }));
// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit:true }));

module.exports = {
    start: start
};
