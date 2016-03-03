function waitURL (params, timeout) {
    var url = params.url;
    if (params.regexp === true) {
        url = new RegExp(params.url);
    }
    return casper.waitForUrl(url, function () {
        log('got', params.url, 'SUCCESS');
    }, function () {
        log('timeout url', params.url, 'WARNING');
    }, timeout);
}

function waitSelector (params, timeout) {
    return casper.waitForSelector(params.selector, function () {
        log('got ', params.selector, 'SUCCESS');
    }, function () {
        log('timeout selector', params.selector, 'WARNING');
    }, timeout);
}

function waitVisible (params, timeout) {
    return casper.waitUntilVisible(params.visible, function () {
        log('got ', params.visible, 'SUCCESS');
    }, function () {
        log('timeout visible', params.visible, 'WARNING');
    }, timeout);
}

function waitHidden (params, timeout) {
    return casper.waitWhileVisible(params.hidden, function () {
        log('got ', params.hidden, 'SUCCESS');
    }, function () {
        log('timeout hidden', params.hidden, 'WARNING');
    }, timeout);
}

function waitTime (params, timeout) {
    return casper.wait(params.time, function () {
        log('waited for ', params.time, 'SUCCESS');
    });
}

function waitResource (params, timeout) {
    var matchingRequest;
    var resourceMatcher = casper.helpers.get.encodeResource(
        params.resource,
        params.regexp
    );
    return casper.waitForResource(resourceMatcher, function () {
        if (!params.method) {
            return log('got', params.resource, 'SUCCESS');
        }

        matchingRequest = casper.helpers.get.getResource(
            resourceMatcher,
            params.method
        );

        if (matchingRequest) {
            return log('got', params.resource, 'SUCCESS');
        }
        log('no resource found for ', params, 'ERROR');
        throw new Error('no resource found');

    }, function () {
        log('timeout resource', params.resource, 'WARNING');
    }, timeout);
}

module.exports = function (params, timeoutDuration) {
    var vals = ['wait for'];
    Object.keys(params).forEach(function (key) {
        vals.push(key + ': ' + params[key]);
    });
    vals.push('INFO_BAR');
    log.apply(this, vals);

    var timeout = params.timeout !== undefined ?
        params.timeout : timeoutDuration;

    if (params.url) {
        return waitURL(params, timeout);
    } else if (params.selector) {
        return waitSelector(params, timeout);
    } else if (params.visible) {
        return waitVisible(params, timeout);
    } else if (params.hidden) {
        return waitHidden(params, timeout);
    } else if (params.time !== undefined) {
        return waitTime(params, timeout);
    } else if (params.resource) {
        return waitResource(params, timeout);
    }
    log('no action found for ', params, 'ERROR');
    throw new Error('no action found');
};
