var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var nunjucks = require('nunjucks');
var app = express();
var coverapi = require('./coverapi');

// add nunjucks to requires so filters can be
// added and the same instance will be used inside the render method
cons.requires.nunjucks = nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

const routes = require('./routes/index');
const conf = require('./routes/conf');
const fileman = require('./routes/fileman');

// view engine setup
app.engine('html', cons.nunjucks);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config.SERVER_ROOT)));

// checks if the user is logged in to cover
app.use('/', coverapi);

app.use('/', routes);
app.use('/conf.json', conf);
app.use('/fileman', fileman);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
