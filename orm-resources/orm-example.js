/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

var Sequelize = require('sequelize');
var db = new Sequelize('chatter', 'root', '');
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = db.define('user', {
  username: Sequelize.STRING
});

var Messages = db.define('messages', {
  userid: Sequelize.INTEGER,
  text: Sequelize.STRING,
  roomname: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  'user_id': Sequelize.INTEGER
});

User.hasMany(Messages, {foreignKey: 'id_user'});
Messages.belongsTo(User, {foreignKey: 'id_user'});

// Messages.find({ where: { ...}, include: [User]})

/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
User.sync().success(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
  var newUser = User.build({username: 'Jean Valjean'});
  newUser.save().success(function() {

    /* This callback function is called once saving succeeds. */

    // Retrieve objects from the database:
    User.findAll({ where: {username: 'Jean Valjean'} }).success(function(users) {
      // This function is called back with an array of matches.
      for (var i = 0; i < users.length; i++) {
        console.log(users[i].username + ' exists');
      }
    });
  });
});
