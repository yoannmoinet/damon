#! /usr/bin/env node

var cli = require('cli').enable('status', 'glob', 'version');
var agent = require('./src/index');
var pkg = require('./package.json');
var path = require('path');
cli.setApp(pkg.name, pkg.version);

cli.parse({
    file: [
        'f',
        'The JSON file were tasks are.',
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
});
