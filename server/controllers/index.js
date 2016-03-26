var models = require('../models');
var db = require ('../db');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(JSON.parse(data));
  });
};

var makeActionHandler = function(actionMap) {
  return function(request, response) {
    var action = actionMap[request.method];
    if (action) {
      action(request, response);
    } else {
      sendResponse(response, '', 404);
    }
  };
};

module.exports = {
  messages: {
    get: function (req, res) {
      db.getMessages(function(messages) {
        sendResponse(res, messages, 200);
      });

    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var chat = {
        'username': req.body.username,
        'text': req.body.text,
        'roomname': req.body.roomname
      };
      chat.text = chat.text.replace(/(\\+)?'/g, '\'');
      db.insertMessage(chat, function(results) {
        var returnObject = {
          objectId: results.insertId
        };
        sendResponse(res, returnObject, 201);
      });
      // sendResponse(res, {objectId: 1}, 201);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      db.insertUser(req.body.username);
      sendResponse(res, '', 201);
    }
  }
};

