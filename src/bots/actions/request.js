var request = require('../helpers/request.js');
var template = require('../helpers/template.js');
var get = require('../helpers/get.js');

module.exports = function (params) {
    // Control what's needed to pursue
    if (!params || !params.url) {
        log('missing `url` params for the request action',
            params, 'ERROR');
        throw new Error('missing `url` params');
    }

    // Get the data from the request.
    var data = casper.evaluate(request.xhr, params);

    // And store it if needed later.
    if (params.store) {
        if (!params.store.key) {
            log('missing params for store', 'ERROR');
            throw new Error('missing params');
        }
        request.handleStore(template, get, params.store, data);
    }

    // Return it.
    return data;
};
