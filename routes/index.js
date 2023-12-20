const express = require("express");
const router = express.Router();

/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001
*/
router.get("/", async (req, res) => res.render("login", { layout: false }));

/*
-관리자 계정으로 로그인 성공 이후에 최초로 보여줄 관리자 웹사이트 메인페이지
-반드시 관리자 로그인 성공 후에 접속이 가능합니다
-http://localhost:3001
*/
router.post("/", async (req, res) => {
  res.redirect("/main");
});

router.get("/main", async (req, res) => res.render("main"));

module.exports = router;
