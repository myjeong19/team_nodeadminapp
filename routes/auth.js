var express = require("express");
var router = express.Router();

var path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require("dotenv").config();
const cookieSession = require("cookie-session");
const helmet = require("helmet");

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};
console.log("config : ", config);
const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  done(null, profile); //null은 에러가 없다.
}

//passport전략부터 정하고 router에서 사용함.
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((id, done) => {
  // User.findById(id).then(user => {
  //   done(null, user);
  // });
  done(null, id);
});

router.use(helmet());
router.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

router.use(passport.initialize());
router.use(passport.session()); //req.user사용할 수 있게 해줌

function checkLoggedIn(req, res, next) {
  console.log("checkLoggin start, cur User ", req.user);
  //const isLoggedIn = req.user;//다른 방식으로도 될 수 잇으니까..이건 너무 지엽적
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must login!" });
  }
  next();
}

//여기서 로그인
router.get(
  "/auth/google/",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

//구글에서 authorization code를 보내주는 라우터
//구글 OAuth에서 등록한 라우팅 경로임
//passport.authenticate('google')이 알아서 로그인함.
//여기의 2번재 인자는 옵션. 성공하거나 실패할 때 향할 주소 옵션??
//세번째 인자는 뭐가 됐든 처리하는 핸들러.
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "../",
    session: true,
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

//로그아웃 하는 경로
router.get("/auth/logout", (req, res) => {
  //Removes req.user and clears any logged in session
  req.logout();
  res.redirect("../");
});

router.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("Your Secret Value is 42HANMOOL!!");
});

router.get("/failure", (req, res) => {
  return res.send("Failed to log in!");
});

/* GET home page. */
// router.get("/", (req, res) => {
//   console.log("hi");
//   //res.send("hi");
//   res.sendFile(path.join(__dirname, "../", "public", "index.html"));
// });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("google login");
});

module.exports = router;
