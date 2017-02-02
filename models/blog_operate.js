var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blog';
var assert = require('assert');
var op = {};

// Insert data to database without checking if it is valid.
op.insertBlog = function (data, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
            callback('Falied: Connect to database failed!');
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').insert(data, function (err, ret) {
                if (err) {
                    console.log("Insert failed!");
                    console.log(err);
                    callback('Failed: Insert failed.');
                } else {
                    console.log("Insert data to blogContent table success");
                    callback();
                }
            });
        }
        db.close();
    });
}

op.deleteBlog = function(title, author, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
            callback('Falied: Connect to database failed!');
        } else {
            db.collection('blogContent').deleteOne({'author': author, 'title': title}, function(err, ret) {
                if (err) {
                    console.log('Delete data failed.');
                    console.log(err);
                    callback('Failed: ' + err);
                } else {
                    console.log('Delete data success.');
                }
            });
        }
        db.close();
    });
}

// Later I will rewrite this function with correct para.
op.updateBlog = function (id, data) {

}

// Find blog with author, return an array of the blog.
op.findBlogByAuthor = function (author) {
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
op.findBlogByTitle = function (title) {
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
op.findBlogByTag = function (tag) {
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
op.findAllBlog = function (callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            var ret = db.collection('blogContent').find().toArray().then(function(ret) {
                callback(ret);
            });
        }
    });
}

module.exports = op;