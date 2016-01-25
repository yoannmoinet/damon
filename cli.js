#! /usr/bin/env node

var program = require('commander');
var agent = require('./src/index');
var pkg = require('./package.json');
var path = require('path');
var glob = require("glob")

program._name = pkg.name.slice(0, -1);

function globFiles (file) {
    var fullPath; 
    if(path.resolve(file) === path.normalize(file)) {
        fullPath = file;
    }
    else {
        fullPath = path.join(process.cwd(), file);
    }
    return glob.sync(fullPath);
}

var filesList = [];

program
    .version(pkg.version)
    .command('run <files...>')
    .description('Run the list of JSON tasks files. Accept glob.')
    .action(function (files) {
        files.forEach(function (file) {
            filesList = filesList.concat(globFiles(file));
        });
        agent.start(filesList);
    });

program.parse(process.argv);