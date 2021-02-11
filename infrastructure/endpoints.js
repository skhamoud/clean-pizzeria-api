const { NOT_FOUND } = require('../core/failures');
const userController = require('./controllers/userController');
const menuController = require('./controllers/menuController');
const authController = require('./controllers/authController');
const cartController = require('./controllers/cartController');
const { makeRouteHandler } = require('./router');

module.exports = {
  // ====== billin ==========
  checkout : makeRouteHandler(cartController.checkout, {authenticate: true, accepted:'post'}),
  cart: makeRouteHandler(cartController, {authenticate: true}),
  // ===== products ===========
  menu: makeRouteHandler(menuController, { authenticate: true, accepted: 'get' }),
  // ===== users ======
  users: makeRouteHandler(userController, { authenticate: true }),
  // ===== Auth =============
  login: makeRouteHandler(authController.login, { accepted: 'post' }),
  register: makeRouteHandler(authController.register, { accepted: 'post' }),
  // reauthenticate: makeRouteHandler(authController.reauthenticate, { authenticate: true, accepted: ['put', 'post'] }),
  logout: makeRouteHandler(authController.logout, { authenticate: true, accepted: ['delete'] }),


  /** Not found that takes any unset handlers */
  notFound: function(ctx, callback) {
    callback(404, { err: NOT_FOUND.message});
  },
};

// module.exports = routes
