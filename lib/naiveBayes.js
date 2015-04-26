/**
 * Naive bayes classifier
 * @class NaiveBayes
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

// Which keys on this do we use in dump/restore?
var KEY_STORE = ['trains', 'classifies', 'cnt', 'classes', 'tokens', 'fudgeFactor'];

/**
 * A set of options to override defaults
 * @typedef {object} bayesOptions
 * @memberOf NaiveBayes
 * @property {function} tokenizer - How to tokenize textBlobs. Defaults to splitting on ' '.
 *                                  You could do lemmatization here, or other fancy stuff.
 * @property {number} fudgeFactor - Fake probability for tokens we've never seen
 */

/**
 * Naive Bayes classifier constructor
 * @param {bayesOptions} options - A set of options to override defaults
 * @constructor
 */
function NaiveBayes(options) {
    var privateOptions = ['trains', 'classifies', 'classes', 'tokens', 'cnt'];
    var defaults = {
        trains: 0,
        classifies: 0,
        classes: {},
        tokens: {},
        cnt: 0,
        fudgeFactor: 0.1,
        tokenizer: function (x) {
            return x.split(' ');
        }
    };

    _.extend(this, defaults, _.omit(options, privateOptions));
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
NaiveBayes.prototype.train = function (cls, textBlob) {
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
NaiveBayes.prototype.classify = function (textBlob) {
    var tokens = self.tokenizer(textBlob);

    // Calculate the probability the textBlob belongs to each class
    var clsProbabilities = _.map(_.keys(self.classes), function (cls) {
        var dot = _.property(cls);

        // NUMERATOR =  P(cls) * ( Product of P(token_i | cls) for i=1...N )
        var products = _.reduce(tokens, function (product, tok) {
                return product * ( (dot(self.tokens[tok]) || self.fudgeFactor) / self.classes[cls]);
            }, 1) || 0; // Protect against NaN
        var numerator = (self.classes[cls] / self.cnt) * products;

        // DENOMINATOR = Product of P(token_i) for i=1...N
        // NOTE: We can ignore the denominator since it's the same for all classes and won't effect the comparison
        return {class: cls, p: numerator};
    });

    self.classifies++;

    // Return the one with the greatest probability
    return _.max(clsProbabilities, _.property('p'));
};

/**
 * Dump the current state of this Classifier. It is up to the consumer to stringify if they want to persist the object.
 *
 * @return {NaiveBayes} A Naive Bayes Classifier, filtered to safe fields only
 */
NaiveBayes.prototype.dump = function () {
    return _.pick(self, KEY_STORE);
};

/**
 * Restore a previously dumped Classifier.
 *
 * @param {NaiveBayes} store    - A Naive Bayes Classifier, filtered to safe fields only
 */
NaiveBayes.prototype.restore = function (store) {
    _.each(KEY_STORE, function (k) {
        self[k] = store[k];
    });
};

module.exports = NaiveBayes;
