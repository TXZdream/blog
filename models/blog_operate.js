var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blog';
var assert = require('assert');
var user_op = require('./user_operate');
var op = {};

op.checkSame = function(id, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
            db.close();
            callback('Falied: Connect to database failed!');
        } else {
            console.log("Connect to database success!");
            db.collection('blogContent').findOne({'id': id}, function(err, ret) {
                if (err) {
                    console.log('Failed: Find blog failed.');
                    db.close();
                    callback('Failed');
                } else {
                    if (ret) {
                        console.log('Exist same blog.');
                        db.close();
                        callback('true');
                    } else {
                        console.log('No same blog.');
                        db.close();
                        callback('false');
                    }
                }
            });
        }
    });
}

// Insert data to database without checking if it is valid.
op.insertBlog = function (data, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
            db.close();
            callback('Falied: Connect to database failed!');
        } else {
            console.log("Connect to database success!");
            op.checkSame(data.id, function(ret) {
                if (ret == 'false') {
                    db.collection('blogContent').insert(data, function (err, ret) {
                        if (err) {
                            console.log("Insert failed!");
                            console.log(err);
                            db.close();
                            callback('Failed: Insert failed.');
                        } else {
                            console.log("Insert data to blogContent table success");
                            db.close();
                            callback('');
                        }
                    });
                } else {
                    db.close();
                    callback('Exist');
                }
            });           
        }
    });
}

op.deleteBlog = function(data, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
            db.close();
            callback('Falied: Connect to database failed!');
        } else {
            user_op.checkPasswd(data.currentUser, data.passwd, function(ret) {
                if (ret) {
                    callback(ret);
                } else {
                    db.collection('blogContent').deleteOne({'id': data.id}, function(err, ret) {
                        if (err) {
                            console.log('Delete data failed.');
                            console.log(err);
                            db.close();
                            callback('Failed: ' + err);
                        } else {
                            console.log('Delete blog success.');
                            db.close();
                            callback('');
                        }
                    });
                }
            });
            
        }
    });
}

// Later I will rewrite this function with correct para.
op.updateBlog = function (id, data, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            console.log("Connect to database success!");
            op.checkSame(data.id, function(ret) {
                if (ret == 'false') {
                    db.collection('blogContent').updateOne({'id': id}, {$set: {'title': data.title, 'content': data.content, 'id': data.id}}, function(err, ret) {
                        if (err) {
                            console.log('Update blog data failed.');
                            console.log(ret);
                            db.close();
                            callback('Failed: ' + err);
                        } else {
                            console.log('Update blog success.');
                            db.close();
                            callback('');
                        }
                    });
                } else {
                    db.close();
                    callback('Exist');
                }
            });
        }
    });
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
                db.close();
                callback(ret);
            });
        }
    });
}

module.exports = op;