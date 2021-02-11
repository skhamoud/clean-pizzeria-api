/** Validates the data passed through the rules also passed
 * @return {[String]}
 * @param {object} data data object to validate against .
 * @param {object} rules an object with each field having a string of rules to be applied.
 * The rules are just a string of rules separated by the `|` symbol , like in the example below
 * ```
 * 
 * validationErrors = validator(data , {
 *   name : 'required|string|min:3',
 *   email : 'required|email',
 *   password : 'required|min:6'
 * })
 * // then check validationErrors.length for errors in validation
 *
 * ```
 */
function validator(data, rules) {
  // loop through the data fields to validate
  return Object.keys(rules).reduce((errors, field) => {
    const rulesStr = rules[field];
    return errors.concat(validateField(field, data[field], rulesStr))
  }, []);
}

/** validates a single field agains the passed in rules
 * @param {string} field field
 * @param value
 * @param {string} rulesStr
 * @returns {[string]} errors
 */
function validateField(field, value , rulesStr) {
  if (typeof rulesStr != 'string')
      throw 'The validator rules for a field must be a string. check the rules for ' + field + ' field';
  const errors = []
  rulesStr.split('|').forEach((rule) => {
    // console.log(`rules for ${field} => ${rule}`)
    const fieldValidationErr = _validateAgainstRule(value, rule);
    if (fieldValidationErr) errors.push(`${field} : ${fieldValidationErr}`);
  });
  return errors;
}

/** Validates value agains rule passed
 * @param {any} value the value to validate , can be any thing
 * @param {string} rule
 * supports `required`,`string`, `number`, `int`, `min:length`, `max:length`, `email`,
 */
function _validateAgainstRule(value, rule) {
  if (rule == 'required') {
    if (!_exists(value)) return 'field is required';
  }
  if (rule == 'true') {
    if (_exists(value) && !value) return 'field must be set to true';
  }
  if (rule == 'string') {
    if (_exists(value) && typeof value != 'string') return 'must be a string';
  }

  if (rule == 'number') {
    if (_exists(value) && typeof value != 'number') return 'must be a number';
  }

  if (rule == 'int') {
    if ((_exists(value) && typeof value != 'number') || !Number.isInteger(value)) return 'must be an integer';
  }

  if (rule == 'email') {
    if (_exists(value) && !_validEmail(value)) return 'invalid email';
  }
  if (rule == 'url') {
    if (_exists(value) && !_validUrl(value)) return 'invalid url';
  }

  if(rule.startsWith('length:')) {
    // check if value has set length
    const length = parseInt(rule.split(':')[1]);
    if(!Number.isInteger(length)) throw 'validator rule "length" must have an integer after the ":"';
    if (typeof value == 'number' || typeof value == 'string') {
      if(value.toString().length !== length) return `field must have ${length} characters`;
    }
  }
  // check if rule is min or max
  if (rule.startsWith('min:') || rule.startsWith('max:')) {
    const limitRule = rule.split(':');
    rule = limitRule[0];
    const limitVal = parseInt(limitRule[1]);
    // convert to string to get length in case of a number
    if (typeof value == 'number' || typeof value == 'string') {
      value = value.toString();
      if ( rule == 'min' && value.length < limitVal)
        return `field must have at least ${limitVal} characters.`;
      if ( rule == 'max' && value.length > limitVal)
        return `field must have a maximum of ${limitVal} characters.`;
    }
  }
}

/** Checks value passed is not empty-ish */
function _exists(value) {
  // if is truthy or other values that are falsy and exist like 0 or false
  return value || value === 0 || value === false;
}

/** Returns wether or not an email is valid */
function _validEmail(value) {
  if (typeof value != 'string') return false;
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return mailformat.test(value.trim());
}
/** Returns wether or not an email is valid */
function _validUrl(value) {
  if (typeof value != 'string') return false;
  const urlForm = /^(http\:\/\/|https\:\/\/)([\w-]+\.)*[\w-]+(\.\w{2,3})\/*/;
  return urlForm.test(value.trim());
}

exports.validateField = validateField

exports.validator = validator;
