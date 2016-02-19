var selectedSpinner = 0;
var chalk = require('chalk');
var readline = require('readline');
var _ = require('underscore');
var path = require('path');
var sliceAnsi = require('slice-ansi');
var stripAnsi = require('strip-ansi');

var spinners = [
    '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
    '┤┘┴└├┌┬┐'
];
var index;
var currentPending;
var log = {
    info: chalk.bgWhite.black,
    pending: chalk.bgCyan.white,
    error: chalk.bgRed.white,
    success: chalk.bgGreen.white
};
var writeStream = process.stdout;

function write (st) {
    var maxLength = writeStream.columns - 10;

    // TODO Make something that works. Right now it's removing the capped line with the next one.
    // Cap the complete string length based on the output width
    if (stripAnsi(st).length > maxLength) {
        // st = sliceAnsi(st, 0, maxLength - 4) + '... ';
    }

    writeStream.write(st);
}

function pending (text, tab) {
    var spinner = spinners[selectedSpinner];
    tab = tab || '';
    index = 0;
    clearInterval(currentPending);
    currentPending = setInterval(function () {
        clear();
        write(tab + log.pending(chalk.bold(' [ ' + spinner.charAt(index) + ' ] ') + text));
        index += 1;
        if (index >= spinner.length) {
            index = 0;
        }
    }, 80);
}

function clear () {
    readline.clearLine(writeStream);
    readline.cursorTo(writeStream, 0);
}

function buildString (task) {
    var st = ' ';
    // The longest a param can be.
    var maxLength = 20;
    var param;
    for (var i in task.params) {
        if (task.params.hasOwnProperty(i)) {
            param = task.params[i];

            if (typeof param === 'object') {
                param = JSON.stringify (param);
            }

            // Cap param string length.
            if (param.length > maxLength) {
                param = param.substring(0, maxLength - 4) + '...';
            }

            st += chalk.blue.bold(i) + chalk.bold(' : ');
            st += chalk.black(param) + ' ';
        }
    }

    return chalk.bold(task.type) + ' ' + chalk.bgWhite(st);
}

module.exports = function (runner) {
    runner.on('begin', function (taskFiles) {
        var st = '\n begin';
        var last;

        taskFiles = _.map(taskFiles, function (taskFile) {
            return taskFile.name;
        });

        st += ' ' + taskFiles.length + ' suite';
        if (taskFiles.length > 1) {
            st += 's';
            last = taskFiles.pop();
        }
        st += ' : ';
        st += chalk.blue(taskFiles.join(', '));

        if (last) {
            st += chalk.blue(' and ' + last);
        }

        st += ' ';

        write(log.info(st) + '\n\n');
    });

    runner.on('start', function (taskFile) {
        var tasks, nbTasks, config;

        try {
            tasks = require(taskFile);
        } catch (e) {
            // Can't get the file.
        }

        var st = '   start';
        st += ' ' + chalk.blue(path.basename(taskFile, '.json'));

        if (tasks) {
            // Adding 1 for the navigation.
            nbTasks = tasks.tasks.length + 1;
            st += ' ' + chalk.red(nbTasks + ' task');
            if (nbTasks > 1) {
                st += chalk.red('s');
            }
            st += ' ';

            config = {
                type: '  - configuration',
                // Omit the url because we have it in the first task.
                params: _.omit(tasks.config, 'url')
            };

            st += '\n ' + buildString(config);
        }

        st += ' ';

        // Write.
        clearInterval(currentPending);
        clear();
        write(log.info(st) + '\n\n');
    });

    runner.on('pending', function (task) {
        pending(buildString(task), '    ');
    });

    runner.on('test', function (task) {
        clearInterval(currentPending);
        clear();

        write('    ' + log.success(chalk.bold(' [ √ ] ') + buildString(task)) + '\n');
    });

    runner.on('fail', function (task, err) {
        clearInterval(currentPending);
        clear();

        var st = chalk.bold(' [ x ] ');
        st += buildString(task);
        st += ' ';

        if (err) {
            st += chalk.bgYellow.red(' ' + err + ' ') + ' ';
        }

        write('    ' + log.error(st) + '\n');
    });

    runner.on('finish', function (report) {
        clearInterval(currentPending);
        write(log.info('\n end ') + '\n');
    });
};
