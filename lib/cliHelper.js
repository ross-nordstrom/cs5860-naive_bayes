/*global exports, process, require, exports */
"use strict";

var _ = require('underscore');


function printHelp(argv) {

    console.log("Usage: " + process.argv.slice(0, 2));
    console.log(" ");
    console.log("Options:");
    console.log("  --help (-h)                        - Print usage");
    console.log("  --verbose (-v)                     - Print debug messages");
    console.log("  --csv                              - Results in CSV format");
    console.log("  --tsv                              - Results in TSV (Tabs) format for pasting into GDrive");
    console.log(" ");
    console.log("  Randomly Train/Test from downloaded data:");
    console.log("  --in (-i) = <path/to/dir>          - Location to read text from");
    console.log("  --ratio (-r) <1-100>               - What percentage of dataset to use as Training data");
    console.log("  --inline (-I)                      - Indicates --in is a file where each line has structure:");
    console.log("                                           \"class ...text...\"");
    console.log("  --number (-n) <number>             - How many iterations to run at the given options");
    console.log("  --precision (-p) <decimalPlaces>   - How many decimal places to include on performance results");
    console.log(" ");
    console.log(" ");
    console.log("Your args: ", argv);
}

// http://webdocs.cs.ualberta.ca/~eisner/measures.html
var performanceFuncs = {
    // The percentage of positive predictions that are correct.
    precision: function (row) {
        return 1.0 * row.TP / (row.TP + row.FP);
    },

    // The percentage of positive labeled instances that were predicted as positive.
    recall: function (row) {
        return 1.0 * row.TP / (row.TP + row.FN);
    },

    // The percentage of negative labeled instances that were predicted as negative.
    specificity: function (row) {
        return 1.0 * row.TN / (row.TN + row.FP);
    },

    // The percentage of predictions that are correct.
    accuracy: function (row) {
        return 1.0 * (row.TP + row.TN) / (row.total);
    }
};

function normalizeResults(argv, results) {

    var performanceRows = _.flatten(_.map(results, function (obj) {
        return _.reduce(obj, function (acc, row, cls) {

            var perfRow = _.mapObject(performanceFuncs, function (func, key) {
                return func(row).toFixed(argv.precision);
            });

            var merged = _.reduce(perfRow, function (acc, cntVal, cntType) {
                var key = [cls, cntType].join('_');
                acc[key] = cntVal;
                return acc;
            }, {});
            return _.extend(acc, merged);
        }, {});
    }));

    var allKeys = _.keys(_.extend.apply(null, [{}].concat(performanceRows)));
    var baseTable = _.object(allKeys, _.map(allKeys, function () {
        return [];
    }));
    var baseRow = _.object(allKeys, _.map(allKeys, _.constant(null)));

    if (argv.verbose) {
        console.log("ALL KEYS: ", allKeys);
    }
    if (argv.verbose) {
        console.log("BASE TABLE: ", baseTable);
    }

    var indexed = _.reduce(performanceRows, function (acc, row) {
        var filledRow = _.defaults(row, baseRow);
        _.each(filledRow, function (val, key) {
            acc[key].push(val);
        });
        return acc;
    }, baseTable);

    if (!argv.csv && !argv.tsv) {
        return indexed;
    } else {
        var cols = _.keys(indexed);
        var data = _.values(indexed);

        // Append a divider and the average for each
        data = _.map(data, function (vals, idx) {
            var mean = _.reduce(vals, function (a, b) {
                    return a + (parseFloat(b) || 0);
                }, 0) / _.size(vals);
            return data[idx].concat(['-', mean.toFixed(argv.precision)]);
        });

        var rows = transpose(data);
        var csv = [cols].concat(rows);
        return _.map(csv, function (row) {
            return row.join(argv.csv ? ', ' : "\t");
        }).join("\n");
    }
}

function transpose(table) {
    try {
        return table[0].map(function (_, c) {
            return table.map(function (r) {
                return r[c];
            });
        });
    } catch (e) {
        return table; // Table was a bad input. Let the caller deal with it
    }
}

exports.printHelp = printHelp;
exports.normalizeResults = normalizeResults;
