#! /usr/bin/env node

var program = require('commander');
var agent = require('./src/index');
var pkg = require('./package.json');
var path = require('path');
var _ = require('underscore');

program
    .version(pkg.version)
    .command('test <files...>')
    .action(function (files) {
        var filesList = _.map(files, function (file) {
            return path.join(process.cwd(), file)
        });
        agent.start(filesList);
    });
    
program.parse(process.argv);