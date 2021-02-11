module.exports = {
  create(error) {
    return process.env.NODE_ENV === 'production' ? this.UNEXPECTED : error;
  },
  UNEXPECTED: {
    message: 'Unexpected Error',
    name: 'UnexpectedErr',
  },

  NOT_FOUND: {
    message: 'Not Found!',
    name: 'NotFoundErr',

  },
  HTTP_METHOD_ERR: {
    message: 'Bad request, method unaccepted!',
    name: 'MethodUnacceptedErr',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized!',
    name: 'UnauthroizedErr',
  },
};
