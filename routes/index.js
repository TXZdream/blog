var express = require('express');
var router = express.Router();
var blog_op = require('../models/blog_operate');

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

router.get('/login', function(req, res, next) {
  
});

router.get('/insert', function(req, res, next) {
  console.log('Insert');
  blog_op.insertBlog({
                "author": "tangxz1",
                "title": "Hello World!!",
                "content": "No more content here."
            });
  res.end();
});

module.exports = router;
