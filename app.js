const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const layout = require('express-ejs-layouts');
var sequelize = require('./models/index').sequelize;

//express기반 서버세션 관리 팩키지 참조하기
var session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const channelRouter = require('./routes/channel');
const memberRouter = require('./routes/member');
const messageRouter = require('./routes/message');
const articleRouter = require('./routes/article');

const app = express();
sequelize.sync();

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

app.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: "testsecret",
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge:1000 * 60 * 10 //10분동안 서버세션을 유지하겠다.(1000은 1초)
        },
      }),
);

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
