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

    }


}

process.on('SIGINT', function (code, error) {
    console.log('END', code, error);
    end(0);
});

module.exports = {
    start: start
};
