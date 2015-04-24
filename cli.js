#! /usr/bin/env node

var request = require('superagent');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');
var bayes = require('./lib/naiveBayes');

var options = {
    boolean: [
        'help',
        'verbose',
        'inline'
    ],
    alias: {
        help: ['h'],
        ratio: ['r'],
        in: ['i'],
        verbose: ['v'],
        inline: ['I']
    },
    default: {
        out: './data',
        in: './data',
        ratio: 15,
        verbose: false
    }
};

var argv = require('minimist')(process.argv.slice(2), options);

// TODO: Use the args to test/train naive bayes

if (argv.help) {

    printHelp();
    process.exit(0);

} else if (argv.inline) {

    var myClassifier = new bayes();

    console.log("Train/Test based on inline data from '" + argv.in + "', using " + argv.ratio + "% for Training");

    return fs.readFile(argv.in, 'utf8', function (err, data) {
        if (err) {
            console.log("Error: ", err);
            process.exit(1);
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
        var results = {};
        _.each(test, function (row) {
            var cls = row.split("\t")[0];
            var textBlob = row.split("\t")[1];
            var choice = myClassifier.classify(textBlob).class;

            results[cls] = results[cls] || {total: 0, correct: 0, false: 0};
            results[cls].total++;

            // Success?
            if (choice === cls) {
                results[cls].correct++;
            } else {
                if (argv.verbose) console.log(" X  - Incorrectly classified " + cls + " as " + choice + " (" + textBlob + ")");
                results[cls].false++;
            }
        });

        console.log(" ");
        console.log("Results: ");
        console.log(results);
        process.exit(0);
    });

} else {

    console.log("TODO: Train/Test based on data from '" + argv.in + "', using " + argv.ratio + "% for Training");
    process.exit(1);

}

function printHelp() {

    console.log("Usage: " + process.argv.slice(0, 2));
    console.log("  --help (-h)                        - Print usage");
    console.log("  --verbose (-v)                     - Print debug messages");
    console.log(" ");
    console.log("  Randomly Train/Test from downloaded data:");
    console.log("  --in (-i) = <path/to/dir>          - Location to read text from");
    console.log("  --ratio (-r) = <1-100>             - What percentage of dataset to use as Training data");
    console.log("  --inline (-I)                      - Indicates --in is a file where each line has structure:");
    console.log("                                           \"class ...text...\"");
    console.log(" ");
    console.log(" ");
    console.log("Your args: ", argv);
}
