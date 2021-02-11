const fileDB = require('../infrastructure/db/fileDB');
const User = require('./user');

function makeUserRepo(db = fileDB) {
  return Object.freeze({
    getUser,
    getUserByEmail,
    getUsers,
    createUser,
    saveUser,
    deleteUser,
  });
  async function getUser(id) {
    return db.read('users', id);
  }

  async function getUserByEmail(email) {
    const userId = User.generateId(email);
    return db.read('users', userId);
  }
  async function getUsers() {}
  async function saveUser(data) {
    return db.update('users', data.id, data);
  }
  /** Creates a user, returns user model if successful and null otherwise */
  async function createUser(data) {
    return db.create('users', data.id, data);
  }
  async function deleteUser(id) {
    return db.delete('users', id);
  }
}

module.exports = makeUserRepo(fileDB);
