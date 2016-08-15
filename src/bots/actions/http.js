// All available statuses
var _status = [
    200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
    300, 301, 302, 303, 304, 305, 306, 307, 308,
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
    414, 415, 416, 417, 422, 423, 424, 426, 428, 429, 431,
    500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511
];
var _loadDone = false;
var _loadSuccess = false;
var _failTimeout;
var _handlers = {};

// TODO We might want to move both following functions into their own plugin
var on = function (evt, handler) {
    if (!_handlers[evt]) {
        _handlers[evt] = [];
    }
    _handlers[evt].push(handler);
    casper.on(evt, handler);
};

var off = function (evt, handler) {
    var i;
    var toRemove = {};
    // Handlers looper/remover
    var loopHandlers = function (hdlrs, evtName) {
        hdlrs.forEach(function (h, i) {
            if (!handler || h === handler) {
                casper.removeListener(evt, h);
                toRemove[evtName] = toRemove[evtName] || [];
                toRemove[evtName].push(i);
            }
        });
    };

    // Remove eventListener(s)
    if (evt) {
        if (_handlers[evt]) {
            loopHandlers(_handlers[evt], evt);
        }
    } else {
        for (i in _handlers) {
            loopHandlers(_handlers[i], i);
        }
    }

    // Clean handlers index
    if (Object.keys(toRemove).length) {
        var obj;
        var newHandlers = {};
        for (i in _handlers) {
            _handlers[i].forEach(function (handler, j) {
                // If we don't have this one in the toRemove index
                // we can transfer it into the new handlers index.
                if (!toRemove[i] || toRemove[i].indexOf(j) === -1) {
                    newHandlers[i] = newHandlers[i] || [];
                    newHandlers[i].push(handler);
                }
            });
        }
        // Swap it.
        _handlers = newHandlers;
    }
};

var unlistenStatus = function () {
    _status.forEach(function (st) {
        if (_handlers['http.status.' + st]) {
            off('http.status.' + st);
        }
    });
};

var clean = function () {
    clearTimeout(_failTimeout);
    off('load.finished');
    unlistenStatus();
};

var cancelOpen = function () {
    clean();
    // Tell casper to ignore errors due to page cancellation
    casper.options._ignoreErrors = true;
    casper.clear();
    casper.page.stop();
    _loadDone = true;
};

var navigate = function (params, timeoutDuration, cwd) {
    var url = (params.url || params.from);
    _loadSuccess = false;

    var finished = function (st) {
        clean();
        _loadSuccess = st !== 'fail';
        _loadDone = true;
    };

    log('navigate', url, 'INFO_BAR');
    var toReturn = casper.waitFor(function () {
        return _loadDone === true;
    }, function () {
        if (!_loadSuccess) {
            log('problem loading', url, 'ERROR');
            throw new Error('can\'t navigate to url ' + url);
        }
        log('got', url, 'SUCCESS');
    }, function () {
        log('timeout url', url, 'WARN');
    }, timeoutDuration);

    // Attach event
    on('load.finished', finished);

    // Add a timeout to fail the task after some time
    // TODO find a way to make it work eventhough phantomjs is taking all the event-loops.
    _failTimeout = setTimeout(cancelOpen, timeoutDuration);

    // Open the page
    casper.open(url, {
        method: params.method,
        data: params.data,
        headers: params.headers,
        encoding: params.encoding
    });

    return toReturn;
};

var status = function (params, timeoutDuration, cwd) {
    if (!params.status || (!params.url && !params.from)) {
        throw new Error('missing parameter');
    }

    var hasFinished = false;
    var statusSuccess = false;

    // Create a custom waitFor catching the status.
    var toReturn = casper.waitFor(function () {
        return hasFinished;
    }, function () {
        if (!statusSuccess) {
            log('problem', params.status, 'ERROR');
            throw new Error('didn\'t get status');
        }
        log('got', params.status, 'SUCCESS');
    }, function () {
        log('timeout status', params.url, 'WARN');
    }, timeoutDuration);

    var listenStatus = function (st, hdlr) {
        if (!(st instanceof Array)) {
            st = [st];
        }

        st.forEach(function (st) {
            on('http.status.' + st, hdlr);
        });
    };

    var handler = function (resp) {
        if (statusSuccess) {
            log('Should\'nt print that', 'FATAL');
            return;
        }
        if (!params.to) {
            statusSuccess = true;
        } else if (params.to === resp.redirectURL) {
            statusSuccess = true;
        }
        // Consider the navigate task as successful
        // to avoid any bubbling up error to the task runner.
        _loadSuccess = true;
        // Cancel the navigate task.
        cancelOpen();
        hasFinished = true;
    };

    // Once we catch the status, we cancel the call and report.
    listenStatus(params.status, handler);

    // Navigate to the URL
    navigate(params, timeoutDuration, cwd)
        .then(function () {
            hasFinished = true;
        });

    return toReturn;
};

var redirection = function (params, timeoutDuration, cwd) {
    params.status = [301, 302];
    return status(params, timeoutDuration, cwd);
};

module.exports = {
    navigate: navigate,
    status: status,
    redirection: redirection
};
