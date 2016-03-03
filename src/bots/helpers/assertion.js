var expect = require('expect.js');

function variable (params) {
    testValue = casper.helpers.get.getVariable(params.variable);
    return expect(params.expected).to.be.eql(testValue);
};

function attribute (params) {
    testValue = casper.helpers.get.getAttribute(params);
    return expect(params.expected).to.be.eql(testValue);
};

function key (params) {
    testValue = casper.helpers.template.get(params.key);
    return expect(params.expected).to.be.eql(testValue);
};

module.exports = {
    variable: variable,
    attribute: attribute,
    key: key
};
