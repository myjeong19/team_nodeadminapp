const express = require("express");
const router = express.Router();

var db = require('../models/index');
var bcrypt = require('bcryptjs');
var AES = require('mysql-aes');
const passport = require('passport');

// const {isLoggedIn, isNotLoggedIn} = require('./sessionMiddleware');
const { isLoggedIn, isNotLoggedIn } = require('./passportMiddleware');

var resultMsg = '';

/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001
*/
router.get("/", isNotLoggedIn, async (req, res, next) => res.render(
  "login", { layout: false, resultMsg: '', loginError: req.flash('loginError') })
);

// session 기반 로그인 POST 메소드
router.post('/', isNotLoggedIn, async (req, res, next) => {

  var admin_id = req.body.admin_id;
  var password = req.body.password;

  var login_member = await db.Admin.findOne({ where: { admin_id: admin_id } });
  console.log(login_member);

  if (login_member) {
    if (await bcrypt.compare(password, login_member.admin_password)) {
      var sessionLoginData = {
        admin_member_id: login_member.admin_member_id,
        company_code: login_member.company_code,
        admin_id: login_member.admin_id,
        admin_name: login_member.admin_name
      };

      req.session.isLoggedIn = true;
      req.session.loginUser = sessionLoginData;
      req.session.save(function () {
        return res.redirect("/main");
      });
    } else {
      return res.render('login', { layout: false, resultMsg: "Password not correct." });
    }
  } else {
    return res.render('login', { layout: false, resultMsg: "Admin member not found." });
  }

});

// passport 기반 로그인 POST 메소드
// 현재 view에서 passportLogin을 사용하도록 설정되어 있습니다.
router.post('/passportLogin', async (req, res, next) => {
  passport.authenticate('local', (authError, admin, info) => {

    //패스포트 인증시 에러가 발생한경우 에러값 반환
    if (authError) {
      console.log(authError);
      return next(authError);
    }

    if (!admin) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }

    return req.login(admin, (loginError) => {
      if (loginError) {
        console.log(loginError);
        return next(loginError);
      }

      return res.redirect('/main');
    });

  })(req, res, next);

})

// passport 기반 로그아웃
router.get('/logout', isLoggedIn, async (req, res, next) => {
  req.logout(function (err) {
    req.session.destroy();
    res.redirect('/');
  });

});

router.get("/main", isLoggedIn, async (req, res, next) => res.render("main"));

module.exports = router;
