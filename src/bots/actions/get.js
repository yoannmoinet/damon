function getAttribute (params) {
    var returnValue = this.plugins.get.getAttribute(params);
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
}

function getResource (params) {
    var resourceMatcher = this.plugins.get.encodeResource(
        params.resource,
        params.regexp
    );

    var returnValue = this.plugins.get.getResource(
        resourceMatcher,
        params.method,
        params.variable
    );

    if (returnValue !== undefined) {
        log('got resource: ' + params.resource, 'SUCCESS');
        return returnValue;
    }
    log('no resource found for: ' + params.resource, 'ERROR');
    throw new Error('no resource found');
}

function getVariable (params) {
    var returnValue = this.plugins.get.getVariable(params.variable);
    if (returnValue !== undefined && returnValue !== null) {
        log('got global variable: ' + params.variable, 'SUCCESS');
        return returnValue;
    }
    log('no variable found for: ' + params.variable, 'ERROR');
    throw new Error('no value found');
}

module.exports = function (params) {
    if (params.attribute) {
        return getAttribute.call(this, params);
    } else if (params.resource) {
        return getResource.call(this, params);
    } else if (params.variable) {
        return getVariable.call(this, params);
    }
    log('no action found for ', params, 'ERROR');
    throw new Error('no action found');
};
