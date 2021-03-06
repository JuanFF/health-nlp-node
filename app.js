/**
 * app.js 
 * Initialize the express app.
 */

// First of all, the environment is loaded.
const dotenv = require('dotenv');
dotenv.load();
// Then load dependencies for initialization
// Boot
const log = require('./boot/logger'),
  config = require('./boot/configuration'),
  // Connection to beanstalkd
  beanstalkd = require('./boot/beanstalkd')
    .connect(require('fivebeans'), config, log),
  // App
  express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  // Routes
  router = express.Router(),
  index = require('./routes/index'),
  analysis = require('./routes/analysis'),
  // Other dependencies
  Twitter = require('twitter'),
  twitterStream = require('./boot/twitter-stream'),
  firebase = require('firebase'),
  fbCleaner = require('./boot/firebase-cleaner')(config, firebase),
  fs = require('fs');

log.trace('Start initialization.');
log.debug('Configuration parameters: ' + JSON.stringify(config));

// Initialize the express app
const app = express();

/** MIDDLEWARE ***********************************************************/
// CORS middleware
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', config.cors.allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/** ROUTES ***************************************************************/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index(router, log));
app.use('/analysis', analysis(beanstalkd, router, log));

/** ERROR HANDLERS *******************************************************/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  log.warn('Catch 404 error.');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  let returnError = process.env.NODE_ENV !== 'production';
  res.locals.error = returnError ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json(res.locals.error);
  log.error('An error occurred: ' + err.message);
});

//--- OTHER SERVICES: Twitter & Firebase cronjobs ----------------------//
if (process.env.NODE_ENV !== 'test') {
  fbCleaner.clean();
  // Clean older messages from firebase every two hours.
  setInterval(() => {
    fbCleaner.clean();
  }, 2 * 60 * 60 * 1000);

  twitterStream.runTwitterStream(Twitter, beanstalkd, fs, config, log);
  // Check the stream's activity every 50s.
  // If the inactivity is longer than 2m, restart.
  setInterval(() => {
    let inactivity = (new Date()).getTime() - twitterStream.getTimestamp();
    if (inactivity > 120000) {
      log.warn('Inactivity detected on twitter stream. Attempting to restart.');
      twitterStream.runTwitterStream(Twitter, beanstalkd, fs, config, log);
    }
  }, 50000);
}


module.exports = app;
