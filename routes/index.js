var express = require('express');
var router = express.Router();
var blog_op = require('../models/blog_operate');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/showall', function(req, res, next) {
  console.log("Showall");
  blog_op.findAllBlog(function(ret) {
    // console.log(ret);
    res.end(JSON.stringify(ret));
  });
});

router.post('/insertblog', function(req, res, next) {
  console.log('Insert');
  // console.log(req.body);
  blog_op.insertBlog(req.body, function(data) {
    if (data) {
      res.end(data);
    } else {
      res.end('Success');
    }
  });
});

router.post('/updateblog', function(req, res, next) {
  console.log('Update');
  if (req.body.currentUser != req.body.author) {
    console.log('Current user doesn\'t match with author');
    res.end('Umatch');
  } else {
    blog_op.updateBlog(req.body.tmpId, req.body, function(ret) {
      if (ret) {
        if (ret == 'Exist') {
          console.log('Same blog.');
          res.end('Exist');
        } else {
          // console.log(ret);
          res.end('Failed');
        }
      } else {
        console.log('Update blog success.');
        res.end('Success');
      }
    });
  }
});

router.post('/deleteblog', function(req, res, next) {
  console.log('Delete blog.');
  if (req.body.currentUser != req.body.author) {
    res.end('Umatch');
  } else {
    blog_op.deleteBlog(req.body, function(ret) {
      if (ret) {
        console.log(ret);
      } else {
        res.end('');
      }
    });
  }
});

module.exports = router;
