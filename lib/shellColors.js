// Colors reference
// You can use the following as so:
// console.log(colorCode, data);
// console.log(`${colorCode}some colorful text string${resetCode} rest of string in normal color`);
//
// ... and so on.

const escapes = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  BGblack: '\x1b[40m',
  BGred: '\x1b[41m',
  BGgreen: '\x1b[42m',
  BGyellow: '\x1b[43m',
  BGblue: '\x1b[44m',
  BGmagenta: '\x1b[45m',
  BGcyan: '\x1b[46m',
  BGwhite: '\x1b[47m',
};


exports.escapeChars = escapes

/** used in printF like loggers the string after it will take the color */
exports.colors = {
  black : _makeFprintCol('black'),
  red : _makeFprintCol('red'),
  green : _makeFprintCol('green'),
  yellow : _makeFprintCol('yellow'),
  blue : _makeFprintCol('blue'),
  magenta : _makeFprintCol('magenta'),
  cyan : _makeFprintCol('cyan'),
  white : _makeFprintCol('white'),
}

function _makeFprintCol(col) {
  return escapes[col] + '%s' + escapes.reset
}