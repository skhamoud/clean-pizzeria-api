// Http requests lib .
const { request } = require('https');
const queryString = require('querystring');
const debug = require('util').debuglog('hit')
const {colors} = require('../lib/shellColors')

/** Hits the endpoint provided, takes the passed options object and has some defaults
 * @param {String} url
 * @param {{}} options
 */
function hit(url, options = {}) {
  let { method, headers = {}, body, ...restOfOptions } = options;

  if (!url.startsWith('http')) url = 'https://' + url;

  const _options = {
    method: method || 'GET', // defaults to get
    headers: {
      ...headers,
      'content-type': headers['content-type'] || 'application/x-www-form-urlencoded',
    },
    ...restOfOptions,
  };

  // auto prepare for body requests
  if (_options.headers['content-type'].includes('json')) body = JSON.stringify(body);
  if (_options.headers['content-type'].includes('x-www-form-urlencoded')) body = queryString.stringify(body);
  
  return new Promise((resolve, reject) => {
    const req = request(url, _options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // set statuscode and statusMessage
        const statusCode = res.statusCode;
        const statusMessage = res.statusMessage;

        const responseObject = { statusCode, statusMessage, headers: res.headers };
        if (res.complete) {
          // return it as normal json if relevant and
          if (res.headers['content-type'].includes('json')) {
            try {
              data = JSON.parse(data);
            } catch (error) {
              // invalid json from endpoint
              reject({ data: { error: 'Endpoint states type to be JSON, but returned invalid data' } });
            }
          }

          debug(colors.cyan, 'Hit an external service with\n ' + JSON.stringify({url, ..._options, body},null,1))
          debug(colors.cyan,JSON.stringify( {...responseObject, data}, null, 1))
          if (statusCode >= 400) {
            // failed
            reject({ ...responseObject, data });
          } else {
            // successful
            resolve({ ...responseObject, data });
          }
        } else {
          const error = 'The connection terminated with an incomplete message';
          reject({ data: { error } });
        }
      });
    });

    req.on('error', (error) => {
       reject({error});
      //  reject({error: 'Something is wrong with the endpoint or the network'});
    });

    req.write(body);
    req.end();
  });
}

module.exports = exports = hit;

exports.get = function get(url) {
  return hit(url);
};

exports.post = function post(url, options) {
  return hit(url, { method: 'POST', ...options });
};
