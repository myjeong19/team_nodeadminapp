var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

module.exports = router;
