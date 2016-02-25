var template = require('./template.js');
var taskGet = require('./taskGet.js');
var request = require('./request.js');
var timeoutDuration = 10000;
var assertion = require('./assertion.js').assertion(casper);

var actions = {
    assert: function (params) {
        var output;
        try {
            if (params.attribute) {
                log('assert attribute', params.attribute, 'INFO_BAR');
                assertion.attribute(params);
            } else if (params.variable) {
                log('assert variable', params.variable, 'INFO_BAR');
                assertion.variable(params);
            } else if (params.key) {
                log('assert key', params.key, 'INFO_BAR');
                assertion.key(params);
            } else {
                log('no assertion found', 'ERROR');
                throw new Error('no assertion found');
            }
        }
        catch (err) {
            output = 'FAILED: expected \'' + err.expected + '\' but got \'' +
                err.actual + '\'';
            log(output, 'TEST_FAILED');
            throw new Error('assert failed');
        }
        output = 'PASS: got \'' + params.expected + '\'';
        return log(output, 'TEST_SUCCESS');
    },
    capture: function (params, cwd) {
        log('capture', params.name, 'INFO_BAR');
        return casper.capture(
            cwd + '/captures/' + params.name,
            params.selector
        );
    },
    dom: function (params) {
        log('dom action', params.do, params.selector, 'INFO_BAR');
        var domActions = {
            fill: function (opts) {
                return casper.sendKeys(opts.selector, opts.text, {reset: true});
            },
            click: function (opts) {
                return casper.click(opts.selector);
            }
        };
        if (params.selector && params.do) {
            var timeout = params.timeout !== undefined ?
                params.timeout : timeoutDuration;

            log('waiting for', params.selector, 'INFO_BAR');
            return casper.waitUntilVisible(params.selector, function () {
                log('got', params.selector, 'SUCCESS');

                if (domActions[params.do]) {
                    return domActions[params.do](params);
                }
                log('no dom action found for ' + params.do, 'ERROR');
                throw new Error('no dom action');

            }, timeout);
        }
        throw new Error('missing params');
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
            log('no attribute "' + params.attribute +
                '" found for selector "' + params.selector +
                '" and ' + (params.modifier || 'without') +
                ' modifier', 'ERROR');
            throw new Error('no attribute found');

        } else if (params.resource) {

            var resourceMatcher = taskGet.encodeResource(params.resource,
                params.regexp);

            returnValue = taskGet.getResource(casper, resourceMatcher,
                params.method, params.variable);
            if (returnValue !== undefined) {
                log('got resource: ' + params.resource, 'SUCCESS');
                return returnValue;
            }
            log('no resource found for: ' + params.resource, 'ERROR');
            throw new Error('no resource found');

        } else if (params.variable) {

            returnValue = taskGet.getVariable(casper, params.variable);
            if (returnValue !== undefined) {
                log('got global variable: ' + params.variable, 'SUCCESS');
                return returnValue;
            }
            log('no variable found for: ' + params.variable, 'ERROR');
            throw new Error('no value found');

        }
        log('no action found for ', params, 'ERROR');
        throw new Error('no action found');
    },
    request: function (params) {
        // Control what's needed to pursue
        if (!params || !params.url) {
            log('missing `url` params for the request action',
                params, 'ERROR');
            throw new Error('missing `url` params');
        }

        // Get the data from the request.
        var data = casper.evaluate(request.xhr, params);

        // And store it if needed later.
        if (params.store) {
            if (!params.store.key) {
                log('missing params for store', 'ERROR');
                throw new Error('missing params');
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

        var timeout = params.timeout !== undefined ?
            params.timeout : timeoutDuration;

        if (params.url) {

            var url = params.url;
            if (params.regexp === true) {
                url = new RegExp(params.url);
            }
            return casper.waitForUrl(url, function () {
                log('got', params.url, 'SUCCESS');
            }, function () {
                log('timeout url', params.url, 'WARNING');
            }, timeout);

        } else if (params.selector) {

            return casper.waitForSelector(params.selector, function () {
                log('got ', params.selector, 'SUCCESS');
            }, function () {
                log('timeout selector', params.selector, 'WARNING');
            }, timeout);

        } else if (params.visible) {

            return casper.waitUntilVisible(params.visible, function () {
                log('got ', params.visible, 'SUCCESS');
            }, function () {
                log('timeout visible', params.visible, 'WARNING');
            }, timeout);

        } else if (params.hidden) {

            return casper.waitWhileVisible(params.hidden, function () {
                log('got ', params.hidden, 'SUCCESS');
            }, function () {
                log('timeout hidden', params.hidden, 'WARNING');
            }, timeout);

        } else if (params.time !== undefined) {

            return casper.wait(params.time, function () {
                log('waited for ', params.time, 'SUCCESS');
            });

        } else if (params.resource) {

            var matchingRequest;
            var resourceMatcher = taskGet.encodeResource(params.resource,
                params.regexp);
            return casper.waitForResource(resourceMatcher, function () {
                if (!params.method) {
                    return log('got', params.resource, 'SUCCESS');
                }

                matchingRequest = taskGet.getResource(casper,
                    resourceMatcher, params.method);

                if (matchingRequest) {
                    return log('got', params.resource, 'SUCCESS');
                }
                log('no resource found for ', params, 'ERROR');
                throw new Error('no resource found');

            }, function () {
                log('timeout resource', params.resource, 'WARNING');
            }, timeout);

        }
        log('no action found for ', params, 'ERROR');
        throw new Error('no action found');
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
