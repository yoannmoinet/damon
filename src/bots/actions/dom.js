var domActions = {
    fill: function (opts) {
        return this.sendKeys(opts.selector, opts.text, {reset: true});
    },
    click: function (opts) {
        return this.click(opts.selector);
    }
};

module.exports = function (params, timeoutDuration) {
    log('dom action', params.do, params.selector, 'INFO_BAR');
    if (params.selector && params.do) {
        var timeout = params.timeout !== undefined ?
            params.timeout : timeoutDuration;

        log('waiting for', params.selector, 'INFO_BAR');
        return this.waitUntilVisible(params.selector, function () {
            log('got', params.selector, 'SUCCESS');

            if (domActions[params.do]) {
                return domActions[params.do].call(this, params);
            }
            log('no dom action found for ' + params.do, 'ERROR');
            throw new Error('no dom action');

        }, function () {
            log('timeout, can\'t load dom', params.selector, 'WARNING');
        },timeout);
    }
    throw new Error('missing params');
};
