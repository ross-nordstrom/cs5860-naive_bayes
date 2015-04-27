#! /usr/bin/env node

var request = require('superagent');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');
var bayes = require('./lib/naiveBayes');
var cliHelper = require('./lib/cliHelper');
var natural = require('natural');

var options = {
    boolean: [
        'help',
        'verbose',
        'csv',
        'tsv',
        'inline',
        'guten',
        'stem',
        'sentence'
    ],
    alias: {
        help: ['h'],
        ratio: ['r'],
        in: ['i'],
        number: ['n'],
        precision: ['p'],
        verbose: ['v'],
        inline: ['I'],
        guten: ['G'],
        topK: ['k'],
        stem: ['s'],
        sentence: ['S']
    },
    default: {
        out: './data',
        in: './data',
        ratio: 15,
        number: 1,
        precision: 2,
        verbose: false,
        csv: false,
        tsv: false
    }
};

var argv = require('minimist')(process.argv.slice(2), options);
var start = new Date();

// TODO: Use the args to test/train naive bayes

if (argv.help) {

    cliHelper.printHelp(argv);
    process.exit(0);

} else if (argv.inline) {

    console.log("Train/Test on inline data from '" + argv.in + "', " + argv.number + " time(s), using " + argv.ratio + "% for Training");

    return async.times(argv.number, function (idx, timesCb) {
        return fs.readFile(argv.in, 'utf8', function (err, data) {

            var myClassifier = new bayes();

            if (err) {
                return timesCb(err);
            }
            var rows = _.compact(data.toString().split("\n"));
            if (argv.verbose) console.log("ROWS: ", _.size(rows));

            // Partition into train vs test dataset
            var seeds = _.shuffle(_.range(_.size(rows)));
            var comparator = (argv.ratio * _.size(rows) / 100);
            var trainAndTest = _.partition(rows, function (bk, idx) {
                return seeds[idx] < comparator;
            });
            var train = trainAndTest[0];
            var test = trainAndTest[1];
            console.log("Partitioned into " + _.size(train) + " training and " + _.size(test) + " testing datapoints");

            // Train on all the training points
            _.each(train, function (row) {
                var cls = row.split("\t")[0];
                var textBlob = row.split("\t")[1];
                myClassifier.train(cls, textBlob);
            });

            // Test on all the testing points
            var results = {_all: {total: 0, TP: 0, FN: 0, FP: 0, TN: 0}};
            _.each(test, function (row) {
                var cls = row.split("\t")[0];
                var textBlob = row.split("\t")[1];
                var choice = myClassifier.classify(textBlob).class;

                results[cls] = results[cls] || {total: 0, TP: 0, FN: 0, FP: 0, TN: 0};
                results[cls].total++;
                results._all.total++;

                var qual = [(choice === cls) ? 'T' : 'F', choice ? 'P' : 'N'].join('');
                results[cls][qual]++;
                results._all[qual]++;
            });

            return timesCb(null, results);
        });
    }, handleEvalDone);

} else if (argv.guten) {

    console.log("Train/Test based on data from '" + argv.in + "', using " + argv.ratio + "% for Training");

    // Grab each author-directory in the main directory
    var authors = fs.readdirSync(argv.in);
    if (argv.verbose) console.log("Author directories: ", authors);

    // { dickens: [ 'a_christmas_carol.txt', ... ], hardy: [...] }
    var booksByAuthor = _.object(authors, _.map(authors, function (auth) {
        return fs.readdirSync([argv.in, auth].join('/'));
    }));
    var books = _.flatten(_.map(booksByAuthor, function (bks, auth) {
        return _.map(bks, function (bk) {
            return {class: auth, path: [argv.in, auth, bk].join('/')};
        });
    }));
    if (argv.verbose) console.log("Books: ", books);

    // Should we tokenize in a fancy way?
    // Operates from last to first
    var tokenizer = _.compose(
        !argv.topK ? _.identity : cliHelper.topK.bind(null, argv.topK)/*(tokens)*/,
        //cliHelper.tokenNormalize,
        argv.stem ? natural.PorterStemmer.tokenizeAndStem/*(str)*/ :
            argv.sentence ? cliHelper.sentenceTokenizer : cliHelper.basicTokenizer
    );

    return async.times(argv.number, function (idx, timesCb) {

        var myClassifier = new bayes({tokenizer: tokenizer});

        // Partition into train vs test dataset
        var seeds = _.shuffle(_.range(_.size(books)));
        var comparator = (argv.ratio * _.size(books) / 100);
        var trainAndTest = _.partition(books, function (bk, idx) {
            return seeds[idx] < comparator;
        });
        var train = trainAndTest[0];
        var test = trainAndTest[1];

        // Make sure we have all classes represented in the training data
        var classes = _.uniq(_.pluck(books, 'class'));
        if (_.size(classes) > _.size(train)) {
            console.log("ERROR!  Ratio not high enough to train on every class! Would train on " + _.size(train) +
            " points, but there are " + _.size(classes) + " classes");
            process.exit(1);
        }

        // Swap for any classes missing from training set
        var missingClasses = _.difference(classes, _.uniq(_.pluck(train, 'class')));
        while (!_.isEmpty(missingClasses)) {
            if (argv.verbose) console.log("Missing classes! ", missingClasses);
            var classCount = _.countBy(train, _.property('class'));

            var swapperCls = _.findKey(classCount, function (cnt) {
                return cnt > 1;
            });

            var swapperIdx = _.findIndex(_.pluck(train, 'class'), function (cls) {
                return cls === swapperCls;
            });

            var swappeeIdx = _.findIndex(_.pluck(test, 'class'), function (cls) {
                return missingClasses.indexOf(cls) >= 0;
            });

            if (swappeeIdx < 0 || swapperIdx < 0) {
                console.log("ERROR!  Unable to swap training/testing samples to ensure all classes are trained");
                process.exit(1);
            }
            if (argv.verbose) console.log("Swap ", train[swapperIdx]);
            if (argv.verbose) console.log(" with ", test[swappeeIdx]);

            // Make the swap
            var tmp = train[swapperIdx];
            train[swapperIdx] = test[swappeeIdx];
            test[swappeeIdx] = tmp;

            missingClasses = _.difference(classes, _.uniq(_.pluck(train, 'class')));
        }

        console.log(idx + ") Partitioned into " + _.size(train) + " training and " + _.size(test) + " testing datapoints");

        // Train on all the training points
        _.each(train, function (bookInfo) {
            var cls = bookInfo.class;
            var textBlob = fs.readFileSync(bookInfo.path, 'utf8');
            myClassifier.train(cls, textBlob);
        });

        if (argv.verbose && argv.number === 1) console.log("=========== DUMP CLASSIFIER ============\n", myClassifier.dump());

        // Test on all the testing points
        var results = {_all: {total: 0, TP: 0, FN: 0, FP: 0, TN: 0}};
        _.each(test, function (bookInfo) {
            var cls = bookInfo.class;
            var textBlob = fs.readFileSync(bookInfo.path, 'utf8');
            var choice = myClassifier.classify(textBlob).class;

            results[cls] = results[cls] || {total: 0, TP: 0, FN: 0, FP: 0, TN: 0};
            results[cls].total++;
            results._all.total++;

            var qual = [(choice === cls) ? 'T' : 'F', choice ? 'P' : 'N'].join('');
            results[cls][qual]++;
            results._all[qual]++;
        });

        return timesCb(null, results);

    }, handleEvalDone);

} else {

    cliHelper.printHelp(argv);
    process.exit(1);

}


function handleEvalDone(err, allResults) {
    if (err) {
        console.log("ERROR: ", err);
        process.exit(1);
    }

    if (argv.verbose) console.log("\nRaw Results: ");
    if (argv.verbose) console.log(allResults);

    console.log("\nPerformance Results: ");
    console.log(cliHelper.normalizeResults(argv, allResults));

    var end = new Date();
    console.log(" ");
    console.log("Finished in " + (end.valueOf() - start.valueOf()) + "ms");
    process.exit(0);
}
