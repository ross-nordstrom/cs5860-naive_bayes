#! /usr/bin/env node

var request = require('superagent');
var async = require('async');
var _ = require('underscore');

var options = {
    boolean: [
        'help',
        'verbose'
    ],
    alias: {
        help: ['h'],
        ratio: ['r'],
        in: ['i'],
        verbose: ['v']
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
    console.log(" ");
    console.log(" ");
    console.log("Your args: ", argv);
}
