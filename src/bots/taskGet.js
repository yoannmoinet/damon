function stripAccessors (variable) {
    var accessors = [];
    var objectRegexp = /[^\[]+/;
    var propertiesRegexp = /\['(.+?)'\]/g;

    variable.split('.').forEach(function (component) {
        var object = component.match(objectRegexp);
        var property = propertiesRegexp.exec(component);

        if (object) {
            accessors = accessors.concat(object);
        }

        while (property !== null) {
            accessors = accessors.concat(property[1]);
            property = propertiesRegexp.exec(component);
        }

    });
    return accessors;
}

function getVariable (casper, params) {
    var accessors = stripAccessors(params.variable);
    var object = accessors.shift();
    var variableValue = casper.evaluate(function (object) {
        return window[object];
    }, object);

    accessors.forEach(function (property) {
        variableValue = variableValue[property];
    });

    return variableValue;
}

function getAttribute (casper, params) {
    var attributeValue;
    if (params.attribute === '@text') {
        attributeValue = casper.getElementInfo(params.selector).text;
    } else {
        attributeValue = casper.getElementAttribute(params.selector,
            params.attribute);
    }

    if (attributeValue && params.modifier) {
        var regexpModifier = new RegExp(params.modifier);
        var matchedRegexp = regexpModifier.exec(attributeValue);

        if (!matchedRegexp) {
            return;
        }
        attributeValue = matchedRegexp[0];
    }
    return attributeValue;
}

module.exports = {
    getAttribute: getAttribute,
    getVariable: getVariable
};