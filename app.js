require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require( 'express-handlebars' ).engine
var session = require('express-session')
var bodyParser = require('body-parser')
var MongoDBStore = require('connect-mongodb-session')(session);

var app = express();
var store = new MongoDBStore({
  uri: `mongodb+srv://${process.env['MONGO_USR']}:${process.env['MONGO_PSW']}@cluster0.k59l0tc.mongodb.net/?retryWrites=true&w=majority`,
  databaseName:'sagpic_lector',
  collection: 'mySessions'
});
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(bodyParser.json())
app.use(urlencodedParser)
// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));

//ROUTER
var indexRouter = require('./routes/index');
var login = require('./routes/login')
var genres = require('./routes/genres')
var authors = require('./routes/authors')
var stories = require('./routes/stories')

app.use('/', indexRouter);
app.use('/', login);
app.use('/', genres);
app.use('/', authors);
app.use('/', stories);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
} ) );

app.set( 'view engine', 'hbs' );
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('utils/error');
});
module.exports = app;
