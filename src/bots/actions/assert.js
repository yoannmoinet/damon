module.exports = function (params) {
    var output;
    try {
        if (params.attribute) {
            log('assert attribute', params.attribute, 'INFO_BAR');
            this.helpers.assertion.attribute(params);
        } else if (params.variable) {
            log('assert variable', params.variable, 'INFO_BAR');
            this.helpers.assertion.variable(params);
        } else if (params.key) {
            log('assert key', params.key, 'INFO_BAR');
            this.helpers.assertion.key(params);
        } else {
            log('no assertion found', 'ERROR');
            throw new Error('no assertion found');
        }
    }
    catch (err) {
        output = 'FAILED: expected \'' + err.expected + '\' but got \'' +
            err.actual + '\'';
        log(output, 'TEST_FAILED');
        throw new Error('assert failed');
    }
    output = 'PASS: got \'' + params.expected + '\'';
    return log(output, 'TEST_SUCCESS');
};
