var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/blog';

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

var deleteUser = function(user, passwd) {
    
}

var updateMessage = function(item, value, passwd) {

}

var disableUser = function(name, time) {

}

var checkPasswd = function(name, passwd) {
    
}