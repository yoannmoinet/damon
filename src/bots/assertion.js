var expect = require('expect.js');
var taskGet = require('./taskGet.js');

var assertion = function (casper) {
    return {
        variable: function (params) {
            var testValue = taskGet.getVariable(casper, params);
            return expect(params.expected).to.be.eql(testValue);
        },
        attribute: function (params) {
            var testValue = taskGet.getAttribute(casper, params);
            return expect(params.expected).to.be.eql(testValue);
        }
    };
};

module.exports = {
    assertion: assertion
};
