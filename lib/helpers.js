const crypto = require('crypto');
const config = require('../config');

/** Parses json passed , returns and object if it fails
 * @param {string} json string to be parsed
 * @return {object}
 */
function jsonParser(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
}

/** Returns a randomString generated with cryptographic generated buffer
 * @param {Number} length
 */
function randomString(length = 10) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex');
}
/* calls callback num of times */
function repeatFn(num, cb) {
  for (let ii = 0; ii < num; ii++) {
    cb();
  }
}
/** Returns the hex representation of the hmac value with sha256 algo
 * @param {any} val
 * @returns {string} hmac
 */
function hmac256(val) {
  return crypto.createHmac('sha256', config.hashingSalt).update(val).digest('hex');
}
/** Returns the hex representation of the hmac value with sha512 algo
 * @param {any} val
 * @returns {string} hmac
 */
function hmac512(val) {
  return crypto.createHmac('sha512', config.hashingSalt).update(val).digest('hex');
}
/** Returns the hex representation of the hash value with sha256 algo
 * @param {any} val
 * @returns {string} hash
 */
function hash256(val) {
  return crypto.createHash('sha256').update(val).digest('hex');
}
/** Returns the hex representation of the hash value with sha512 algo
 * @param {any} val
 * @returns {string} hash
 */
function hash512(val) {
  return crypto.createHash('sha512').update(val).digest('hex');
}

/** deepCopies an object
 * @param obj
 */
function deepCopy(obj) {
  // copy object , if prop is object deep copy prop as well
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    const propVal = obj[prop];
    if (typeof propVal == 'object' && propVal !== null) {
      newObj[prop] = deepCopy(propVal);
    } else {
      newObj[prop] = propVal;
    }
  });
  return newObj;
}

/** convert array into an object keyed by specified key
 * @param {}Array arr
 */
function keyBy(arr, key="id", keyGenerator) {
  return arr.reduce((col, item) => {
    if( !item[key] && typeof keyGenerator !== 'function') {
      throw Error(`An item in the collection does not have a ${key} property, you should pass a key generator callback as the 3d argument`)
    }
    return { ...col, [item[key] || keyGenerator() ]: item }
  }, {});
}

module.exports = {
  jsonParser,
  hmac256,
  hmac512,
  hash256,
  hash512,
  randomString,
  deepCopy,
  keyBy,
};
