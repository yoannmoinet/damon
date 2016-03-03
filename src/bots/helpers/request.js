function xhr (opts) {
    var request = new XMLHttpRequest();
    var method = opts.method && opts.method.toUpperCase() || 'GET';
    var contentType = opts.contentType || 'application/json;charset=UTF-8';
    var dataString = '';

    // Create a sync XHR, hence the `false` part.
    request.open(method, opts.url, false);

    if (opts.mimeType) {
        request.overrideMimeType(opts.mimeType);
    }

    // Handle payload in case we have a PUT or a POST
    if (method === 'POST' || method === 'PUT') {
        if (typeof opts.payload === 'object') {
            dataString = JSON.stringify(opts.payload);
        } else if (typeof opts.payload === 'string') {
            dataString = opts.payload;
        }
        request.setRequestHeader('Content-Type', contentType);
    }

    // Override headers if needed
    if (typeof opts.headers === 'object') {
        for (var i in opts.headers) {
            request.setRequestHeader(i, opts.headers[i]);
        }
    }

    // Send everything.
    request.send(method === 'POST' || method === 'PUT' ? dataString : null);

    // If we don't have success, error
    if (request.readyState !== 4 && request.status !== '200') {
        return log('Request errored', 'ERROR');
    }

    return request.responseText;
}

function handleStore (store, data) {
    if (store.variable) {
        var parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            // not a json.
            return log(
                'Couldn\'t parse the data to extract any value',
                'ERROR'
            );
        }
        casper.helpers.template.store(
            store.key,
            casper.helpers.get.getVariable(store.variable, parsedData)
        );
    } else {
        casper.helpers.template.store(store.key, data);
    }
}

module.exports = {
    xhr: xhr,
    handleStore: handleStore
};
