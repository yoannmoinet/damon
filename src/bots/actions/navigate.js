module.exports = function (params, timeoutDuration, cwd) {
    var failTimeout;

    log('navigate', params.url, 'INFO_BAR');

    var toReturn = this.waitForUrl(params.url, function () {
        log('got', params.url, 'SUCCESS');
    }, function () {
        log('timeout url', params.url, 'WARN');
    }, timeoutDuration);

    var cancelOpen = function () {
        clearTimeout(failTimeout);


        // Tell casper to ignore errors due to page cancellation
        this.options._ignoreErrors = true;
        this.unwait();
        this.clear();
        this.page.stop();
    }.bind(this);

    failTimeout = setTimeout(cancelOpen, timeoutDuration);

    this.open(params.url, {
        method: params.method,
        data: params.data,
        headers: params.headers,
        encoding: params.encoding
    });

    toReturn.then(function () {
        clearTimeout(failTimeout);
    });

    return toReturn;
};
