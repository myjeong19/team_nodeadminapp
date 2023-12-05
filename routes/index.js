var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => res.render('index'));

router.get('/login', (req, res, next) => res.render('login'));

router.get('/about', (req, res, next) => res.render('about'));

router.get('/signup', (req, res, next) => res.render('signup'));

module.exports = router;
