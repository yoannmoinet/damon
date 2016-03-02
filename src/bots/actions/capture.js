module.exports = function (params, timeoutDuration, cwd) {
    log('capture', params.name, 'INFO_BAR');
    return casper.capture(
        cwd + '/captures/' + params.name,
        params.selector
    );
};
