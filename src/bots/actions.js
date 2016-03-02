var template = require('./helpers/template.js');

var timeoutDuration = 10000;

var actions = {
    assert: require('./actions/assert.js').bind(casper),
    capture: require('./actions/capture.js').bind(casper),
    dom: require('./actions/dom.js').bind(casper),
    get: require('./actions/get.js').bind(casper),
    request: require('./actions/request.js').bind(casper),
    wait: require('./actions/wait.js').bind(casper)
};

var config = function (casper, cwd) {
    return {
        execute: function (task) {
            if (task.type && actions[task.type]) {
                var response;
                task = template.parse(task);
                response = actions[task.type](
                    task.params,
                    timeoutDuration,
                    cwd);

                if (task.type === 'get') {
                    template.store(task.params.key, response);
                }
                return response;
            } else {
                log('no task found for: ', task, 'ERROR');
                throw new Error('no task found');
            }
        },
        navigate: function (url, next) {
            log('navigate to', url, 'INFO_BAR');
            var loadSuccess = function (status) {
                casper.removeListener('load.failed', loadFailed);
                casper.removeListener('load.finished', loadSuccess);
                if (status === 'fail') {
                    next('fail');
                } else {
                    next();
                }
            };
            var loadFailed = function (err) {
                casper.removeListener('load.failed', loadFailed);
                casper.removeListener('load.finished', loadSuccess);
                next(err);
            };
            casper.on('load.failed', loadFailed);
            casper.on('load.finished', loadSuccess);
            return casper.start(url);
        }
    };
};

module.exports = {
    config: config
};
