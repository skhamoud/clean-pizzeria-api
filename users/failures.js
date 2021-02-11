module.exports = {
  TOKEN: {
    INVALID_FIELDS: {
      message: 'Invalid Token Fields',
      name: 'TokenInvalidFieldsErr',
    },
    EXPIRED: {
      message: 'Tokend already expired',
      name: 'TokenAlreadyExpiredErr'
    },
    TOKENOTFOUND: {
      message: 'Token not found',
      name: 'TokenNotFoundErr',
    },
  },

  AUTH: {
    INVALID_CREDENTIALS: {
      message: 'Invalid credentials',
      name: 'AuthInvalidCredentialsErr',
    },
    USER_NOT_FOUND: {
      message: 'User Not Found',
      name: 'AuthUserNotFoundErr',
    },
    UNAUTHENTICATED: {
      message: 'Unauthenticated',
      name: 'AuthUnauthenticatedErr',
    },
    INVALID_FIELDS: {
      message: 'Invalid User Fields',
      name: 'UserInvalidFieldsErr',
    },
    EMAIL_TAKEN: {
      message: 'That email is already taken!',
      name: "AuthEmailTaken"
    }
  },
};
