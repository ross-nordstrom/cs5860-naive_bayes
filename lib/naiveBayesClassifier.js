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

var _ = require('underscore');

/**
 * Naive Bayes classifier constructor
 * @param options
 * @constructor
 */
function Classifier(options) {
    "use strict";
    this.options = options;
}

Classifier.prototype.train = function (cls, textBlob) {
    "use strict";

};

Classifier.prototype.classify = function (textBlob) {
    "use strict";

};

module.exports = Classifier;
