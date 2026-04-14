const Datastore = require('nedb-promises');

const usersDB = Datastore.create('Users.db');
const userRefreshTokensDB = Datastore.create('UserRefreshTokens.db');
const userInvalidTokensDB = Datastore.create('UserInvalidTokens.db');

module.exports = {
  usersDB,
  userRefreshTokensDB,
  userInvalidTokensDB
};
