const { HTTP_METHOD_ERR , UNAUTHORIZED} = require('../core/failures');
const tokenRepo = require('../users/tokenRepo');
const userRepo = require('../users/userRepo');

/** Creates a route handler
 * @param { Object | Function} handler the handler function or an object that maps handlers to http methods
 * @param {String | Array} accepted the accepted http methods
 */
function makeRouteHandler(handler, { authenticate = false, accepted }) {
  const handlerIsGroup = typeof handler == 'object';
  const handlerIsFunction = typeof handler == 'function';

  if (!handlerIsGroup && !handlerIsFunction) {
    throw Error(`Route Hanlder not found, must be a function or an object with http methods names mapped to handers.
    This is most likely a case of passing an non existent route handler in the router file.`);
  }

  // default to accept all methods for resource handlers and 'get' for normal handlers
  // if none were specified
  accepted = accepted === undefined ? (handlerIsGroup ? ['get', 'post', 'get', 'put', 'delete'] : 'get') : accepted;

  return routeHandler;

  async function routeHandler(ctx, sendResponse) {
    // check method is accepted
    if (
      (typeof accepted == 'string' && accepted != ctx.method) ||
      (Array.isArray(accepted) && !accepted.includes(ctx.method))
    ) {
      sendResponse(405, { err: HTTP_METHOD_ERR.message });
      return;
    }
    let _handle
    // check if the handler passed is a Resource handler
    if (handlerIsGroup) {
      const groupMethodHandler = handler[ctx.method];

      // Make sure that the http method specific handler for this resource was defined on the group handler
      if (!groupMethodHandler) {
        sendResponse(405, { err: HTTP_METHOD_ERR.message });
        return;
      }

      _handle = groupMethodHandler;
    } else 
    _handle = handler

    // handle authenticating in routes that specify needing auth
    // append the auth to ctx for route handlers to have access to it
    // and short circuit if not authenticated

    if (authenticate ) {
      const auth = await authenticateRequest(ctx, sendResponse);
      ctx.auth = auth;
      // short circuit if not authenticated
      if(!auth) return
    }

    _handle(ctx, sendResponse);
  }
}

// TODO Use the entitty to validate the data
async function authenticateRequest(ctx, sendResponse) {
  const { headers } = ctx;
  const token = headers.authorization && getToken(headers.authorization);
  if (!token) {
    sendUnauthorized(sendResponse);
    return;
  }
  try {
    const tokenData = await tokenRepo.getTokenById(token);
    if (tokenData && tokenData.expires > Date.now()) {
      const user = await userRepo.getUser( tokenData.userId);
      if (user) {
        delete user.hashedPassword
        return {
          token: tokenData.id,
          ...user,
        };
      } else sendUnauthorized(sendResponse);
    } else {
      sendUnauthorized(sendResponse);
    }
  } catch (error) {
    // TODO properly handle this onFD
    sendUnauthorized(sendResponse);
  }
}

function sendUnauthorized(cb) {
  cb(403, { err: UNAUTHORIZED.message });
}

function getToken(authHeader) {
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
}

module.exports = {
  makeRouteHandler,
};
