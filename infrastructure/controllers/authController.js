const loginUseCase = require('../../users/useCases/login');
const registerUseCase = require('../../users/useCases/register')
const logoutUseCase = require('../../users/useCases/logout');
const failures = require('../../users/failures');
const appFailures = require('../../core/failures')

module.exports = {
  // TODO use a useCase for this
  async register(ctx, respond) {
    /** Creates a new user
     * required : name , email, password
     * optional : address
     */

    let {
      body: { email, password, name, address },
    } = ctx;
    // init missing fields
    address = address ? address : '';

    try {
      const registrationOrErr = await registerUseCase({ email, password, name, address })
      if (registrationOrErr.isSuccess) {
        const userJson = registrationOrErr.value
        respond(201, { user: userJson, message: 'successfully registered!' })
      } else {
        const failure = registrationOrErr.error
        switch (failure.name) {
          case failures.AUTH.INVALID_FIELDS.name:
          case failures.AUTH.EMAIL_TAKEN.name:
            respond(400, { err: failure.message })
            break;
          default:
            respond(500, { err: failure.message })
            break;
        }
      }
    } catch (error) {
      respond(500, { err: appFailures.create(error).message })
    }
  },

  /** Creates a new token
   * required : email , password
   */
  async login(ctx, respond) {
    const {
      body: { email, password },
    } = ctx;

    try {
      const tokenOrErr = await loginUseCase(email, password);

      if (tokenOrErr.isFailure) {
        const failure = tokenOrErr.error;
        switch (failure.name) {
          case failures.AUTH.INVALID_CREDENTIALS.name:
            respond(400, { err: failure.message });
            break;

          default:
            respond(500, { err: failure.message });
        }
      } else {
        respond(200, { token: tokenOrErr.value });
      }
    } catch (error) {
      respond(500, { err: appFailures.create(error).message });
    }
  },
  /** updates a token
   * required data : id , shouldExtend
   */
  reauthenticate(ctx, respond) {
    // const {
    //   body: { id, shouldExtend },
    // } = ctx;
    // // validate tokenId
    // const validationErrs = validator(ctx.body, {
    //   id: 'required|length:40',
    //   shouldExtend: 'required|true',
    // });
    // if (validationErrs.length > 0) return respond(400, { err: 'invalid fields', validationErrs });
    // // look up token
    // _data.read('tokens', id, (err, token) => {
    //   if (!err && token) {
    //     // only extend if the session hasn't expired
    //     if (token.expires < Date.now()) return respond(400, { err: 'Token already expired!' });
    //     // extend another hour
    //     token.expires = Date.now() + 1000 * 60 * 60;
    //     _data.update('tokens', id, token, (err) => {
    //       if (err) return respond(500, { err: 'Error updating token' });
    //       // add a readable expiring field
    //       token.endDate = new Date(token.expires).toTimeString();
    //       respond(200, { message: 'succesfully updated token', token });
    //     });
    //   } else respond(404, { err: 'Not found' });
    // });
  },
  async logout(ctx, respond) {
    try {
      if (ctx.auth) {
        const successOrErr = await logoutUseCase(ctx.auth.token);
        if (successOrErr.isSuccess) respond(200, { message: 'Success!' });
        else {
          switch (successOrErr.error.name) {
            case failures.TOKEN.TOKENOTFOUND.name:
              respond(403, { err: failures.AUTH.UNAUTHENTICATED.message });
              break;
            default:
              respond(500, { err: appFailures.UNEXPECTED.message });
          }
        }
      } else respond(403, { err: failures.AUTH.UNAUTHENTICATED.message });
    } catch (error) {
      respond(500, { err: appFailures.create(error).message });
    }
  },
};
