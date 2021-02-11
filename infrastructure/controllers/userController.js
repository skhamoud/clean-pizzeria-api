const _data = require('../db/sync-fileDB');
const {validator} = require('../../lib/validator');
const { _passwords } = require('../../lib/helpers');
// const { isUserAuthenticated } = require('../../core/auth');
const userRepo = require('../../users/userRepo');

module.exports = {
  /** gets a user
   * *authenticated
   * data required : id
   */
  get: async function get(ctx, respond) {
    const { query } = ctx;
    const id = query.get('id');

    // validation
    const validationErrs = validator({ id }, { id: 'required|length:30' });
    if (validationErrs.length > 0) return respond(400, { err: 'Fields invalid', validationErrs });

    try {
      const user = await userRepo.getUser(id);
      delete user.hashedPassword;
      respond(200, { user });
    } catch (error) {
      respond(404, { err: 'User Not found' });
      // respond(404, { err: error.message });
    }
  },

  /** edits user details
   * *authenticated
   * data required : id and one other field
   * optional : name , email , address
   */
  put(ctx, respond) {
    // let {
    //   headers: { token },
    //   body: { id, email, password, name, address },
    // } = ctx;
    // // updatable fields , email can't be changed since we use it to derive ids
    // const updatableFields = { name, password, address };
    // // validate fields
    // validationErrs = validator(ctx.body, {
    //   id: 'required|string|length:30',
    //   name: 'string|min:3',
    //   password: 'string|min:8',
    //   address: 'string',
    // });
    // if (validationErrs.length > 0) return respond(400, { err: 'fileds are invalild', validationErrs });
    // // should provide at least one updatable field
    // if (!name && !password && !address) return respond(400, { err: 'You must provide at least one field to update' });

    // if (!token || typeof token !== 'string') return respond(403, { err: 'unauthorized, missing token' });
    // isUserAuthenticated(token, id, (authenticated) => {
    //   if (authenticated) {
    //     // look for user
    //     _data.read('users', id, function (err, userDoc) {
    //       if (err) return respond(404, { err: 'User not found' });
    //       // update every field
    //       Object.keys(updatableFields).forEach((key) => {
    //         const newValue = updatableFields[key];
    //         if (typeof newValue != 'undefined') {
    //           const oldValue = userDoc[key];
    //           // hash the password if it needs to be updated
    //           if (key === 'password') {
    //             userDoc.hashedPassword = _passwords.create(newValue);
    //           } else if (newValue != oldValue) {
    //             userDoc[key] = newValue;
    //           }
    //         }
    //       });

    //       // save the new user's data
    //       _data.update('users', id, userDoc, function (err) {
    //         if (err) return respond(500, { err: "Could not update the user's data" });
    //         respond(200, { message: 'successfully updated user' });
    //       });
    //     });
    //   } else respond(403, { err: 'unauthorized!' });
    // });
  },
  /* delete user
   * *authenticated
   * data required : id
   */
  delete(ctx, respond) {
    // const {
    //   query,
    //   headers: { token },
    // } = ctx;
    // const id = query.get('id');
    // // validation
    // const validationErrs = validator({ id }, { id: 'required|length:30' });
    // if (validationErrs.length > 0) return respond(400, { err: 'Fields invalid', validationErrs });

    // if (!token || typeof token !== 'string') return respond(403, { err: 'unauthorized, missing token' });
    // isUserAuthenticated(token, id, (authenticated) => {
    //   if (!authenticated) return respond(403, { err: 'unauthorized!' });

    //   _data.read('users', id, function (err, userDoc) {
    //     if (err) return respond(404, { err: 'User Not found' });
    //     _data.delete('users', id, function (err) {
    //       if (err) return respond(500, { err: 'Error deleting user' });
    //       respond(200, { message: 'successfully deleted the user' });
    //     });
    //   });
    // });
  },
};
