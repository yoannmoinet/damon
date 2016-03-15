module.exports = function (params, timeoutDuration, cwd) {
    log('download', params.name, 'INFO_BAR');
    return this.download(
        params.url,
        cwd + '/download/' + params.name,
        params.method,
        params.data
    );
};
