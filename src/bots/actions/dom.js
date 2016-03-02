var dom = function (casper, params, timeoutDuration) {
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

        }, function () {
            log('timeout, can\'t load dom', params.selector, 'WARNING');
        },timeout);
    }
    throw new Error('missing params');
};

module.exports = {
    dom: dom
};
