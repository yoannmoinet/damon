describe('get', function () {
    var expect = require('expect.js');
    var get = require('../src/bots/helpers/get.js');
    var casperStub = {
        exists: function (selector) {
            if (selector === '#id') {
                return true;
            }
            return false;
        },
        getElementInfo: function (selector) {
            return {
                text: 'value'
            };
        },
        getElementAttribute: function (selector, attribute) {
            if (attribute === 'empty') {
                return '';
            }
            return 'random value';
        },
        evaluate: function (selector) {
            return {
                inside: {
                    attribute: 'value'
                }
            };
        }
    };

    describe('splitAccessors', function() {
        it('should split var.attr into ["var", "attr"]', function () {
            var test = get.splitAccessors('var.attr');
            expect(test).to.eql(['var', 'attr']);
        });

        it('should split var[\'attr\'] into ["var", "attr"]', function () {
            var test = get.splitAccessors('var[\'attr\']');
            expect(test).to.eql(['var', 'attr']);
        });

        it('should split var["attr"] into ["var", "attr"]', function () {
            var test = get.splitAccessors('var["attr"]');
            expect(test).to.eql(['var', 'attr']);
        });

        it('should split var[\'attr1\']["attr2"] into ["var", "attr"]', function () {
            var test = get.splitAccessors('var[\'attr1\']["attr2"]');
            expect(test).to.eql(['var', 'attr1', 'attr2']);
        });

        it('should split var.attr1[\'attr2\'].attr3["attr4"].attr5 into ["var", "attr1", "attr2", "attr3", "attr4", "attr5"]', function () {
            var test = get.splitAccessors('var.attr1[\'attr2\'].attr3["attr4"].attr5');
            expect(test).to.eql(['var', 'attr1', 'attr2', 'attr3', 'attr4', 'attr5']);
        });

        it('should return undefined for \'\'', function () {
            var test = get.splitAccessors('');
            expect(test).to.be(undefined);
        });

        it('should return undefined for 1', function () {
            var test = get.splitAccessors('1');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var[attr]', function () {
            var test = get.splitAccessors('var[attr]');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var.[\'attr\']', function () {
            var test = get.splitAccessors('var.[\'attr\']');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var.attr\'][\'attr2\']', function () {
            var test = get.splitAccessors('var.attr\'][\'attr2\']');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var[\'attr"]', function () {
            var test = get.splitAccessors('var[\'attr"]');
            expect(test).to.be(undefined);
        });
    });

    describe('getVariable', function() {
        it('should return the value hosted inside an defined object', function () {
            var test = get.getVariable(casperStub, 'key.inside.attribute');
            expect(test).to.be('value');
        });

        it('should return undefined for an inextant attribute of an object', function () {
            var test = get.getVariable(casperStub, 'unknown.object');
            expect(test).to.be(undefined);
        });
    });

    describe('getAttribute', function() {
        it('should return the text value of an element', function () {
            var test = get.getAttribute(casperStub, {attribute: '@text', selector: '#id'});
            expect(test).to.be('value');
        });

        it('should return the value of an element\'s attribute', function () {
            var test = get.getAttribute(casperStub, {attribute: 'key', selector: '#id'});
            expect(test).to.be('random value');
        });

        it('should return what the modifier passed along captures', function () {
            var test = get.getAttribute(casperStub, {attribute: 'key', selector: '#id', modifier: '[^ ]*'});
            expect(test).to.be('random');
        });

        it('should return undefined when an element doesn\'t exist', function () {
            var test = get.getAttribute(casperStub, {attribute: 'key', selector: '#notExisting'});
            expect(test).to.be(undefined);
        });

        it('should return undefined when an attribute is empty', function () {
            var test = get.getAttribute(casperStub, {attribute: 'empty', selector: '#id'});
            expect(test).to.be(undefined);
        });

        it('should return undefined when the modifier doesn\'t capture anything', function () {
            var test = get.getAttribute(casperStub, {attribute: 'key', selector: '#id', modifier: '[^a-zA-Z ]'});
            expect(test).to.be(undefined);
        });
    });
});
