//This function splits any kind of javascript accessors into a list
//For example var.attr1['attr2'].attr3 will give the following list
//[var, attr1, attr2, attr3]
function stripAccessors (variable) {
    var accessors = [];

    //This RegExp is used to capture the first object of a bracket notation
    //For example it will capture 'obj' in the expression obj['prop1']['prop2']
    var objectRegexp = /[^\[]+/;

    //This RegExp is used to capture all properties of a bracket notation
    //For example it will capture 'prop1' and 'prop2' in the above expression
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
    //Retrieve a list of accessors and set the first one as the main object
    var accessors = stripAccessors(params.variable);
    var object = accessors.shift();

    //Get the value of window.object using casper.evaluate()
    var variableValue = casper.evaluate(function (object) {
        return window[object];
    }, object);

    //Access continuously to the next property until the end of the list
    accessors.forEach(function (property) {
        variableValue = variableValue[property];
    });

    return variableValue;
}

function getAttribute (casper, params) {
    var attributeValue;

    //Retrieve the first attribute or text of the selector
    if (params.attribute === '@text') {
        attributeValue = casper.getElementInfo(params.selector).text;
    } else {
        attributeValue = casper.getElementAttribute(params.selector,
            params.attribute);
    }

    //Apply the RegExp if there is one
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