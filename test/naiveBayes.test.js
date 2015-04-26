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
var bayes = require('../lib/naiveBayes');

/***********************************************************************************************************************
 * The Tests!
 **/
describe('Naive Bayes Classifier', function () {
    var colorsAndAnimals = {
        trains: 2,
        classifies: 0,
        cnt: 14,
        fudgeFactor: 0.1,
        classes: {color: 7, animal: 7},
        tokens: {
            red: {_cnt: 1, color: 1},
            orange: {_cnt: 1, color: 1},
            yellow: {_cnt: 1, color: 1},
            green: {_cnt: 1, color: 1},
            blue: {_cnt: 1, color: 1},
            indigo: {_cnt: 1, color: 1},
            violet: {_cnt: 1, color: 1},
            dog: {_cnt: 1, animal: 1},
            cat: {_cnt: 1, animal: 1},
            bird: {_cnt: 1, animal: 1},
            fish: {_cnt: 1, animal: 1},
            rabbit: {_cnt: 1, animal: 1},
            snake: {_cnt: 1, animal: 1},
            hamster: {_cnt: 1, animal: 1}
        }
    };

    describe('train', function () {
        it('should be a function', function (done) {
            expect((new bayes()).train).to.be.a('function');
            return done();
        });

        it('should work on a basic example', function (done) {
            var b = new bayes();

            b.train('color', 'red orange yellow green blue indigo violet');
            b.train('animal', 'dog cat bird fish rabbit snake hamster');

            expect(b.dump()).to.eql(colorsAndAnimals);

            return done();
        });
    }); // describe('train')

    describe('classify', function () {
        it('should be a function', function (done) {
            expect((new bayes()).train).to.be.a('function');
            return done();
        });

        it('should work on a basic example', function (done) {
            var b = new bayes();

            b.restore(colorsAndAnimals);
            expect(b.dump()).to.eql(colorsAndAnimals);

            expect(b.classify('cat dog')).to.eql({class: 'animal', p: 0.01020408163265306});
            expect(b.classify('red green bird')).to.eql({class: 'color', p: 0.0001457725947521866});

            return done();
        });
    }); // describe('classify')
}); // describe('Naive Bayes Classifier')
