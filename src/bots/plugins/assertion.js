var expect = require('expect.js');

function variable (params) {
    testValue = this.plugins.get.getVariable(params.variable);
    return expect(params.expected).to.be.eql(testValue);
};

function attribute (params) {
    testValue = this.plugins.get.getAttribute(params);
    return expect(params.expected).to.be.eql(testValue);
};

function key (params) {
    testValue = this.plugins.template.get(params.key);
    return expect(params.expected).to.be.eql(testValue);
};

module.exports = function () {
    return {
        variable: variable.bind(this),
        attribute: attribute.bind(this),
        key: key.bind(this)
    };
};
