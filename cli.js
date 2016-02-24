#! /usr/bin/env node

var program = require('commander');
var agent = require('./src/index');
var pkg = require('./package.json');

program._name = pkg.name;

program
    .version(pkg.version)
    .option('-R, --reporter <path>', 'The reporter\'s file to use.')
    .command('run <files...>')
    .description('Run the list of JSON tasks files. Accepts glob.')
    .action(function (files) {
        agent.start(files, program.reporter);
    });

program.parse(process.argv);
