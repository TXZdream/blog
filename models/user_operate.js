var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27010/blog';

var addUser = function(data) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            db.collection('user').insert(data, function(err, ret) {
                if (err) {
                    console.log("Insert data to user table failed.");
                    console.log(err);
                } else {
                    console.log('Insert data to user table success.');
                }
            });
        }
    });
}

// Unique username, change password with old password.
var updatePasswdWithPassword = function(user, oldPasswd, newPasswd) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connect to database failed!");
            console.log(err);
        } else {
            var passwd = require('crypto').createHash('md5').update(oldPasswd).digest('hex');
            db.collection('user').findOne({'name': user}, function(err, ret) {
                if (err) {
                    console.log('Change password failed.');
                    console.log(err);
                } else {
                    if (ret.passwd == passwd) {
                        var change = require('crypto').createHash('md5').update(newPasswd).digest('hex');
                        ret.passwd = change;
                        db.collection('user').updateOne({'name': user}, ret, function(err, ret) {
                            if (err) {
                                console.log("Update password failed.");
                                console.log(err);
                            } else {
                                console.log("Update password succeed!");
                            }
                        });
                    }
                }
            });
        }
    });
}

var deleteUser = function(user, passwd) {
    
}

var updateMessage = function(item, value, passwd) {

}

var disableUser = function(name, time) {

}

var checkPasswd = function(name, passwd) {
    
}