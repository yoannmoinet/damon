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