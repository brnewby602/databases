var Sequelize = require('sequelize');

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

module.exports.createConnection = function() {
  var userid = null;

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
    }).then(function(data) {
      callback({insertId: data.id});
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

/*
[{"id":1,"text":"testmessage 30000","roomname":"lobby","createdAt":"2016-03-26T23:02:51.000Z","updatedAt":"2016-03-26T23:02:51.000Z","userId":1,"user":{"id":1,"name":"Jonathan","createdAt":"2016-03-26T16:00:08.000Z","updatedAt":"2016-03-26T16:00:08.000Z"}}
*/

module.exports.getMessages = function(callback) {

  Messages.findAll( {
    include: [{model: User, required: true, attributes: ['name']}]
  }).then(function(data) {
    var chats = data.map(function(chat) {
      chat.username = chat.user.name;
      chat.objectId = chat.id; 
      return {
        objectId: chat.id,
        username: chat.user.name,
        text: chat.text,
        roomname: chat.roomname,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      };
    });
    callback({results: chats});
  }).catch(function(err) {
    console.log('FAILED TO retreive messages, err = ' + JSON.stringify(err));

  });

};
