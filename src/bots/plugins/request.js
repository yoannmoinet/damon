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
        log('Request errored', 'ERROR');
        throw new Error('Request errored');
    }

    return request.responseText;
}

function testXHR(opts) {
    var xhr = new XMLHttpRequest();

    if (opts.https === false) {
        opts.url = opts.url.replace('https', 'http');
    }

    try {
        xhr.open('GET', opts.url, true);
    } catch (e) {
        log('xhr creation error:', e, 'ERROR');
        throw new Error('xhr creation error');
    }

    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('progress', function () {
        if (xhr.status) {
            window.__STATUS__ = window.__STATUS__ || xhr.status;
            xhr.abort();
        }
    });
    xhr.addEventListener('error', function () {
        window.__STATUS__ = window.__STATUS__ || xhr.status;
    });
    xhr.addEventListener('load', function () {
        window.__STATUS__ = window.__STATUS__ || xhr.status;
    });
    xhr.send(null);
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
        this.plugins.template.store(
            store.key,
            this.plugins.get.getVariable(store.variable, parsedData)
        );
    } else {
        this.plugins.template.store(store.key, data);
    }
}

function getAndResetTestXHRStatus() {
    return this.evaluate(function () {
        var returnValue = window.__STATUS__;
        window.__STATUS__ = undefined;
        return returnValue;
    });
}

module.exports = function () {
    return {
        xhr: xhr,
        handleStore: handleStore.bind(this),
        testXHR: testXHR,
        getAndResetTestXHRStatus: getAndResetTestXHRStatus.bind(this)
    };
};
