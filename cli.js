#! /usr/bin/env node

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
    output: './data',
    input: './data',
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
  
  argv.gutenberg.forEach(function(url) {
    console.log("TODO: This is where we would walk through all pages of the author at: " + url);
  });
  process.exit(1);
  
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
