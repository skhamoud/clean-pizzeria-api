const http = require('http');
const path = require('path');
const https = require('https');
const debug = require('util').debuglog('server');
const { URL, URLSearchParams } = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const routes = require('./endpoints');
const { jsonParser } = require('../lib/helpers');
const config = require('../config');
const { colors, escapeChars } = require('../lib/shellColors');


const { httpPort, httpsPort } = config;

const httpServer = http.createServer(serversHandler);

// Setup https server
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, './httpsCert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './httpsCert/cert.pem')),
};
const httpsServer = https.createServer(httpsOptions, function (req, res) {
  serversHandler(req, res, 'https');
});

/**  Initialize the server */
function init() {
  httpsServer.listen(httpsPort, function () {
    console.log(escapeChars.reverse + colors.cyan, `HTTPS Server now listening on port ${httpsPort}...`);
  });

  httpServer.listen(httpPort, function () {
    console.log(escapeChars.reverse + colors.cyan,`HTTP Server now listening on port ${httpPort}...`);
  });
}

/** Handles the meat of server logic
 * @type {import('http').RequestListener}
 */
function serversHandler(req, res, protocol = 'http') {
  // Get url and parse it
  const parsedUrl = new URL(req.url, `${protocol}://localhost:${config[protocol + 'Port']}`);

  // Get the path, trimmed down from starting and ending slashes
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  // get the query params object
  const query = new URLSearchParams(parsedUrl.searchParams);

  // parse the method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload if any
  const decoder = new StringDecoder('utf-8');
  let reqPayload = '';

  req.on('data', function (chunk) {
    reqPayload += decoder.write(chunk);
  });

  req.on('end', () => {
    reqPayload += decoder.end();

    const context = {
      path,
      method,
      headers,
      query,
      body: jsonParser(reqPayload),
      auth: null,
    };
    /**
     * @param {Number} statusCode the status code
     * @param {object} payload payload of the response
     */
    function responsCallback(statusCode, payload) {
      // setup the status codes and Send the response
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      payload = typeof payload === 'object' ? payload : {};
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      debug(statusCode < 400 ? colors.green : colors.red , `/${path} ${statusCode} => `, payload);
      res.end(JSON.stringify(payload));
    }
    // figure out the handler
    const routeHandler = routes[path] ? routes[path] : routes.notFound;

    // route the request to handler
    routeHandler(context, responsCallback);
  });
}

module.exports = {
  init,
  httpServer,
  httpsServer,
  // serversHandler
};
