var path = require('path');
var uuid = require('node-uuid').v1;
var glob = require('glob');
var chalk = require('chalk');
var runner = require('./runner.js');
var defaultReporter = path.join(__dirname, './reporter.js');
var reporter;

var env = process.env;
var phantomjsPath = path.join(__dirname, '../bin');
var isWin = /^win/.test(process.platform);
env.PHANTOMJS_EXECUTABLE = phantomjsPath + '/phantomjs_2.0' +
    (isWin ? '.exe' : '');
env.PATH += ';' + phantomjsPath;

var files = [];

function getFiles (path) {
    return glob.sync(parsePath(path));
}

function parsePath (filePath) {
    if (path.resolve(filePath) === path.normalize(filePath)) {
        return filePath;
    } else {
        return path.join(process.cwd(), filePath);
    }
}

function attachReporter (reporterFilePath) {
    // Assign the reporter if it's directly passed as an argument
    try {
        reporter = require(reporterFilePath || defaultReporter)(runner);
    } catch (err) {
        console.log(chalk.bgRed.bold.white(' No reporter ! ') +
                ' [' + chalk.dim.red(err) + ']');
    }
}

function start (filesPath) {
    var filesList = [];

    if (filesPath) {
        filesPath.forEach(function (path) {
            filesList = filesList.concat(getFiles(path));
        });

        filesList.forEach(function (file) {
            addFile(file);
        });

        runner.run(files);
    }
}

function addFile (taskFilename) {
    files.push({
        id: uuid(),
        name: path.basename(taskFilename, '.json'),
        tasks: taskFilename
    });
}

module.exports = {
    start: start,
    attachReporter: attachReporter,
};
