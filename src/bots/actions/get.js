var getHelper = require('../helpers/getHelper.js');

module.exports = function (params) {
    var returnValue;
    if (params.attribute) {

        returnValue = getHelper.getAttribute(casper, params);
        if (returnValue !== undefined) {
            log('got', params.attribute + ' of ' + params.selector,
                returnValue, 'SUCCESS');
            return returnValue;
        }
        log('no attribute "' + params.attribute +
            '" found for selector "' + params.selector +
            '" and ' + (params.modifier || 'without') +
            ' modifier', 'ERROR');
        throw new Error('no attribute found');

    } else if (params.resource) {

        var resourceMatcher = getHelper.encodeResource(params.resource,
            params.regexp);

        returnValue = getHelper.getResource(casper, resourceMatcher,
            params.method, params.variable);
        if (returnValue !== undefined) {
            log('got resource: ' + params.resource, 'SUCCESS');
            return returnValue;
        }
        log('no resource found for: ' + params.resource, 'ERROR');
        throw new Error('no resource found');

    } else if (params.variable) {

        returnValue = getHelper.getVariable(casper, params.variable);
        if (returnValue !== undefined && returnValue !== null) {
            log('got global variable: ' + params.variable, 'SUCCESS');
            return returnValue;
        }
        log('no variable found for: ' + params.variable, 'ERROR');
        throw new Error('no value found');

    }
    log('no action found for ', params, 'ERROR');
    throw new Error('no action found');
};
