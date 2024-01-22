const express = require('express');
const router = express.Router();

var db = require('../models/index');
var bcrypt = require('bcryptjs');
var AES = require('mysql-aes');

const { isLoggedIn, isNotLoggedIn } = require('./sessionMiddleware');

var resultMsg = '';

/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001
*/
router.get('/', isNotLoggedIn, async (req, res) => {
  const KAKAO_AUTH_URL = process.env.KAKAO_AUTH_URL;

  res.render('login', {
    layout: false,
    resultMsg: '',
    KAKAO_AUTH_URL,
  });
});

/*
-관리자 계정으로 로그인 성공 이후에 최초로 보여줄 관리자 웹사이트 메인페이지
-반드시 관리자 로그인 성공 후에 접속이 가능합니다
-http://localhost:3001
*/
router.post('/', isNotLoggedIn, async (req, res) => {
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
        admin_name: login_member.admin_name,
      };

      req.session.isLoggedIn = true;
      req.session.loginUser = sessionLoginData;
      req.session.save(function () {
        return res.redirect('/main');
      });
    } else {
      return res.render('login', {
        layout: false,
        resultMsg: 'Password not correct.',
      });
    }
  } else {
    return res.render('login', {
      layout: false,
      resultMsg: 'Admin member not found.',
    });
  }
});

router.post('/kakao/login', async () => {
  let token;
  try {
    token = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(data => {});
  } catch (error) {}
});

router.get('/main', isLoggedIn, async (req, res) => res.render('main'));

module.exports = router;
