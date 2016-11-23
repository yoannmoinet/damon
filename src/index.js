var path = require('path');
var uuid = require('uuid').v1;
var glob = require('glob');
var chalk = require('chalk');
var runner = require('./runner.js');
var defaultReporter = 'damon-reporter';
var reporter;

// Configure environment
var env = process.env;
var phantomjsPath = path.join(__dirname, '../bin');
var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var is64 = process.arch === 'x64';
var phantom = phantomjsPath + '/phantomjs_2.1_';
if (isWin) {
    phantom += 'win.exe';
} else if (isMac) {
    phantom += 'mac';
} else {
    phantom += 'linux' + (is64 ? '_64x' : '');
}
env.PHANTOMJS_EXECUTABLE = phantom;
env.PATH += (isWin ? ';' : ':') + phantomjsPath;

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
        if (reporterFilePath && typeof reporterFilePath !== 'string') {
            reporter = reporterFilePath(runner);
        } else {
            reporter = require(reporterFilePath || defaultReporter)(runner);
        }
    } catch (err) {
        console.log(chalk.bgRed.bold.white(' No reporter ! ') +
                ' [' + chalk.dim.red(err) + ']');
    }
}

function start (filesPath) {
    var filesList = [];

    if (filesPath) {
        // Allow strings
        if (typeof filesPath === 'string') {
            filesPath = [filesPath];
        }

        filesPath.forEach(function (path) {
            filesList = filesList.concat(getFiles(path));
        });

        filesList.forEach(function (file) {
            addFile(file);
        });

        runner.run(files);
    }
}

function clear () {
    files = [];
    runner.clear();
    runner.initialize();
}

function kill () {
    return runner.killAll();
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
    clear: clear,
    kill: kill,
    attachReporter: attachReporter,
    runner: runner
};
