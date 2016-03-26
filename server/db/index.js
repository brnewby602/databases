var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hr',
  database: 'chat'
});


module.exports.createConnection = function() {
  connection.connect(function(err) {
    // connected! (unless `err` is set)
    if (err) {
      console.log('failed to connect');
    } else {
      console.log('connected!');
    }
  });
};

/*
+-----------+-----------+------+-----+---------+----------------+
| Field     | Type      | Null | Key | Default | Extra          |
+-----------+-----------+------+-----+---------+----------------+
| id        | int(11)   | NO   | PRI | NULL    | auto_increment |
| message   | char(255) | YES  |     | NULL    |                |
| createdAt | datetime  | YES  |     | NULL    |                |
| updatedAt | datetime  | YES  |     | NULL    |                |
| id_room   | int(11)   | YES  | MUL | NULL    |                |
| id_user   | int(11)   | YES  | MUL | NULL    |                |
+---------------------------------------------------------------+

*/


module.exports.insertMessage = function(message, callback) {
  var roomname = message.roomname;
  var username = message.username;
  var message = message.text;

  var query = 'INSERT INTO messages VALUES (NULL, \'' + message +
    '\', NOW(), NOW(), \'' + roomname +
    '\',(select id from user where name = \'' + username + 
    '\'))';

  console.log(query);
  connection.query(query, function (err, results) {
    if (err) {
      console.log('Error in selecting room row: ' + err);
    } else {
      callback(results);
    }
  });
};

module.exports.insertUser = function(username) {
  connection.query('INSERT INTO user VALUES(NULL,\'' + username + '\')', function (err, results) {
    if (err) {
      console.log('Error in inserting user row: ' + err);
    } else {
    }
  });
};

/*
[{"id":1,"message":"In mercy's name, three days is all I need.","createdAt":"2016-03-26T02:02:33.000Z","updatedAt":"2016-03-26T02:02:33.000Z","roomname":"Hello","id_user":1}]
*/
module.exports.getMessages = function(callback) {
  connection.query('SELECT * FROM messages', function (err, results) {
    if (err) {
      console.log('Error in getting messages: ' + err);
    } else {
      results.map(function(chat) {
        chat.objectId = chat.id;
        delete chat.id;
      });
      console.log('inside getMessages b4 return: ' + JSON.stringify(results));
      callback({ results: results });
    }
  });
};
