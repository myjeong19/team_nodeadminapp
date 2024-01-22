//로그인 안됐으면 로그인 페이지로
exports.isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn != undefined) {
    console.log(req.session.isLoggedIn);
    next();
  } else {
    //res.redirect('/');
    next(); //일단 다음 구글 로그인 미들웨어로 보냄
  }
};

//로그인 되어있다면 main으로
exports.isNotLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn == undefined) {
    next();
  } else {
    res.redirect("/main");
  }
};
