const express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      routes = require('./routes/index'),
      datalist = require('./routes/datalist'),
      machineSection = require('./routes/machineSection'),
      workrollSection = require('./routes/workrollSection'),
      app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/datalist', datalist);
app.use('/machineSection',machineSection);
app.use('/workrollSection',workrollSection);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
