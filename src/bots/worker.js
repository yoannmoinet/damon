var currentFile = require('system').args[3];
var fs = require('fs');
var dirname = fs.absolute(currentFile).split('/');
// Needs to be loaded to be available across the lifecycle.
var utils = require('utils');
var system = require('system');
var pid = system.pid;

// Pass the PhantomJS pid to the runner
console.log('PhantomJS PID: ' + pid);

var opts, currentTask;

if (dirname.length > 1) {
    dirname.pop();
    dirname = dirname.join('/');
    fs.changeWorkingDirectory(dirname);
}

var casper = require('casper').create({
    clientScripts: ['./includes/start.js'],
    pageSettings: {
        loadImages: true,
        loadPlugins: true,
        localToRemoteUrlAccessEnabled: true
    },
    requests: {},
    verbose: false,
    exitOnError: false,
    // Overwrite logs to avoid having them in the console.
    onDie: function (casp, message, status) {
        log('casper died', message, status, 'ERROR');
    },
    onError: function (err, stack) {
        log('casper error', err, stack, 'ERROR');
    },
    onAlert: function (message) {
        log('casper alert', message, 'WARNING');
    },
    onStepTimeout: function _onStepTimeout(timeout, stepNum) {
        log(
            'Maximum step execution timeout exceeded for step ' + stepNum,
            'ERROR'
        );
    },
    onTimeout: function _onTimeout(timeout) {
        log('Script timeout of ' + timeout + ' reached, exiting.', 'ERROR');
    },
    onWaitTimeout: function _onWaitTimeout(timeout) {
        log('Wait timeout of ' + timeout + ' expired, exiting.', 'ERROR');
    },
    // Store all requests sent by casper into the casper object
    onResourceRequested: function (casp, requestData, networkRequest) {
        casper.options.requests[requestData.id] = requestData;
    }
});

// removing default options passed by the Python executable
casper.cli.drop('cli');
casper.cli.drop('casper-path');

if (!casper.cli.has('tasks')) {
    casper
        .echo('worker n°' + pid + ' needs tasks... will shut down.')
        .exit();
}

try {
    opts = require(casper.cli.get('tasks'));
} catch (err) {
    console.log('No tasks found', err);
    casper.exit();
}

var tasks = opts.tasks;
var cwd = casper.cli.has('cwd') ? casper.cli.get('cwd') : dirname;
var config = opts.config;
var logLevel = config.logLevel !== undefined ?
    config.logLevel : 'none';
var log = require('./log').config.call(casper, pid, logLevel);
var logger = require('./logger')(cwd);
var userAgent = config.userAgent || 'Mozilla/5.0 (Windows NT 6.1; WOW64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';

//Extend Casper with helper modules
casper.plugins = {
    request: require('./plugins/request.js').call(casper),
    template: require('./plugins/template.js').call(casper),
    get: require('./plugins/get.js').call(casper),
    assertion: require('./plugins/assertion.js').call(casper),
    xpath: require('./plugins/xpath.js').call(casper)
};

casper.options.waitTimeout = config.timeout !== undefined ?
    config.timeout : 10000;
casper.options.logLevel = logLevel;
casper.options.viewportSize = config.size ?
    config.size : {
        width: 1024,
        height: 720
    };
casper.userAgent(userAgent);

var actions = require('./actions').config.call(casper, cwd);

function startTask (task) {
    task.start = +new Date();
    task.logId = logger.write(task, 'TASK.START');
}

function configEndTask (task) {
    task.end = +new Date();
    task.duration = task.end - task.start;
    return task;
}

function errorTask (task, message, details, type) {
    logger.write({
        error: message,
        details: details,
        logId: task.logId,
        type: type
    }, 'TASK.ERROR');
}

function failTask (task) {
    logger.write(configEndTask(task), 'TASK.FAIL');
}

function endTask (task) {
    logger.write(configEndTask(task), 'TASK.END');
}

// Prepare the navigation task.
var taskNavigate = {
    type: 'start',
    it: 'Start on ' + config.url,
    params: {
        url: config.url
    }
};
startTask(taskNavigate);

actions.start(config.url, function (err) {
    if (err) {
        log('Error Loading', err, 'ERROR');
        errorTask(taskNavigate, 'load error : ' + err.status, err, 'task');
        failTask(taskNavigate);
    } else {
        endTask(taskNavigate);
    }
    tasks.forEach(function (task) {
        casper.then(function () {
            currentTask = task;
            startTask(currentTask);
            try {
                return actions.execute(task);
            } catch (e) {
                log('Catched', e.message, e, 'ERROR');
                errorTask(currentTask, 'thrown error : ' + e.message,
                    e, 'task');
                failTask(currentTask);
            }
        }).then(function () {
            // Close the current task.
            endTask(currentTask);
        });
    });
});

casper.on('error', function(msg, backtrace) {
    log('error', arguments, 'ERROR');
    failTask(currentTask);
});
casper.on('step.error', function(err) {
    log('step.error', arguments, 'ERROR');
    errorTask(currentTask, 'step error : ' + err.message, err, 'step');
    failTask(currentTask);
});
casper.on('step.timeout', function(step, timeout) {
    log('step.timeout', arguments, 'ERROR');
    errorTask(currentTask, 'timeout step', {
        step: step,
        timeout: timeout
    }, 'timeout');
    failTask(currentTask);
});
casper.on('timeout', function() {
    log('timeout', arguments, 'ERROR');
    errorTask(currentTask, 'timeout');
    failTask(currentTask);
});
casper.on('waitFor.timeout', function(timeout, params) {
    log('waitFor.timeout', arguments, 'ERROR');
    errorTask(currentTask, 'timeout waitFor', {
        timeout: timeout,
        params: params
    }, 'timeout');
    failTask(currentTask);
});

casper.run();
