CS 5860 - Naive Bayes Classifier
================================

    Ross Nordstrom
    University of Colorado - Colorado Springs
    CS 5910 - Computer/Network Security

## Assignment
 > Write a program in a language of your choice that classifies datasets into two classes. The two classes
here are _Charles Dickens_ and _Thomas Hardy._

### Dataset
 > For Dickens, you can find his writings in text form at http://www.gutenberg.org/ebooks/author/37.
For Hardy, you can find documents at http://www.gutenberg.org/ebooks/author/23. You may be
able to find data in other sites as well.

 * Some additional datasets were used from taken from [UCI - Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets.html)

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

### Things to Do
 1. Develop a Naive Bayes classifier to classify an unseen document. You can use parts of the
documents you download for training and parts for testing.
 2. Provide results in terms of metrics you think are relevant to this problem.
 3. Improve your basic algorithm in any way you want. For example, you may want to reduce the
 number of features to use, in various ways.
 4. Compare the performance of your programs with any other programs or published results you
 can find.
 5. Perform research into the problem of author identification

### What to Hand in
 > You will submit a 2+ page paper with a title and your name. Use the IEEE Author style you have
been using for the semester project papers you have been writing for the class. In this paper, you
will document salient aspects of your program, results you have obtained, improvements you have
implemented and relevant research you have conducted.
