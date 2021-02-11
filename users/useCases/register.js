const Result = require('../../core/Result');
const User = require('../user');
const userRepo = require('../userRepo');
const failures = require('../failures');
const appFailures = require('../../core/failures');

function makeRegisterUseCase({ userRepo }) {
    return async function register({ email, password, name, address }) {

        // const emailOrErr = User.validateEmail(email);
        // const passwordOrErr = User.validatePassword(password);
        // const nameOrError = User.validateName(name)

        // if (emailOrErr.isFailure || passwordOrErr.isFailure || nameOrError.isFailure) {
        //     //TODO: Handle this better to let user know which fields are not right
        //   return Result.fail(failures.AUTH.INVALID_FIELDS);
        // }

        try {
            const userModel = await userRepo.getUserByEmail(email)
            if (userModel) return Result.fail(failures.AUTH.EMAIL_TAKEN)
            // email not taken , create user, validation is done internally
            const userOrError = User.create({ email, password, name, address })
            // failed validation or some other error , forward the Result as is
            if (userOrError.isFailure) return userOrError
            // everything went ok , so now u have a user, persist them
            const user = userOrError.value
            if (await userRepo.createUser(user.model())) {
                // trigger other flows related here
                return Result.ok(user.json())
            } else return Result.fail(appFailures.UNEXPECTED)

        } catch (error) {
            return Result.fail(appFailures.create(error))
        }


    }
}
module.exports = makeRegisterUseCase({ userRepo })