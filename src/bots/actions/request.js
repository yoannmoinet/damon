var requestHelper = require('../helpers/requestHelper.js');
var template = require('../helpers/template.js');
var getHelper = require('../helpers/getHelper.js');

module.exports = function (casper, params) {
    // Control what's needed to pursue
    if (!params || !params.url) {
        log('missing `url` params for the request action',
            params, 'ERROR');
        throw new Error('missing `url` params');
    }

    // Get the data from the request.
    var data = casper.evaluate(requestHelper.xhr, params);

    // And store it if needed later.
    if (params.store) {
        if (!params.store.key) {
            log('missing params for store', 'ERROR');
            throw new Error('missing params');
        }
        requestHelper.handleStore(template, getHelper, params.store, data);
    }

    // Return it.
    return data;
};
