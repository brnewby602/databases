var express = require('express');
var db = require('./db');
var parser = require('body-parser');
var morgan = require('morgan');
var winston = require('winston');
var fs = require('fs');

var logDir = './logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: logDir + '/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};



// Middleware
// var parser = require('body-parser');

// Router
var router = require('./routes.js');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
app.use(require('morgan')('dev', { 'stream': logger.stream }));

// Logging and parsing
//app.use(morgan('dev'));
app.use(parser.json());

// Set up our routes
app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../client'));

// If we are being run directly, run the server.
if (!module.parent) {
  db.createConnection();
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}
