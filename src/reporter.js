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
var selectedSpinner = 1;
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
        write(
            tab +
            log.pending(
                chalk.bold(' [ ' + spinner.charAt(index) + ' ] ') + text
            )
        );
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
    var duration = '';
    // The longest a param can be.
    var maxLength = 20;
    var param;

    if (task.duration) {
        duration = chalk.bold.magenta(' [' + task.duration + 'ms] ');
    }

    if (task.it) {
        st += chalk.black(task.it) + ' ';
        return chalk.bgWhite(st) + ' ' + chalk.bold.bgWhite(duration);
    } else {
        for (var i in task.params) {
            if (task.params.hasOwnProperty(i)) {
                param = task.params[i];

                if (typeof param === 'object') {
                    param = JSON.stringify(param);
                }

                // Cap param string length.
                if (param.length > maxLength) {
                    param = param.substring(0, maxLength - 4) + '...';
                }

                st += chalk.blue.bold(i) + chalk.bold(' : ');
                st += chalk.black(param) + ' ';
            }
        }
        return chalk.bold(task.type) + ' ' +
            chalk.bgWhite(st) + ' ' +
            chalk.bold.bgWhite(duration);
    }
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

        write(log.info(st) + '\n');
    });

    runner.on('start', function (taskFile) {
        var tasks, nbTasks, config;

        try {
            tasks = require(taskFile);
        } catch (e) {
            // Can't get the file.
        }

        var st = '\n   ';
        st += ' ' + chalk.blue(path.basename(taskFile, '.json'));

        if (tasks) {
            if (tasks.config.describe) {
                st += chalk.blue.bold(': ');
                st += chalk.black(tasks.config.describe);
            }

            // Adding 1 for the navigation.
            nbTasks = tasks.tasks.length + 1;
            st += chalk.bold.red(' (' + nbTasks + ' task');
            if (nbTasks > 1) {
                st += chalk.bold.red('s');
            }
            st += chalk.bold.red(') ');

            config = {
                type: '   - configuration',
                // Omit the url because we have it in the first task.
                // Omit the describe because we have already wrote it.
                params: _.omit(tasks.config, ['url', 'describe'])
            };

            st += '\n ' + buildString(config);
        }

        st += ' ';

        // Write.
        clearInterval(currentPending);
        clear();
        write(log.info(st) + '\n');
    });

    runner.on('pending', function (task) {
        pending(buildString(task), '    ');
    });

    runner.on('pass', function (task) {
        clearInterval(currentPending);
        clear();

        write(
            '    ' +
            log.success(chalk.bold(' [ √ ] ') + buildString(task)) + '\n'
        );
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
