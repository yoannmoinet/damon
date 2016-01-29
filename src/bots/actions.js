function stripAccessors (variable) {
    var accessors = [];
    var objectRegexp = /[^\[]+/;
    var propertiesRegexp = /\['(.+?)'\]/g;

    variable.split('.').forEach(function (component) {
        var object = component.match(objectRegexp);
        var property = propertiesRegexp.exec(component);

        if (object) {
            accessors = accessors.concat(object);
        }

        while (property !== null) {
            accessors = accessors.concat(property[1]);
            property = propertiesRegexp.exec(component);
        }

    });
    return accessors;
}

function getVariable (casper, params) {
    var accessors = stripAccessors(params.variable);
    var object = accessors.shift();
    var variableValue = casper.evaluate(function (object) {
        return window[object];
    }, object);

    accessors.forEach(function (property) {
        variableValue = variableValue[property];
    });

    return variableValue;
}

function getAttr (casper, params) {
    var attributeValue;
    if (params.attribute === '@text') {
        attributeValue = casper.getElementInfo(params.selector).text;
    } else {
        attributeValue = casper.getElementAttribute(params.selector,
            params.attribute);
    }

    if (attributeValue && params.modifier) {
        var regexpModifier = new RegExp(params.modifier);
        var matchedRegexp = regexpModifier.exec(attributeValue);

        if (matchedRegexp) {
            attributeValue = matchedRegexp[0];
        } else {
            return;
        }
    }
    return attributeValue;
}

var config = function (casper, pid) {
    var log = require('./log').config(casper);
    return {
        capture: function (params) {
            log('capture', params.name, 'INFO_BAR');
            return casper.capture('./captures/' +
                pid + '/' +
                params.name);
        },
        get: function (params) {
            var returnValue;
            if (params.attribute) {

                returnValue = getAttr(casper, params);
                if (typeof returnValue !== 'undefined') {
                    log('got', params.attribute + ' of ' + params.selector,
                        'SUCCESS');
                    return returnValue;
                }
                return log('no attribute "' + params.attribute +
                    '" found for selector "' + params.selector +
                    '" and ' + (params.modifier || 'whithout') +
                    ' modifier', 'ERROR');

            } else if (params.variable) {

                returnValue = getVariable(casper, params);
                if (typeof returnValue !== 'undefined') {
                    log('got global variable: ' + params.variable, 'SUCCESS');
                    return returnValue;
                }
                return log('no global variable: ' + params.variable, 'ERROR');

            }
            return log('no action found for ', params, 'ERROR');
        },
        wait: function (params) {
            var vals = ['wait for'];
            Object.keys(params).forEach(function (key) {
                vals.push(key + ': ' + params[key]);
            });
            vals.push('INFO_BAR');
            log.apply(this, vals);

            if (params.url) {

                return casper.waitForUrl(params.url, function () {
                    log('got', params.url, 'SUCCESS');
                }, function () {
                    log('timeout', 'WARNING');
                }, 30000);

            } else if (params.selector) {

                return casper.waitForSelector(params.selector, function () {
                    log('got ', params.selector, 'SUCCESS');
                }, function () {
                    log('timeout', 'WARNING');
                }, 30000);

            } else if (params.visible) {

                return casper.waitUntilVisible(params.visible, function () {
                    log('got ', params.visible, 'SUCCESS');
                }, function () {
                    log('timeout', 'WARNING');
                }, 30000);

            } else if (params.hidden) {

                return casper.waitWhileVisible(params.hidden, function () {
                    log('got ', params.hidden, 'SUCCESS');
                }, function () {
                    log('timeout', 'WARNING');
                }, 30000);

            } else if (params.time) {

                return casper.wait(params.time, function () {
                    log('waited for ', params.time, 'SUCCESS');
                });
            }

            return log('no action found for ', params, 'ERROR');
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
