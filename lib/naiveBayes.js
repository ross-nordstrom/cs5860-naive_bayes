/**
 * Naive bayes classifier
 * @module NaiveBayes
 * @description Object-oriented Naive Bayes classifier\
 * @example
 * // Instantiate
 * var myBayes = new require('rdn-naive-bayes');
 *
 * // Train
 * myBayes.train('spam', 'URGENT! We are trying to contact you.');
 * myBayes.train('ham', 'Yep then is fine 7.30 or 8.30 for ice age.');
 * // ...
 *
 * // Test
 * myBayes.classify('Aight, can you text me the address?');
 * //=> 'ham'
 */

/*global exports, process, require, exports */
"use strict";

var _ = require('underscore');
var self;

var KEY_STORE = ['options', 'trains', 'classifies', 'cnt', 'classes', 'tokens'];

/**
 * Naive Bayes classifier constructor
 * @param options
 * @constructor
 */
function Classifier(options) {
    this.options = options;
    this.trains = 0;
    this.classifies = 0;
    this.classes = {};
    this.tokens = {};
    this.cnt = 0;
    this.tokenizer = _.property('tokenizer')(options) || function (x) {
        return x.split(' ');
    };
    self = this;
}

/**
 * Train the classifier on a blob of text.
 *
 * Basically we just need to increment a bunch of counters in a
 * data structure that will be easy to use for classification
 *
 * @param {string} cls          - The class/category
 * @param {string} textBlob     - A blob of text
 */
Classifier.prototype.train = function (cls, textBlob) {
    var tokens = self.tokenizer(textBlob);

    // Increment total count
    self.cnt += _.size(tokens);

    // Increment class-specific count
    self.classes[cls] = (self.classes[cls] || 0) + _.size(tokens);

    // Increment each token's counts
    _.each(tokens, function (tok) {
        self.tokens[tok] = self.tokens[tok] || {_cnt: 0};

        // Increment token's total count
        self.tokens[tok]._cnt++;

        // Increment token's class-specific count
        self.tokens[tok][cls] = (self.tokens[tok][cls] || 0) + 1;
    });

    self.trains++;
};

/**
 * Classify a blob of text from our trained classes
 *
 * @todo Handle underflow - http://en.wikipedia.org/wiki/Arithmetic_underflow
 * @param {string} textBlob     - A blob of text to classify
 */
Classifier.prototype.classify = function (textBlob) {
    var tokens = self.tokenizer(textBlob);

    // Calculate the probability the textBlob belongs to each class
    var clsProbabilities = _.map(_.keys(self.classes), function (cls) {
        // NUMERATOR =  P(cls) * ( Product of P(token_i | cls) for i=1...N )
        var products = _.reduce(tokens, function (product, tok) {
                return !self.tokens[tok][cls] ? product : // Ignore tokens we've never seen for this class
                product * (self.tokens[tok][cls] / self.classes[cls]);
            }, 1) || 0; // Protect against NaN
        var numerator = (self.classes[cls] / self.cnt) * products;

        // DENOMINATOR = Product of P(token_i) for i=1...N
        // NOTE: We can ignore the denominator since it's the same for all classes and won't effect the comparison
        return {class: cls, p: numerator};
    });

    self.classifies++;
    return _.max(clsProbabilities, _.property('p'));
};

Classifier.prototype.dump = function () {
    return _.pick(self, KEY_STORE);
};

Classifier.prototype.restore = function (store) {
    _.each(KEY_STORE, function (k) {
        self[k] = store[k];
    });
};

module.exports = Classifier;

