var store = {};

function storeKeyValue (key, value) {
    store[key] = value;
}

function replaceHandlebars (string) {
    for (key in store) {
        string = string.replace(new RegExp('{{' + key + '}}','g'), store[key]);
    }
    return string;
}

//Replace any Handlebars {{key}} expression in params of a task by the value
function parseTask (task) {
    //This RegExp detects any Handlebars expression {{value}} in a string
    //It is used to determine if a param has Handlbars that need to be replaced
    var handlebarRegex = new RegExp('{{([^{}]+)}}');
    var loop = function (text) {
        if (typeof text === 'object') {
            for (var i in text) {
                text[i] = loop(text[i]);
            }
        } else {
            if (handlebarRegex.test(text)) {
                text = replaceHandlebars(text);
            }
        }
        return text;
    };
    task.params = loop(task.params);
    return task;
}

function getKeyValue (key) {
    return this.plugins.get.getVariable(key, store);
}

module.exports = function () {
    return {
        parse: parseTask,
        store: storeKeyValue,
        get: getKeyValue.bind(this)
    };
};
