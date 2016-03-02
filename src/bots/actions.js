var assert = require('./actions/assert.js');
var capture = require('./actions/capture.js');
var dom = require('./actions/dom.js');
var get = require('./actions/get.js');
var request = require('./actions/request.js');
var wait = require('./actions/wait.js');

var template = require('./helpers/template.js');

var timeoutDuration = 10000;

var actions = {
    assert: function (params) {
        return assert(casper, params);
    },
    capture: function (params, cwd) {
        return capture(casper, params, cwd);
    },
    dom: function (params) {
        return dom(casper, params, timeoutDuration);
    },
    get: function (params) {
        return get(casper, params);
    },
    request: function (params) {
        return request(casper, params);
    },
    wait: function (params) {
        return wait(casper, params, timeoutDuration);
    }
};

var config = function (casper, cwd) {
    return {
        execute: function (task) {
            if (task.type && actions[task.type]) {
                var response;
                task = template.parse(task);
                response = actions[task.type](task.params, cwd);
                if (task.type === 'get') {
                    template.store(task.params.key, response);
                }
                return response;
            } else {
                log('no task found for: ', task, 'ERROR');
                throw new Error('no task found');
            }
        },
        navigate: function (url, next) {
            log('navigate to', url, 'INFO_BAR');
            var loadSuccess = function (status) {
                casper.removeListener('load.failed', loadFailed);
                casper.removeListener('load.finished', loadSuccess);
                if (status === 'fail') {
                    next('fail');
                } else {
                    next();
                }
            };
            var loadFailed = function (err) {
                casper.removeListener('load.failed', loadFailed);
                casper.removeListener('load.finished', loadSuccess);
                next(err);
            };
            casper.on('load.failed', loadFailed);
            casper.on('load.finished', loadSuccess);
            return casper.start(url);
        }
    };
};

module.exports = {
    config: config
};
