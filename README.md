CS 5860 - Naive Bayes Classifier
================================

    Ross Nordstrom
    University of Colorado - Colorado Springs
    CS 5910 - Computer/Network Security

## Assignment
 > Write a program in a language of your choice that classifies datasets into two classes. The two classes
here are _Charles Dickens_ and _Thomas Hardy._

### [Assignment Details](./ASSIGNMENT.md)

## Dataset
In addition to the required Dickens and Hardy books, some additional datasets were taken from [UCI - Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets.html). The datasets used are described below.

**Datasets used, and their location in this project:**

**Dataset** | **Source** | **Path** | * **Type**
---|---|---|---
SMS | [UCI - SMS Spam Collection](https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection) | `./data/sms` | inline
Badges | [UCI - Badges](https://archive.ics.uci.edu/ml/datasets/Badges) | `./data/badges` | inline
Main | Gutenberg - [Dickens](http://www.gutenberg.org/ebooks/author/37), [Hardy](http://www.gutenberg.org/ebooks/author/23) | gutenberg

* **Dataset Types:**

**Type** | **Description**
---|---
inline | Dataset is stored as a single file in which each line represents a training point. The first word in each line is the class/category, while the rest of the line is a list of words used as the training "text blob."
gutenberg | Dataset is stored as a list of directories representing classes/categories (e.g. "dickens", "hardy"). Each file within the class directories represent a training point. These files are actually books, but are abstractly considered to be "text blobs," just like the **inline** dataset type.
