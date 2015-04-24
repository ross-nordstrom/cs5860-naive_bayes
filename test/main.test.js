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
var bayes = require('../lib/naiveBayesClassifier');

/***********************************************************************************************************************
 * The Tests!
 **/
describe('Naive Bayes Classifier', function () {
    describe('train', function () {
        it('should be a function', function (done) {
            expect((new bayes()).train).to.be.a('function');
            return done();
        });
    }); // describe('train')
}); // describe('Naive Bayes Classifier')
