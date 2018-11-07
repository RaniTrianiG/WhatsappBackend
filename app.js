var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var jwt           = require('express-jwt');
var axios         = require('axios')


var indexRouter  = require('./routes/index');
var usersRouter  = require('./routes/users');
var socketRouter = require('./routes/socket');
var apiRouter    = require('./routes/api');
var key          = require('./config/key.json');

var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io').listen(server);

socketRouter(io);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(jwt({secret: key.secret}).unless({path:['/api/user/','/api','/api/login/',/\/api\/chatlist/i, /\/api\/chat/i]}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/socket', socketRouter);
app.use('/api', apiRouter)
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.io = io;
  // next();
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports ={app:app, server:server};
