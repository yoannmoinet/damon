module.exports = function (params, timeoutDuration, cwd) {
    log('navigate', params.url, 'INFO_BAR');

    var toReturn = this.waitForUrl(params.url, function () {
        log('got', params.url, 'SUCCESS');
    }, function () {
        log('timeout url', params.url, 'WARNING');
    }, timeoutDuration);

    this.open(params.url, {
        method: params.method,
        data: params.data,
        headers: params.headers,
        encoding: params.encoding
    });

    return toReturn;
};
