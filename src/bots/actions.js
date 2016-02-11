var template = require('./template.js');
var taskGet = require('./taskGet.js');
var request = require('./request.js');
var timeoutDuration = 30000;
var assertion = require('./assertion.js').assertion(casper);

var actions = {
    assert: function (params) {
        var output;
        try {
            if (params.attribute) {
                assertion.attribute(params);
            } else if (params.variable) {
                assertion.variable(params);
            } else {
                log('no assertion found', 'ERROR');
            }
        }
        catch (err) {
            output = 'FAILED: expected \'' + err.expected + '\' but got \'' +
                err.actual + '\'';
            return log(output, 'TEST_FAILED');
        }
        output = 'PASS: got \'' + params.expected + '\'';
        return log(output, 'TEST_SUCCESS');
    },
    capture: function (params) {
        log('capture', params.name, 'INFO_BAR');
        return casper.capture('./captures/' +
            pid + '/' +
            params.name);
    },
    dom: function (params) {
        log('dom action', params.do, params.selector, 'INFO_BAR');
        var domActions = {
            fill: function (opts) {
                return casper.sendKeys(opts.selector, opts.text);
            },
            click: function (opts) {
                return casper.click(opts.selector);
            }
        };
        if (params.selector) {
            log('waiting for', params.selector, 'INFO_BAR');
            return casper.waitForSelector(params.selector, function () {
                log('got', params.selector, 'SUCCESS');
                if (domActions[params.do]) {
                    return domActions[params.do](params);
                }
                return log('no dom action found for ' + params.do, 'ERROR');
            });
        }
    },
    get: function (params) {
        var returnValue;
        if (params.attribute) {

            returnValue = taskGet.getAttribute(casper, params);
            if (returnValue !== undefined) {
                log('got', params.attribute + ' of ' + params.selector,
                    returnValue, 'SUCCESS');
                return returnValue;
            }
            return log('no attribute "' + params.attribute +
                '" found for selector "' + params.selector +
                '" and ' + (params.modifier || 'whithout') +
                ' modifier', 'ERROR');

        } else if (params.variable) {

            returnValue = taskGet.getVariable(casper, params.variable);
            if (returnValue !== undefined) {
                log('got global variable: ' + params.variable, 'SUCCESS');
                return returnValue;
            }
            return log('no value found for: ' + params.variable, 'ERROR');

        }
        return log('no action found for ', params, 'ERROR');
    },
    request: function (params) {
        // Control what's needed to pursue
        if (!params || !params.url) {
            return log('missing `url` params for the request action',
                params, 'ERROR');
        }

        // Get the data from the request.
        var data = casper.evaluate(request.xhr, params);

        // And store it if needed later.
        if (params.store) {
            if (!params.store.key) {
                log('missing params for store', 'ERROR');
                return;
            }
            request.handleStore(template, taskGet, params.store, data);
        }

        // Return it.
        return data;
    },
    wait: function (params) {
        var vals = ['wait for'];
        Object.keys(params).forEach(function (key) {
            vals.push(key + ': ' + params[key]);
        });
        vals.push('INFO_BAR');
        log.apply(this, vals);

        if (params.url) {

            var url = params.url;
            if (params.regexp === true) {
                url = new RegExp(params.url);
            }
            return casper.waitForUrl(url, function () {
                log('got', params.url, 'SUCCESS');
            }, function () {
                log('timeout', 'WARNING');
            }, timeoutDuration);

        } else if (params.selector) {

            return casper.waitForSelector(params.selector, function () {
                log('got ', params.selector, 'SUCCESS');
            }, function () {
                log('timeout', 'WARNING');
            }, timeoutDuration);

        } else if (params.visible) {

            return casper.waitUntilVisible(params.visible, function () {
                log('got ', params.visible, 'SUCCESS');
            }, function () {
                log('timeout', 'WARNING');
            }, timeoutDuration);

        } else if (params.hidden) {

            return casper.waitWhileVisible(params.hidden, function () {
                log('got ', params.hidden, 'SUCCESS');
            }, function () {
                log('timeout', 'WARNING');
            }, timeoutDuration);

        } else if (params.time) {

            return casper.wait(params.time, function () {
                log('waited for ', params.time, 'SUCCESS');
            });

        } else if (params.resource) {

            var resourceMatcher;
            if (params.regexp === true) {
                resourceMatcher = new RegExp(params.resource);
            } else {
                //The resource will be an url, so URI encoding is needed
                resourceMatcher = encodeURI(params.resource);
            }
            return casper.waitForResource(resourceMatcher, function () {
                log('got', params.resource, 'SUCCESS');
            }, function () {
                log('timeout', 'WARNING');
            }, timeoutDuration);

        }

        return log('no action found for ', params, 'ERROR');
    }
};

var config = function (casper, pid) {
    return {
        execute: function (task) {
            if (task.type && actions[task.type]) {
                var response;
                task = template.parse(task);
                log('starting task', task, 'INFO_BAR');
                response = actions[task.type](task.params);
                if (task.type === 'get') {
                    template.store(task.params.key, response);
                }
                return response;
            } else {
                log('no task found for: ', task, 'ERROR');
            }
        },
        navigate: function (url, next) {
            log('navigate to', url, 'INFO_BAR');
            var loadSuccess = function (status) {
                log('load success', url, 'SUCCESS');
                casper.removeListener('load.failed', loadFailed);
                casper.removeListener('load.finished', loadSuccess);
                if (status === 'fail') {
                    next('fail');
                } else {
                    next();
                }
            };
            var loadFailed = function (err) {
                log('load failed', url, 'ERROR');
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
