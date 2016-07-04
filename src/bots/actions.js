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
        download: require('./actions/download.js').bind(this),
        navigate: require('./actions/navigate.js').bind(this)
    };

    return {
        execute: function (task) {
            if (task.type && actions[task.type]) {
                var response;
                task = template.parse(task);
                task.params = xpath.parse(task.params);

                response = actions[task.type](
                    task.params,
                    task.params && task.params.timeout !== undefined ?
                        task.params.timeout : this.options.waitTimeout,
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
        start: function (url, next) {
            var failTimeout;
            // Template the url just in case
            url = template.parse({params: url}).params;
            log('start on', url, 'INFO_BAR');
            var loadSuccess = function (status) {
                clearTimeout(failTimeout);
                this.removeListener('load.failed', loadFailed);
                this.removeListener('load.finished', loadSuccess);
                if (status === 'fail') {
                    next('fail');
                } else {
                    next();
                }
            };
            var loadFailed = function (err) {
                casper.options._ignoreErrors = true;
                clearTimeout(failTimeout);
                this.removeListener('load.failed', loadFailed);
                this.removeListener('load.finished', loadSuccess);
                this.clear();
                this.page.stop();
                next(err);
            };
            // Attach events
            this.on('load.failed', loadFailed);
            this.on('load.finished', loadSuccess);

            // Fail first step if going further than the set up timeout
            failTimeout = setTimeout(
                loadFailed.bind(this, 'timeout waitFor'),
                this.options.waitTimeout
            );
            return this.start(url);
        }.bind(this)
    };
};

module.exports = {
    config: config
};
