class NoAuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

// eslint-disable-next-line no-undef
module.exports = NoAuthorizationError;
