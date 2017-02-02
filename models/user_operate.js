var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blog';
var op = {};

op.addUser = function(data, callback) {
    console.log(data);
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
            callback('Failed: ' + err);
        } else {
            db.collection('user').findOne({'name': data.name}, function(err, ret) {
                if (err) {
                    console.log('Find failed.');
                    console.log(err);
                } else {
                    console.log(ret);
                    if (!ret) {
                        db.collection('user').insert(data, function(err, ret) {
                            if (err) {
                                console.log("Insert data to user table failed.");
                                console.log(err);
                                callback('Failed: ' + err);
                            } else {
                                console.log('Insert data to user table success.');
                                callback('');
                            }
                        });
                    } else {
                        callback('Failed: Exists username.');
                    }
                }
            });
        }
    });
}

// Unique username, change password with old password.
op.updatePasswdWithPassword = function(user, oldPasswd, newPasswd) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            var passwd = require('crypto').createHash('md5').update(oldPasswd).digest('hex');
            var ret = db.collection('user').findOne({'name': user});
            if (ret) {
                if (passwd == ret.passwd) {
                    var replacePasswd = require('crypto').createHash('md5').update(newPasswd).digest('hex');
                    try {
                        db.collection('user').updateOne({'name': user},{$set: {'passwd': replacePasswd}});
                    } catch (err) {
                        console.log("Update password failed.");
                        console.log("err");
                    }
                }
            }
        }
    });
}

op.deleteUser = function(user, passwd) {
    
}

op.updateMessage = function(item, value, passwd) {

}

op.disableUser = function(name, time) {

}

op.checkPasswd = function(name, passwd, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            var Spasswd = require('crypto').createHash('md5').update(passwd).digest('hex');
            var ret = db.collection('user').findOne({'name': name, 'passwd': Spasswd}, function(err, ret) {
                if (err) {
                    console.log('Find failed.');
                    cosole.log(err);
                } else {
                    if (ret) {
                        console.log("Find user with true password.");
                        callback('');
                    } else {
                        console.log('Failed: Invalid user or password.');
                        callback('Failed: Invalid user or password.');
                    }
                }
            });
        }
    });
}

module.exports = op;