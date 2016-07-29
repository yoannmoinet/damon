var config = function (cwd) {
    //Extend Casper with helper modules
    this.plugins = {
        request: require('./plugins/request.js').call(this),
        template: require('./plugins/template.js').call(this),
        get: require('./plugins/get.js').call(this),
        assertion: require('./plugins/assertion.js').call(this),
        xpath: require('./plugins/xpath.js').call(this)
    };

    var template = this.plugins.template;
    var xpath = this.plugins.xpath;

    var http = require('./actions/http.js');

    var actions = {
        assert: require('./actions/assert.js').bind(this),
        capture: require('./actions/capture.js').bind(this),
        dom: require('./actions/dom.js').bind(this),
        get: require('./actions/get.js').bind(this),
        request: require('./actions/request.js').bind(this),
        wait: require('./actions/wait.js').bind(this),
        download: require('./actions/download.js').bind(this),
        navigate: http.navigate.bind(this),
        status: http.status.bind(this),
        redirection: http.redirection.bind(this)
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
        }.bind(this)
    };
};

module.exports = {
    config: config
};
