var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27010/blog';
var assert = require('assert');

// Insert data to database without checking if it is valid.
var insertBlog = function (data) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').insertOne(data, function (err, ret) {
                if (err) {
                    console.log("Insert failed!");
                    console.log(err);
                } else {
                    console.log("Insert data to blogContent table success");
                }
            });
        }
        db.close();
    });
}

// Later I will rewrite this function with correct para.
var updateBlog = function (id, data) {

}

// Find blog with author, return an array of the blog.
var findBlogByAuthor = function (author) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').find({'author': author}).toArray(function(err, arr) {
                if (err) {
                    console.log("Find data with author failed.");
                    console.log(err);
                    return null;
                } else {
                    console.log("Find data with author success.");
                    return arr;
                }
            });
        }
        db.close();
    });
}

// Find blog with author, return an array of the blog.
var findBlogByTitle = function (title) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').find({'title': title}).toArray(function(err, arr) {
                if (err) {
                    console.log("Find data with title failed.");
                    console.log(err);
                    return null;
                } else {
                    console.log("Find data with title success.");
                    return arr;
                }
            });
        }
        db.close();
    });
}

// Find blog with tag, return an array of the blog.
var findBlogByTag = function (tag) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').find({'tag': tag}).toArray(function(err, arr) {
                if (err) {
                    console.log("Find data with tag failed.");
                    console.log(err);
                    return null;
                } else {
                    console.log("Find data with tag success.");
                    return arr;
                }
            });
        }
        db.close();
    });
}

// Find all blog, return an array of the blog.
var findAllBlog = function () {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').find().toArray(function(err, arr) {
                if (err) {
                    console.log("Find all data failed.");
                    console.log(err);
                    return null;
                } else {
                    console.log("Find all data success.");
                    return arr;
                }
            });
        }
        db.close();
    });
}