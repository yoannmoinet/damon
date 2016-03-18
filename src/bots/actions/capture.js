module.exports = function (params, timeoutDuration, cwd) {
    log('capture', params.name, 'INFO_BAR');
    return this.capture(cwd + '/captures/' + params.name);
};
