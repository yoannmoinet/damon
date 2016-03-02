module.exports = function (casper, params, cwd) {
    log('capture', params.name, 'INFO_BAR');
    return casper.capture(
        cwd + '/captures/' + params.name,
        params.selector
    );
};
