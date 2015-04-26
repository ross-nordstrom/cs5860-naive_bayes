/*global exports, process, require, exports */
"use strict";

var _ = require('underscore');


function printHelp(argv) {

    console.log("Usage: " + process.argv.slice(0, 2));
    console.log(" ");
    console.log("Options:");
    console.log("  --help (-h)                        - Print usage");
    console.log("  --verbose (-v)                     - Print debug messages");
    console.log("  --csv                              - Return results in CSV format");
    console.log(" ");
    console.log("  Randomly Train/Test from downloaded data:");
    console.log("  --in (-i) = <path/to/dir>          - Location to read text from");
    console.log("  --ratio (-r) <1-100>               - What percentage of dataset to use as Training data");
    console.log("  --inline (-I)                      - Indicates --in is a file where each line has structure:");
    console.log("                                           \"class ...text...\"");
    console.log("  --number (-n) <number>             - How many iterations to run at the given options");
    console.log(" ");
    console.log(" ");
    console.log("Your args: ", argv);
}


function normalizeResults(argv, results) {
    var verboseRows = _.flatten(_.map(results, function (obj) {
        return _.reduce(obj, function (acc, counts, cls) {
            var merged = _.reduce(counts, function (acc, cntVal, cntType) {
                var key = [cls, cntType].join('_');
                acc[key] = cntVal;
                return acc;
            }, {});
            return _.extend(acc, merged);
        }, {});
    }));

    var allKeys = _.keys(_.extend.apply(null, [{}].concat(verboseRows)));
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

    var indexed = _.reduce(verboseRows, function (acc, row) {
        var filledRow = _.defaults(row, baseRow);
        _.each(filledRow, function (val, key) {
            acc[key].push(val);
        });
        return acc;
    }, baseTable);

    if (!argv.csv) {
        return indexed;
    } else {
        var cols = _.keys(indexed);
        var rows = transpose(_.values(indexed));
        var csv = [cols].concat(rows);
        return _.map(csv, function (row) {
            return row.join(', ');
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
