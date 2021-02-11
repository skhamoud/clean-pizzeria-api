const Result = require('../../core/Result');
const User = require('../user');
const Token = require('../token');
const userRepo = require('../userRepo');
const tokenRepo = require('../tokenRepo');
const failures = require('../failures');
const appFailures = require('../../core/failures');

function makeLoginUseCase({ tokenRepo, userRepo }) {
  /** Logs user in
   * required : email, password
   * output : auth token
   */
  return async function loginUseCase(email, password) {
    const emailOrErr = User.validateEmail(email);
    const passwordOrErr = User.validatePassword(password);

    if (emailOrErr.isFailure || passwordOrErr.isFailure) {
      return Result.fail(failures.AUTH.INVALID_CREDENTIALS);
    }

    try {
      const userModel = await userRepo.getUserByEmail(email);

      if (!userModel) return Result.fail(failures.AUTH.INVALID_CREDENTIALS);

      const user = User.from(userModel).value;

      if (!user.authenticatePassword(password)) {
        return Result.fail(failures.AUTH.INVALID_CREDENTIALS);
      }

      // user checks out make a session token

      const tokenOrError = Token.create(user.id);
      if (tokenOrError.isFailure) return Result.fail(failures.TOKEN.INVALID_FIELDS); // should just work

      if (await tokenRepo.createToken(tokenOrError.value)) {
        return Result.ok(tokenOrError.value.id);
      } else return Result.fail(appFailures.UNEXPECTED)
    } catch (error) {
      return Result.fail(appFailures.create(error));
    }
  };
}

module.exports = makeLoginUseCase({ userRepo, tokenRepo });
