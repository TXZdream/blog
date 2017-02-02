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
    console.log(ret);
    res.end(JSON.stringify(ret));
  });
});

router.post('/insertblog', function(req, res, next) {
  console.log('Insert');
  console.log(req.body);
  blog_op.insertBlog(req.body, function(data) {
    if (data) {
      res.end(data);
    } else {
      res.end('Success');
    }
  });
});

module.exports = router;
