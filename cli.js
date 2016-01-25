#! /usr/bin/env node

var program = require('commander');
var agent = require('./src/index');
var pkg = require('./package.json');
var path = require('path');
var glob = require('glob');

var filesList = [];

function getFiles (file) {
    var absolutePath = parsePath(file);
    return glob.sync(absolutePath);
}

function parsePath (filePath) {
    if(path.resolve(filePath) === path.normalize(filePath)) {
        return filePath;
    } else {
        return path.join(process.cwd(), filePath);
    }
}

program._name = pkg.name.slice(0, -1);

program
    .version(pkg.version)
    .command('run <files...>')
    .description('Run the list of JSON tasks files. Accept glob.')
    .action(function (files) {
        files.forEach(function (file) {
            filesList = filesList.concat(getFiles(file));
        });
        agent.start(filesList);
    });

program.parse(process.argv);