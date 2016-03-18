var timeoutDuration = 20000;

var config = function (cwd) {
    var template = this.plugins.template;
    var xpath = this.plugins.xpath;
    var actions = {
        assert: require('./actions/assert.js').bind(this),
        capture: require('./actions/capture.js').bind(this),
        dom: require('./actions/dom.js').bind(this),
        get: require('./actions/get.js').bind(this),
        request: require('./actions/request.js').bind(this),
        wait: require('./actions/wait.js').bind(this),
        download: require('./actions/download.js').bind(this)
    };

    return {
        execute: function (task) {
            if (task.type && actions[task.type]) {
                var response;
                task = template.parse(task);
                task.params = xpath.parse(task.params);

                response = actions[task.type](
                    task.params,
                    timeoutDuration,
                    cwd
                );

                if (task.type === 'get') {
                    template.store(task.params.key, response);
                }
                return response;
            } else {
                log('no task found for: ', task, 'ERROR');
                throw new Error('no task found');
            }
        }.bind(this),
        navigate: function (url, next) {
            // Template the url just in case
            url = template.parse({params: url}).params;
            log('navigate to', url, 'INFO_BAR');
            var loadSuccess = function (status) {
                this.removeListener('load.failed', loadFailed);
                this.removeListener('load.finished', loadSuccess);
                if (status === 'fail') {
                    next('fail');
                } else {
                    next();
                }
            };
            var loadFailed = function (err) {
                this.removeListener('load.failed', loadFailed);
                this.removeListener('load.finished', loadSuccess);
                next(err);
            };
            this.on('load.failed', loadFailed);
            this.on('load.finished', loadSuccess);
            return this.start(url);
        }.bind(this)
    };
};

module.exports = {
    config: config
};
