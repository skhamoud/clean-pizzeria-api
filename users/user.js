// TODO ENTTITY hould have a from Model factory and a create Factory for when data
// is provided by the user after that it's always gaonna be from model
const { deepCopy } = require('../lib/helpers');
const { validator, validateField } = require('../lib/validator');
const Result = require('../core/Result');
const { generateIdFromEmail, _passwords } = require('./shared');
const failures = require('./failures');

/** @typedef User
 * @type {object} User
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} phone
 * @property {boolean} tosAgreement
 * @property {function} json
 * @property {function } model
 * @property {function} setPassword
 * @property {function} getPassword
 */

/** factory for user factory
 * @param {object} { passwordLib, deepCopy, validator, validateField }helpers
 */
function createUserFactory({ passwordLib, deepCopy, validator, validateField }) {
  const lockedFields = ['hashedPassword', 'tosAgreement'];

  return Object.freeze({
    create,
    from,
    generateId,
    validateEmail,
    validatePassword,
    validateName,
    hashPassword,
  });

  function verifyPassword(password, hash) {
    return passwordLib.verify(password, hash)
  }

  function hashPassword(password) {
    return passwordLib.create(password);
  }

  function generateId(email) {
    return generateIdFromEmail(email);
  }

  /** creates a user for 1st time  */
  function create({ email, password, name, address="" }) {
      
    const emailOrErr = validateEmail(email);
    const passwordOrErr = validatePassword(password);
    const nameOrErr = validateName(name);

    if ( passwordOrErr.isFailure) {
      // return Result.fail(failures.AUTH.INVALID_FIELDS);
      return passwordOrErr
    }
    if (emailOrErr.isFailure ) {
      // return Result.fail(failures.AUTH.INVALID_FIELDS);
      return emailOrErr
    }
    if (nameOrErr.isFailure) {
      // return Result.fail(failures.AUTH.INVALID_FIELDS);
      return nameOrErr
    }

      
    const id = generateId(emailOrErr.value);
    const hashedPassword = hashPassword(passwordOrErr.value);

    return from({
      id,
      name: nameOrErr.value,
      email: emailOrErr.value,
      hashedPassword,
      address,
    });
  }

  /** User factory 
   * @param {object} userDTO
   * @return {Result.Result}
   */
  function from(userDTO) {
    const { id, email, name, hashedPassword, address } = userDTO;

    /** user object for internal reference , inaccessible from outside
     * gets updated on update method */
    const _user = {
      id,
      name,
      email,
      address,
      hashedPassword,
    };


    /** Representation that can go back to api client , omit any sensitive data
     * that user shouldn't have access to
     */
    function json() {
      return Object.freeze({
        id,
        name,
        email,
        address,
      });
    }

    /** the representation that can go in the db, basically the _user object
     *
     */
    function model() {
      return Object.freeze(deepCopy(_user));
    }

    /** Checks whether password is valid */
    function authenticatePassword(password){
      return verifyPassword(password, _user.hashedPassword)
    }

    return Result.ok(
      Object.freeze({
        id,
        email,
        name,
        hashedPassword,
        address,
        authenticatePassword,
        json,
        model,
      })
    );
  }

  function validateEmail(email) {
    const emailValidationErrs = validate('email', email);
    return emailValidationErrs.length > 0
      ? Result.fail({ message: emailValidationErrs[0], name: failures.AUTH.INVALID_FIELDS.name })
      : Result.ok(email);
  }
  
  function validatePassword(password) {
    const passwordValidationErrs = validate('password', password);
    return passwordValidationErrs.length > 0
      ? Result.fail({ message: passwordValidationErrs[0], name: failures.AUTH.INVALID_FIELDS.name })
      : Result.ok(password);
  }

  function validateName(name) {
    const nameValidationErrs = validate('name', name);
    return nameValidationErrs.length > 0
      ? Result.fail({ message: nameValidationErrs[0], name: failures.AUTH.INVALID_FIELDS.name })
      : Result.ok(name);
  }

  /**
   *
   * @param {string} field the name of the user field must be updatable
   * @param {*} value value to validate
   * @returns {[string]} array of erros if any
   */
  function validate(field, value) {
    switch (field) {
      case 'email':
        return validateField(field, value, 'required|email');
      case 'name':
        return validateField(field, value, 'required|string|min:2');
      case 'password':
        return validateField(field, value, 'required|string|min:8');
      default:
        // means it's not validated right so throw anyway
        return ['invalid field'];
    }
  }
}

module.exports = createUserFactory({ validator, validateField, passwordLib: _passwords, deepCopy });
