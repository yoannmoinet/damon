var expect = require('expect.js');
var taskGet = require('./taskGet.js');
var template = require('./template.js');

var assertion = function (casper) {
    var testValue;
    return {
        variable: function (params) {
            testValue = taskGet.getVariable(casper, params);
            return expect(params.expected).to.be.eql(testValue);
        },
        attribute: function (params) {
            testValue = taskGet.getAttribute(casper, params);
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
