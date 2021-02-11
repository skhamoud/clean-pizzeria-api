const Result = require('../../core/Result');
const tokenRepo = require('../tokenRepo');
const failures = require('../failures');

function makeLogOutUseCase({ tokenRepo }) {
  return async function logoutUseCase(tokenId) {
    const deleted = await tokenRepo.deleteToken(tokenId);
    return deleted ? Result.ok(true) : Result.fail(failures.TOKEN.TOKENOTFOUND);
  };
}

module.exports = makeLogOutUseCase({  tokenRepo });
