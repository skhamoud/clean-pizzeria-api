// TODO ENTTITY hould have a from Model factory and a create Factory for when data
// is provided by the user after that it's always gaonna be from model
const { validator, validateField } = require('../lib/validator');
const { randomString, deepCopy } = require('../lib/helpers');
const Result = require('../core/Result');
const failures = require('./failures');

/** @typedef Token
 *  @type {Object}
 * @property {String} id
 * @property {String} userId
 * @property {Number} expires
 */

/** factory for user factory
 * @param {object} { passwordLib, deepCopy, validator, validateField }helpers
 */
function createTokenFactory({ validator, validateField, randomString  ,deepCopy }) {
  return Object.freeze({
    create,
    from,
  });
 

  /** Creates a new token from the userId */
  function create(userId) {
    const tokenData = {
      id: randomString(40),
      userId,
      expires: Date.now() + 1000 * 60 * 60, //expires in an hour
    };

    return from(tokenData);
  }

  /** Token factory
   * @param {object} userData
   * @return {import('../core/Result').Result<Token>}
   */
  function from(tokenDTO) {
    const { id, userId, expires } = tokenDTO

    const validationErrs = validator(tokenDTO, {
      id: 'required|length:40',
      // unix time stamps with less than 12 digits would be before year 2000
      expires: 'required|number|min:12', 
      userId: 'required|min:30',
    });

    if (validationErrs.length > 0) return Result.fail(failures.TOKEN.INVALID_FIELDS);

    const _token = {
      id,
      userId,
      expires,
    };

    /** Extends the token expiring time by another hour */
    function extend() {
      // only extend if the session hasn't expired
      if (_token.expires < Date.now()) return Result.fail(failures.TOKEN.EXPIRED);
      // extend another hour
      _token.expires = Date.now() + 1000 * 60 * 60;
      return Result.ok();
    }

    /** Gets readable expire field  */
    function getEndDate() {
      return new Date(_token.expires).toISOString()
    }

    /** Representation that can go back to api client , omit any sensitive data
     * that user shouldn't have access to
     */
    function json() {
      return { ...deepCopy(_token), endDate: getEndDate() };
    }

    /** the representation that can go in the db, basically the _user object
     *
     */
    function model() {
      return json();
    }

    return Result.ok(Object.freeze({
      id,
      userId,
      expires,
      extend,
      getEndDate,
      json,
      model,
    }));
  }

  // 
}

module.exports = createTokenFactory({ validator, validateField, randomString, deepCopy });
