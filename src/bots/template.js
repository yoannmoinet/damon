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

function parseTask (task) {
    var handlebarRegex = new RegExp('{{([^{}]+)}}', 'g');
    for (param in task.params) {
        var paramValue = task.params[param];
        if (handlebarRegex.test(paramValue)) {
            task.params[param] = replaceHandlebars(paramValue);
        }
    }
    return task;
}

module.exports = {
    parse: parseTask,
    store: storeKeyValue
}