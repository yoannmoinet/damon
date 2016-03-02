var expect = require('expect.js');
var get = require('./get.js');
var template = require('./template.js');

var assertion = function (casper) {
    var testValue;
    return {
        variable: function (params) {
            testValue = get.getVariable(casper, params.variable);
            return expect(params.expected).to.be.eql(testValue);
        },
        attribute: function (params) {
            testValue = get.getAttribute(casper, params);
            return expect(params.expected).to.be.eql(testValue);
        },
        key: function (params) {
            testValue = template.get(params.key);
            return expect(params.expected).to.be.eql(testValue);
        }
    };
};

module.exports = {
    assertion: assertion
};
