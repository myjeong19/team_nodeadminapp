const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var flash = require('connect-flash');
const layout = require('express-ejs-layouts');
require('dotenv').config();
var sequelize = require('./models/index').sequelize;
var session = require('express-session');
const passport = require("passport");
const passportConfig = require('./passport/index.js');

//분산서버 기반 세션 관리를 위한 Redis 환경설정1
const redis = require("redis");
let RedisStore = require("connect-redis")(session);

//세션 저장을 위한 레디스 서버 연결정보 설정하기
let redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  db: 0,
  password: "test12345",
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const channelRouter = require('./routes/channel');
const memberRouter = require('./routes/member');
const messageRouter = require('./routes/message');
const articleRouter = require('./routes/article');

const app = express();
app.use(flash());
sequelize.sync();
passportConfig(passport);

// //서버세션 설정
// app.use(session({
//   resave: false,
//   saveUninitialized: true, 
//   secret: "testsecret", 
//   cookie: {
//     httpOnly: true,
//     secure: false,
//     maxAge:1000 * 60 * 5 //5분동안 서버세션을 유지하겠다.(1000은 1초)
//   },
// }),
// );


app.use(
  session({
  store: new RedisStore({ client: redisClient }),
    saveUninitialized: true,
    secret: "testsecret",
    resave: false,
    cookie: {
      httpOnly: true,
      secure: false,
      //maxAge: 3600000, //세션유지 시간설정 : 1시간
    },
      ttl : 250, //Redis DB에서 세션정보가 사라지게 할지에 대한 만료시간설정
      token: "testsecret",
    })
  );


app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

app.use(layout);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/article', articleRouter);
app.use('/channel', channelRouter);
app.use('/member', memberRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
