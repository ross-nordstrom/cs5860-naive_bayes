/*global require, process, describe, it, xit, before, beforeEach, after, afterEach */
"use strict";

/***********************************************************************************************************************
 * General Test Dependencies
 **/
var expect = require('expect.js');
var _ = require('underscore');
var async = require('async');

/***********************************************************************************************************************
 * Unit-Under-Test Dependencies
 **/
var CliHelper = require('../lib/cliHelper');

/***********************************************************************************************************************
 * The Tests!
 **/
describe('CliHelper', function () {

    describe('normalizeResults', function () {
        var FUT = CliHelper.normalizeResults;
        var exampleResults = [
            {
                _all: {total: 5525, correct: 2176, false: 3349},
                ham: {total: 4785, correct: 1441, false: 3344},
                spam: {total: 740, correct: 735, false: 5}
            },
            {
                _all: {total: 5529, correct: 3334, false: 2195},
                ham: {total: 4786, correct: 2601, false: 2185},
                spam: {total: 743, correct: 733, false: 10}
            },
            {
                _all: {total: 5515, correct: 3126, false: 2389},
                ham: {total: 4774, correct: 2397, false: 2377},
                spam: {total: 741, correct: 729, false: 12}
            }
        ];

        it('should be a function', function (done) {
            expect(FUT).to.be.a('function');
            return done();
        });
        it('should work on a basic example', function (done) {
            var x = FUT({}, exampleResults);
            var keys = [
                '_all_total', '_all_correct', '_all_false',
                'ham_total', 'ham_correct', 'ham_false',
                'spam_total', 'spam_correct', 'spam_false'
            ];
            expect(x).to.be.an('object');
            expect(x).to.have.keys(keys);
            keys.forEach(function (k) {
                expect(x[k]).to.be.an(Array);
            });
            return done();
        });
        it('should work on a basic example with csv output', function (done) {
            var csv = FUT({csv: true}, exampleResults);
            var keys = [
                '_all_total', '_all_correct', '_all_false',
                'ham_total', 'ham_correct', 'ham_false',
                'spam_total', 'spam_correct', 'spam_false'
            ];

            expect(csv).to.be.a('string');
            var x = _.map(csv.split("\n"), function (row) {
                return row.split(', ');
            });

            expect(x).to.be.an(Array);
            expect(x).to.have.length(1 + _.size(exampleResults));
            keys.forEach(function (k) {
                expect(x[0]).to.contain(k);
            });
            return done();
        });
    }); // describe('normalizeResults')

}); // describe('CliHelper')
