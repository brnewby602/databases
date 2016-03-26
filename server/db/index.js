var Sequelize = require('sequelize');

// var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'hr',
//   database: 'chat'
// });
var connection = new Sequelize('chat', 'root', 'hr');

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = connection.define('user', {
  name: Sequelize.STRING
},
  {
    freezeTableName: true,
    classMethods: {
      associate: function(model) {
        User.hasMany(model);
      }
    }
  }

);

var Messages = connection.define('messages', {
  text: Sequelize.STRING,
  roomname: Sequelize.STRING //,
  // createdAt: Sequelize.DATE,
  // updatedAt: Sequelize.DATE
}, {
  classMethods: {
    associate: function(model) {
      console.log("IM HERE");

      Messages.belongsTo(model, {
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false

        },
        foreignKeyConstraint: true
      });
    }
  }
});

Messages.associate(User);
User.associate(Messages);

//User.hasMany(Messages, {foreignKey: 'id_user'});
//Messages.belongsTo(User, {foreignKey: 'id_user'});

module.exports.createConnection = function() {
  var userid = null;
  // console.log(User);
  // console.log(connection);
  connection.authenticate()
      .then(function() {
        console.log('successful authentication');
      })
      .then(function() {
        User.sync()
          .then(function() {
            console.log('successfully created messages table');
          }
          )
          .catch(function(err) { console.log('error trying to insert user: ' + err); } );
      }) 
      .then(function() {
        Messages.sync().then(function() {
          console.log('successfully created user table');
        }
      );
      });
      // .then(function() {
      //   // console.log('im here 444****************');
      //   // connection.sync().then(function () {
      //   User.create({
      //     name: 'Jake'
      //   });
      //   // });
      // })
      // .then(function() {
      //   // console.log('im here 444****************');
      //   connection.sync().then(function () {
      //     Messages.create({
      //       text: 'sample chat message',
      //       roomname: 'lobby',
      //       userId: userid

      //     }).then(function (data) {
      //       // console.log(data.values);
      //     });
      //   });
      // });
};

/*
+-----------+-----------+------+-----+---------+----------------+
| Field     | Type      | Null | Key | Default | Extra          |
+-----------+-----------+------+-----+---------+----------------+
| id        | int(11)   | NO   | PRI | NULL    | auto_increment |
| message   | char(255) | YES  |     | NULL    |                |
| createdAt | datetime  | YES  |     | NULL    |                |
| updatedAt | datetime  | YES  |     | NULL    |                |
| roomname  | char(255) | YES  | MUL | NULL    |                |
| id_user   | int(11)   | YES  | MUL | NULL    |                |
+---------------------------------------------------------------+

*/

/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */


/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */


// Messages.find({ where: { ...}, include: [User]})









module.exports.insertMessage = function(message, callback) {
  var roomname = message.roomname;
  var username = message.username;
  var message = message.text;


  User.findOne({
    where: {name: username}
  }).then(function(user) {
    // found the user so create the messages row now
    Messages.create({
      text: message,
      roomname: roomname,
      userId: user.id
    }).then(function() {
      console.log('successfully created message');
    }).catch(function(err) {
      console.log('failed to create message, err = ' + err);
    });

  });

};

module.exports.insertUser = function(username) {
  User.create({
    name: username
  });
};

/*
[{"id":1,"message":"In mercy's name, three days is all I need.","createdAt":"2016-03-26T02:02:33.000Z","updatedAt":"2016-03-26T02:02:33.000Z","roomname":"Hello","id_user":1}]
*/
module.exports.getMessages = function(callback) {

  // connection.query('SELECT messages.id, text, createdAt, updatedAt, roomname, name FROM messages INNER JOIN user on messages.id_user = user.id ORDER BY createdAt ASC', function (err, results) {
  //   if (err) {
  //     console.log('Error in getting messages: ' + err);
  //   } else {

  //     console.log(JSON.stringify(results));
  //     results.map(function(chat) {

  //       // console.log('chat!!!!');
  //       // console.log(JSON.stringify(chat));
  //       chat.objectId = chat.id;
  //       chat.username = chat.name;
  //       delete chat.id;
  //       delete chat.name;
  //     });
  //     callback({ results: results });
  //   }
  // });
};
