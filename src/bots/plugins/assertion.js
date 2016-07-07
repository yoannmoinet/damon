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

function url (params) {
    this.evaluate(this.plugins.request.testXHR, params);

    return this.waitFor(function check() {
        return this.evaluate(function() {
            return window.__STATUS__;
        });
    }, function then() {
        var testValue = this.plugins.request.getAndResetTestXHRStatus();
        if (params.regexp) {
            var regex = new RegExp(params.expected);
            return expect(regex.test(testValue)).to.be.ok();
        }
        return expect(params.expected).to.be.eql(testValue);
    });
};

module.exports = function () {
    return {
        variable: variable.bind(this),
        attribute: attribute.bind(this),
        key: key.bind(this),
        url: url.bind(this)
    };
};
