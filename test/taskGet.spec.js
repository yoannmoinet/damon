describe('taskGet', function () {
    var expect = require('expect.js');
    var taskGet = require('../src/bots/taskGet.js');

    describe('splitAccessors', function() {
        it('should split var.attr into ["var", "attr"]', function () {
            var test = taskGet.splitAccessors('var.attr');
            expect(test).to.eql(['var', 'attr']);
        });

        it('should split var[\'attr\'] into ["var", "attr"]', function () {
            var test = taskGet.splitAccessors('var[\'attr\']');
            expect(test).to.eql(['var', 'attr']);
        });

        it('should split var["attr"] into ["var", "attr"]', function () {
            var test = taskGet.splitAccessors('var["attr"]');
            expect(test).to.eql(['var', 'attr']);
        });

        it('should split var[\'attr1\']["attr2"] into ["var", "attr"]', function () {
            var test = taskGet.splitAccessors('var[\'attr1\']["attr2"]');
            expect(test).to.eql(['var', 'attr1', 'attr2']);
        });

        it('should split var.attr1[\'attr2\'].attr3["attr4"].attr5 into ["var", "attr1", "attr2", "attr3", "attr4", "attr5"]', function () {
            var test = taskGet.splitAccessors('var.attr1[\'attr2\'].attr3["attr4"].attr5');
            expect(test).to.eql(['var', 'attr1', 'attr2', 'attr3', 'attr4', 'attr5']);
        });

        it('should return undefined for \'\'', function () {
            var test = taskGet.splitAccessors('');
            expect(test).to.be(undefined);
        });

        it('should return undefined for 1', function () {
            var test = taskGet.splitAccessors('1');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var[attr]', function () {
            var test = taskGet.splitAccessors('var[attr]');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var.[\'attr\']', function () {
            var test = taskGet.splitAccessors('var.[\'attr\']');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var.attr\'][\'attr2\']', function () {
            var test = taskGet.splitAccessors('var.attr\'][\'attr2\']');
            expect(test).to.be(undefined);
        });

        it('should return undefined for var[\'attr"]', function () {
            var test = taskGet.splitAccessors('var[\'attr"]');
            expect(test).to.be(undefined);
        });
    });

    describe('getVariable', function() {
        //TODO: Find a way to test casperJS in the context of NodeJS with Mocha
    });

    describe('getAttribute', function() {
        //TODO: Find a way to test casperJS in the context of NodeJS with Mocha
    });
});
