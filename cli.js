#! /usr/bin/env node

var request = require('superagent');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');
var bayes = require('./lib/naiveBayes');
var cliHelper = require('./lib/cliHelper');

var options = {
    boolean: [
        'help',
        'verbose',
        'csv',
        'tsv',
        'inline',
        'guten'
    ],
    alias: {
        help: ['h'],
        ratio: ['r'],
        in: ['i'],
        number: ['n'],
        precision: ['p'],
        verbose: ['v'],
        inline: ['I'],
        guten: ['G']
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

    return async.times(argv.number, function (idx, timesCb) {

        var myClassifier = new bayes();

        // Partition into train vs test dataset
        var seeds = _.shuffle(_.range(_.size(books)));
        var comparator = (argv.ratio * _.size(books) / 100);
        var trainAndTest = _.partition(books, function (bk, idx) {
            return seeds[idx] < comparator;
        });
        var train = trainAndTest[0];
        var test = trainAndTest[1];
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

    console.log(" ");
    console.log("Raw Results: ");
    console.log(allResults);

    console.log(" ");
    console.log("Performance Results: ");
    console.log(cliHelper.normalizeResults(argv, allResults));

    var end = new Date();
    console.log(" ");
    console.log("Finished in " + (end.valueOf() - start.valueOf()) + "ms");
    process.exit(0);
}
