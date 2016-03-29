#! /usr/bin/env node

var program = require('commander');
var agent = require('./src/index');
var pkg = require('./package.json');
var chalk = require('chalk');

program._name = pkg.name;

var timeoutExit;
function exitHandler (options, err) {
    if (options.cleanup) {
        agent.runner.clean();
    }

    if (err) {
        console.log(chalk.bgRed(' -[ ERROR ]- '), err);
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

program
    .version(pkg.version)
    .option('-R, --reporter <path>', 'The reporter\'s file to use.')
    .command('run <files...>')
    .description('Run the list of JSON tasks files. Accepts glob.')
    .action(function (files) {
        agent.attachReporter(program.reporter);
        agent.start(files);
        agent.runner.on('finish', exitHandler.bind(null, {exit: true}, null));
    });

program.parse(process.argv);

// TODO needs to instrumentalize the tmp folder for bots
// TODO pass actions files
// TODO pass helpers files

// so the program will not close instantly
process.stdin.resume();
// do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}));
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));
// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
