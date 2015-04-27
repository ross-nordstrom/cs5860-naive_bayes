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
        'inline'
    ],
    alias: {
        help: ['h'],
        ratio: ['r'],
        in: ['i'],
        number: ['n'],
        precision: ['p'],
        verbose: ['v'],
        inline: ['I']
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

// TODO: Use the args to test/train naive bayes

if (argv.help) {

    cliHelper.printHelp(argv);
    process.exit(0);

} else if (argv.inline) {

    var start = new Date();
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
            var trainAndTest = _.partition(rows, function () {
                return _.random(1, 100) <= argv.ratio;
            });
            var train = trainAndTest[0];
            var test = trainAndTest[1];
            if (argv.verbose) console.log("Partitioned into " + _.size(train) + " training and " + _.size(test) + " testing datapoints");

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
    }, function (err, allResults) {
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
    });

} else if (argv.gutenberg) {

    console.log("TODO: Train/Test based on data from '" + argv.in + "', using " + argv.ratio + "% for Training");
    process.exit(1);

} else {

    cliHelper.printHelp(argv);
    process.exit(1);

}
