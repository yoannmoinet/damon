var expect = require('expect.js');

function variable (params) {
    var get = casper.helpers.get;
    testValue = get.getVariable(casper, params.variable);
    return expect(params.expected).to.be.eql(testValue);
};

function attribute (params) {
    var get = casper.helpers.get;
    testValue = get.getAttribute(casper, params);
    return expect(params.expected).to.be.eql(testValue);
};

function key (params) {
    var template = casper.helpers.template;
    testValue = template.get(params.key);
    return expect(params.expected).to.be.eql(testValue);
};

module.exports = {
    variable: variable,
    attribute: attribute,
    key: key
};
