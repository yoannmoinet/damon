var currentFile = require('system').args[3];
var fs = require('fs');
var dirname = fs.absolute(currentFile).split('/');

if (dirname.length > 1) {
    dirname.pop();
    dirname = dirname.join('/');
    fs.changeWorkingDirectory(dirname);
}

var casper = require('casper').create({
    clientScripts: ['./includes/start.js'],
    viewportSize: {
        width: 1024,
        height: 720
    },
    pageSettings: {
        loadImages: true,
        loadPlugins: true,
        localToRemoteUrlAccessEnabled: true,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    },
    verbose: false,
    exitOnError: true,
    waitTimeout: 60000,
    logLevel: 'debug',
    onDie: function (casp, message, status) {
        log('casper died', message, status, 'ERROR');
    },
    onError: function (err, stack) {
        log('casper error', err, stack, 'ERROR');
        this.exit();
    },
    onAlert: function (message) {
        log('casper alert', message, 'WARNING');
    },
    onLoadError: function (casp, url, status) {
        log('load error', url, status, 'ERROR');
    }
});

var utils = require('utils');
var system = require('system');
var pid = system.pid;
var log = require('./log').config(casper);
var actions = require('./actions').config(casper, pid);

casper.on('remote.message', function (message) {
    log('console.log : ' + message, 'INFO');
});
casper.on('page.resource.received', function(resource) {
    var status = resource.status;
    if (status >= 400) {
        log('resource ' + resource.url +
            ' failed to load (' + status + ')', 'error');
    }
});
/*casper.on('complete.error', function(err) {
    log('complete callback has failed: ' + err, 'ERROR');
});
casper.on('load.failed', function(err) {
    log('load failed', err, 'ERROR');
});
casper.on('page.error', function (err, other) {
    log('page error', err, other[0], other[1], 'ERROR');
});
casper.on('resource.error', function (err) {
    log('resource error', err, 'ERROR');
});*/

// removing default options passed by the Python executable
casper.cli.drop('cli');
casper.cli.drop('casper-path');

if (!casper.cli.has('tasks')) {
    casper
        .echo('worker n°' + pid + ' needs tasks... will shut down.')
        .exit();
}

var opts = require(casper.cli.get('tasks'));
var tasks = opts.tasks;
var config = opts.config;
var store = {};

function replaceHandlebars (string) {
    for (key in store) {
        string = string.replace(new RegExp('{{' + key + '}}','g'), store[key]);
    }
    return string
}

function parseTask (task) {
    var handlebarRegex = new RegExp('{{([^{}]+)}}', 'g');

    for (param in task.params) {
        var paramValue = task.params[param];
        if (handlebarRegex.test(paramValue)) {
            task.params[param] = replaceHandlebars(paramValue);
        }
    }

    return task;
}

actions.navigate(config.url, function () {
    casper.then(function () {
        log('configuring ', config, 'INFO');
        if (config.size) {
            return casper.viewport(config.size.width, config.size.height);
        }
        return log('no configuration needed', 'INFO');
    });
    tasks.forEach(function (task) {
        if (task.type && actions[task.type]) {
            casper.then(function () {
                log('starting task', task, 'INFO_BAR');
                task = parseTask(task);
                var response = actions[task.type](task.params);
                if (task.type === "get") {
                    store[task.params.key] = response;
                }
                return response
            });
        }
    });
    casper.then(function () {
        return log('all actions done', 'SUCCESS');
    });
});

casper.run();
