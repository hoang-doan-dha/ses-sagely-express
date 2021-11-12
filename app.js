var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
const redis = require('redis')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// pass the express to the connect redis module
// allowing it to inherit from session.Store
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient()

// ---
// Router Controller
// ---
var indexRouter = require('./routes/index');
var viewsRouter = require('./routes/views');
const emailsRouter = require('./routes/emails');
const scheduledMessageRouter = require('./routes/scheduledMessage');
const communicationsRouter = require('./routes/communications');
const { loginErrorHandler } = require('./handlers/loginErrorHandler');

var app = express();

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'something is secret',
  store: new RedisStore({ client: redisClient })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser('my secret here.'));

app.use(express.static(path.join(__dirname, 'public')));

// ---
// Router
// ---
app.use('/', indexRouter);
app.use('/views', viewsRouter);
app.use('/emails', emailsRouter);
app.use('/scheduledMessage', scheduledMessageRouter);
app.use('/communications', communicationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// ----
// LOGIN ERROR HANDLER
// ----
app.use(loginErrorHandler);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
