/** Union that is used to figure out the nature of a returned value */
module.exports = Object.freeze({
  ok(succesfulResult=true) {
    return makeResult(null, succesfulResult );
  },
  fail(failedResult) {
    if(typeof failedResult !== 'object' || !failedResult.message || !failedResult.name){
      throw Error('Result failures must have a "message" and a "name" properties')
    }
    return makeResult(failedResult, null);
  },
});

/** @return {Result} */
function makeResult(failureVal, sucessVal) {
  let _value = null;
  let _error = { message: '', name: '' };
  let _isASuccess = false;

  if ((failureVal && sucessVal) || (!failureVal && !sucessVal))
    throw Error('Result unions must either have a successful value or a failure value and never both at the same time');

  if (!failureVal && sucessVal) {
    _value = sucessVal;
    _isASuccess = true;
  }
  if (failureVal && !sucessVal) {
    _error = failureVal;
    _isASuccess = false;
  }

  return Object.freeze({
    isSuccess: _isASuccess,
    isFailure: !_isASuccess,
    value: _value,
    error: _error,
  });

}

/** @typedef Result<T>
 * @type {Object} Result
 * @property {Boolean}  isSuccess
 * @property {Boolean}  isFailure
 * @property {T} value
 * @property {Object} error
 * @property {string} error.message
 * @property {string} error.name
 *
 */
