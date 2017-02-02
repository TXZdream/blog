var express = require('express');
var router = express.Router();
var user_op = require('../models/user_operate');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Respond with a resource');
});

router.post('/login', function(req, res, next) {
  console.log('Post data to /users/login.');
  console.log(req.body);
  if (login_check(req.body)) {
    user_op.checkPasswd(req.body.user, req.body.passwd, function(err) {
      if (err) {
        console.log(err);
        res.end('Failed');
      } else {
        console.log('Check user success.');
        res.end('Success');
      }
    });
  }
});

router.post('/register', function(req, res, next) {
  console.log('Post data to /users/register.');
  console.log(req.body);
  if (reg_check(req.body))
    var Spasswd = require('crypto').createHash('md5').update(req.body.passwd).digest('hex');
    user_op.addUser({'name': req.body.user,
      'phone': req.body.phone,
      'email': req.body.email,
      'passwd': Spasswd
    }, function(err) {
      if (err) {
        console.log(err);
        res.end('Failed');
      } else {
        console.log('Register success.');
        res.end('Success');
      }
    });
});

var reg_check = function(data) {
  return true;
}

var login_check = function(data) {
  return true;
}

module.exports = router;
