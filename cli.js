#! /usr/bin/env node

var request = require('request');

var numDefault = 10;
var options = {
  boolean: 'help',
  alias: {
    help: ['h'],
    gutenberg: ['g'],
    num: ['n'],
    ratio: ['r'],
    out: ['o'],
    in: ['i']
  },
  default: {
    out: './data',
    in: './data',
    num: numDefault
  }
};

var argv = require('minimist')(process.argv.slice(2), options);
console.dir(argv);

// TODO: Use the args to test/train naive bayes

if(argv.help) {
  
  printHelp();
  process.exit(0);

} else if(argv.gutenberg) {
  
  console.log("TODO: Download books off gutenberg, at most "+argv.num+" per url");
  
  async.map(argv.gutenberg, downloadGutenberg.bind(null, argv.in)/*(url, taskCb)*/, function(err, res) {
    console.log("ERR? ", err);
    console.log("RES? ", res);
    console.log(" ");
    console.log("TODO: Do something with result?");
    process.exit(1);
  }));
  
} else {
  
  console.log("TODO: Train/Test based on data from '"+argv.in+"', using "+argv.ratio+"% for Training");
  process.exit(1);
  
}



function printHelp() {
  
  console.log("Usage: "+process.argv.slice(0,2));
  console.log("  --help (-h)                    - Print usage");
  console.log(" ");
  console.log("  Downloading data:");
  console.log("  --gutenberg (-g) = <url1,url2> - Walk a gutenberg url, downloading all books by author");
  console.log("                                   Example: http://www.gutenberg.org/ebooks/author/37");
  console.log("  --num (-n) = <integer>         - Number of books to download from each url. Default: "+numDefault);
  console.log("  --out (-o) = <path/to/dir>     - Location to place downloaded Gutenberg files");
  console.log(" ");
  console.log("  Randomly Train/Test from downloaded data:");
  console.log("  --in (-i) = <path/to/dir>      - Location to read text from");
  console.log("  --ratio (-r) = <1-100>         - What percentage of dataset to use as Training data");
  
  return;
}

function downloadGutenberg(dir, url, cb) {
  console.log("TODO: Walk through all pages of the gutenberg url: "+url);
  console.log("      and download into directory: "+dir);
  
  var offset = 1;
  var bookUrls = [];
  var retrievedBooks = 0;
  
  async.doWhilst(
    /*fn: */function(fnCb) {
      return request.get(url+'?start_index='+offset).end(function(err, res) {
        if(err) {
          return fnCb(err);
        }
        
        var theseBooks = [/*TODO*/];
        
        bookUrls.push(theseBooks);
        offset += 25;
        
        return fnCb();
      });
    },
    /*test: */function() {
      return retrievedBooks >= 25;
    },
    /*callback: */function(err) {
      console.log("ERR? ", err);
      console.log("BOOKS? ", bookUrls);
      console.log("TODO: Handle book urls");
      return cb(new Error('not implemented'));
    }
  );
}
