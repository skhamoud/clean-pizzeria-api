const crypto = require('crypto')
const config = require('../config');
const {hash256, hmac512} = require('../lib/helpers')
/** Creates an 30 character long id from passed email using sha-256 hash
 * @param {String} email
 */
function generateIdFromEmail(email) {
  // create id of doc by hashing email for later querying
  
  const emailHash = hash256(email);
  return emailHash.slice(0,30)
}



/** passwords related utils container object
 * use https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
 *
 */
const _passwords = {
  salt: config.hashingSalt,
  /** Uses `sha512` algorithm to hash the password with provided salt
   * @param {string} password
   */
  create(password) {
    return crypto.createHmac('sha512', _passwords.salt).update(password).digest('hex');
  },
  /** Verifies if password matches the hashed password
   * @param {String} password the password to verify
   * @param {string} hashedPassword password data to verify against
   */
  verify(password, hashedPassword) {
    return _passwords.create(password) === hashedPassword;
  },
};

module.exports = {_passwords, generateIdFromEmail}
