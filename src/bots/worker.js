var currentFile = require('system').args[3];
var fs = require('fs');
var dirname = fs.absolute(currentFile).split('/');
// Needs to be loaded to be available across the lifecycle.
var utils = require('utils');
var system = require('system');
var pid = system.pid;

var opts, currentTask;

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
var cwd = casper.cli.has('cwd') ? casper.cli.get('cwd') : dirname;
var config = opts.config;
var log = require('./log').config(casper, pid, logLevel);


var actions = require('./actions').config(casper, cwd);

// Prepare the navigation task.
var taskNavigate = {
    type: "navigate",
    params: {
        url: config.url
    }
};

taskNavigate.logId = logger.write(taskNavigate, 'TASK.START');
actions.navigate(config.url, function (err) {
    tasks.forEach(function (task) {
        casper.then(function () {
            return actions.execute(task);
        });
    });
    casper.then(function () {
        return log('all actions done', 'SUCCESS');
    });
});

casper.run();
