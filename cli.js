#! /usr/bin/env node

var program = require('commander');
var agent = require('./src/index');
var pkg = require('./package.json');
var path = require('path');

program._name = pkg.name.slice(0, -1);

program
    .version(pkg.version)
    .command('run <files...>')
    .description('Run the list of JSON tasks files. Accept glob.')
    .action(function (files) {
        var filesList = files.map(function (file) {
            return path.join(process.cwd(), file);
        });
        agent.start(filesList);
    });

program.parse(process.argv);