#! /usr/bin/env node

var cli = require('cli').enable('status', 'glob', 'version');
var agent = require('./src/index');
var pkg = require('./package.json');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

cli.setApp(pkg.name, pkg.version);

cli.parse({
    file: [
        'f',
        'The JSON file were tasks are.',
        'string'
    ],
    list: [
        'l',
        'The list of JSON tasks files.',
        'string'
    ]
});

cli.main(function (args, opts) {
    var log = {
        debug: cli.debug,
        error: cli.error,
        fatal: cli.fatal,
        info: cli.info,
        ok: cli.ok
    };

    if (opts.file) {
        agent.start(path.join(process.cwd(), opts.file));
    }
    else if (opts.list) {
        fs.readFile(path.join(process.cwd(), opts.list), 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                var filesList = data.split(/\r?\n/);
                filesList = _.map(filesList, function (file) {
                    return path.join(process.cwd(), file)
                });
                agent.start(filesList);
            }
        });
    }
});
