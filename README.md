CS 5860 - Naive Bayes Classifier
================================

    Ross Nordstrom
    University of Colorado - Colorado Springs
    CS 5860 - Machine Learning

## Assignment
 > Write a program in a language of your choice that classifies datasets into two classes. The two classes
here are _Charles Dickens_ and _Thomas Hardy._

### [Assignment Details](https://github.com/ross-nordstrom/cs5860-naive_bayes/blob/master/ASSIGNMENT.pdf)

## Dataset
In addition to the required Dickens and Hardy books, some additional datasets were taken from [UCI - Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets.html). The datasets used are described below.

**Datasets used, and their location in this project:**

**Dataset** | **Source** | **Path** | **Type** *
---|---|---|---
SMS | [UCI - SMS Spam Collection](https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection) | [./data/sms](./data/sms) | inline
Badges | [UCI - Badges](https://archive.ics.uci.edu/ml/datasets/Badges) | [./data/badges](./data/badges) | inline
Main | Gutenberg - [Dickens](http://www.gutenberg.org/ebooks/author/37), [Hardy](http://www.gutenberg.org/ebooks/author/23) | [./data/main](./data/main) | gutenberg

**Dataset Types:** *

**Type** | **Description**
---|---
inline | Dataset is stored as a single file in which each line represents a training point. The first word in each line is the class/category, while the rest of the line is a list of words used as the training "text blob."
gutenberg | Dataset is stored as a list of directories representing classes/categories (e.g. "dickens", "hardy"). Each file within the class directories represent a training point. These files are actually books, but are abstractly considered to be "text blobs," just like the **inline** dataset type.

## Usage
This project is intended to be used via the CLI, and is exposed as an NPM package.

### Installation
**From NPM:**
```sh
npm install -g rdn-naive-bayes
```

**From local:**
```sh
git clone git@github.com:ross-nordstrom/cs5860-naive_bayes.git
cd cs5860-naive-bayes
npm install
npm link
```

### Running
**View Usage:**
Rather than document the usage here, please see the tool's help documentation. In general, the tool
expects to be given a dataset which it will divide into Training/Testing data.

```sh
rdn-naive-bayes -h
```

### Testing
```sh
npm install
npm test
```
