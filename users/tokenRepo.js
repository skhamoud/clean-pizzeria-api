const fileDB = require('../infrastructure/db/fileDB')

function makeTokenRepo(db = fileDB) {
  return Object.freeze({
    getTokenById,
    saveToken,
    createToken,
    deleteToken,
  });
  async function getTokenById(id) {
    const tokenModel = await db.read('tokens', id);
    if (!tokenModel) return null;
    return tokenModel;
  }
  /** @param {Token} token */
  async function saveToken(token) {
    return db.update('tokens', token.id, token.model());
  }
  /** @param {Token} token */
  async function createToken(token) {
    try {
      await db.create('tokens', token.id, token.model());
      return token;
      
    } catch (error) {
      return null
    }
  }

  async function deleteToken(id) {
    try {
      await db.delete('tokens', id);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = makeTokenRepo(fileDB);
