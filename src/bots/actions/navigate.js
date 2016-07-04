module.exports = function (params, timeoutDuration, cwd) {
    var failTimeout;

    log('navigate', params.url, 'INFO_BAR');

    var toReturn = this.waitForUrl(params.url, function () {
        log('got', params.url, 'SUCCESS');
    }, function () {
        log('timeout url', params.url, 'WARN');
    }, timeoutDuration);

    var clean = function () {
        clearTimeout(failTimeout);
        this.removeListener('load.failed', cancelOpen);
    }.bind(this);

    var cancelOpen = function () {
        clean();

        // Tell casper to ignore errors due to page cancellation
        this.options._ignoreErrors = true;
        this.unwait();
        this.clear();
        this.page.stop();
    }.bind(this);

    // Attach events
    this.on('load.failed', cancelOpen);

    // Add a timeout to fail the task after some time
    // TODO find a way to make it work eventhough phantomjs is taking all the event-loops.
    failTimeout = setTimeout(cancelOpen, timeoutDuration);

    // Open the page
    this.open(params.url, {
        method: params.method,
        data: params.data,
        headers: params.headers,
        encoding: params.encoding
    });

    toReturn.then(clean);

    return toReturn;
};
