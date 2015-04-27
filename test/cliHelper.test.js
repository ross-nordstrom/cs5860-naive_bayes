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
                _all: {total: 5529, TP: 3609, FN: 0, FP: 1920, TN: 0},
                ham: {total: 4790, TP: 2901, FN: 0, FP: 1889, TN: 0},
                spam: {total: 739, TP: 708, FN: 0, FP: 31, TN: 0}
            },
            {
                _all: {total: 5517, TP: 3324, FN: 0, FP: 2193, TN: 0},
                ham: {total: 4772, TP: 2595, FN: 0, FP: 2177, TN: 0},
                spam: {total: 745, TP: 729, FN: 0, FP: 16, TN: 0}
            },
            {
                _all: {total: 5533, TP: 3325, FN: 0, FP: 2208, TN: 0},
                ham: {total: 4790, TP: 2590, FN: 0, FP: 2200, TN: 0},
                spam: {total: 743, TP: 735, FN: 0, FP: 8, TN: 0}
            }
        ];
        var expectedKeys = [
            "_all_precision", "_all_recall", "_all_specificity", "_all_accuracy",
            "ham_precision", "ham_recall", "ham_specificity", "ham_accuracy",
            "spam_precision", "spam_recall", "spam_specificity", "spam_accuracy"
        ];

        it('should be a function', function (done) {
            expect(FUT).to.be.a('function');
            return done();
        });
        it('should work on a basic example', function (done) {
            var x = FUT({}, exampleResults);
            expect(x).to.be.an('object');
            expect(x).to.have.keys(expectedKeys);
            expectedKeys.forEach(function (k) {
                expect(x[k]).to.be.an(Array);
            });
            return done();
        });
        it('should work on a basic example with csv output', function (done) {
            var csv = FUT({csv: true}, exampleResults);

            expect(csv).to.be.a('string');
            var x = _.map(csv.split("\n"), function (row) {
                return row.split(', ');
            });

            expect(x).to.be.an(Array);
            expect(x).to.have.length(1 + _.size(exampleResults) + 2); // Columns, data, divider, mean
            expectedKeys.forEach(function (k) {
                expect(x[0]).to.contain(k);
            });
            return done();
        });
        it('should work on a basic example with tsv (tab-separated) output', function (done) {
            var csv = FUT({tsv: true}, exampleResults);

            expect(csv).to.be.a('string');
            var x = _.map(csv.split("\n"), function (row) {
                return row.split("\t");
            });

            expect(x).to.be.an(Array);

            expect(x).to.have.length(1 + _.size(exampleResults) + 2); // Columns, data, divider, mean
            expectedKeys.forEach(function (k) {
                expect(x[0]).to.contain(k);
            });
            return done();
        });
    }); // describe('normalizeResults')

    describe('topK', function () {
        var FUT = CliHelper.topK;

        it('should be a function', function (done) {
            expect(FUT).to.be.a('function');
            return done();
        });
        it('should work on a basic example', function (done) {
            expect(FUT(3, [
                'one', 'fish', 'two', 'fish',
                'red', 'fish', 'blue', 'fish',
                'one', 'blue', 'one'
            ])).to.eql(['fish', 'fish', 'fish', 'fish', 'one', 'one', 'one', 'blue', 'blue']);
            return done();
        });
    }); // describe('topK')
}); // describe('CliHelper')
