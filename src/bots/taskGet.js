//This function splits any kind of javascript accessors into a list
//For example var.attr1['attr2'].attr3 will give the following list
//['var', 'attr1', 'attr2', 'attr3']
function splitAccessors (variable) {
    var accessors = [];

    //This RegExp is used to capture the first object of a bracket notation
    //It captures everything before an open square bracket
    //For example it will capture 'obj' in the expression obj['prop1']['prop2']
    var objectRegexp = /[^\[]+/;

    //This RegExp is used to capture all properties of a bracket notation
    //It captures everything in between [' '] or [" "]
    //For example it will capture 'prop1' and 'prop2' in the above expression
    var propertiesRegexp = /\['(.+?)'\]|\["(.+?)"\]/g;

    //This RegExp is a combination of the two RegExp above
    //Make sure that each component follows the correct bracket notation
    //[a-zA-Z_$][0-9a-zA-Z_$]* is to make sure that the captured variable has a valid variable name
    var validationRegexp = /^[a-zA-Z_$][0-9a-zA-Z_$]*(\['[a-zA-Z_$][0-9a-zA-Z_$]*'\]|\["[a-zA-Z_$][0-9a-zA-Z_$]*"\])*$/;
    var components = variable.split('.');

    for (var n = 0; n < components.length; n++) {
        var component = components[n];
        var object = component.match(objectRegexp);
        var property = propertiesRegexp.exec(component);

        if (!validationRegexp.test(component)) {
            //casper's log doesn't exist when running tests
            if (typeof log !== 'undefined') {
                log(variable + ' has an invalid syntax', 'ERROR');
            }
            return;
        }

        if (object) {
            accessors = accessors.concat(object);
        }

        while (property !== null) {
            //property[1] holds the value that satisfies [' ']
            //property[2] holds the value that satisfies [" "]
            accessors = accessors.concat(property[1] || property[2]);
            property = propertiesRegexp.exec(component);
        }

    }
    return accessors;
}

//This function retrieve a list of accessors
//Set the first accessor as the main object
//Get the value of window.object using casper.evaluate()
//Access continuously to the next property until the end of the list
function getVariable (casper, params) {
    var object;
    var variableValue;
    var accessors = splitAccessors(params.variable);

    if (accessors) {
        object = accessors.shift();
        variableValue = casper.evaluate(function (object) {
            return window[object];
        }, object);

        accessors.forEach(function (property) {
            if (variableValue == undefined) {
                return;
            }
            variableValue = variableValue[property];
        });
        return variableValue;
    }
    return;
}

//This function retrieves the first attribute or text of the selector
//Apply the RegExp if there is one
function getAttribute (casper, params) {
    var attributeValue;

    if (!casper.exists(params.selector)) {
        return;
    }

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

    //when getting an HTML attribute, '' is equivalent of not existing, so undefined
    if (attributeValue === '') {
        return;
    }
    return attributeValue;
}

module.exports = {
    getAttribute: getAttribute,
    getVariable: getVariable,
    splitAccessors: splitAccessors
};
