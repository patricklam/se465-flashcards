const createError = require('http-errors');
const express = require('express');
const path = require('path');
const Datastore = require('nedb'),
      db = new Datastore({ filename: '.data/db', autoload: true });

const frontendRouter = require('./frontendRouter'),
      apiRouter = require('./apiRouter');
const reset = require('./reset');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('db', db);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'local-assets')));

app.use('/api', apiRouter);
app.use('/', frontendRouter);

db.count({}, function (err, count) {
  console.log("Got "+count+" keys from db");
  if (err) console.log("db error: ", err);
  else if (count <= 0) {
    reset.reset(app);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
