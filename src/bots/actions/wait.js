var getHelper = require('../helpers/getHelper.js');

module.exports = function (casper, params, timeoutDuration) {
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
        var resourceMatcher = getHelper.encodeResource(params.resource,
            params.regexp);
        return casper.waitForResource(resourceMatcher, function () {
            if (!params.method) {
                return log('got', params.resource, 'SUCCESS');
            }

            matchingRequest = getHelper.getResource(casper,
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
};
