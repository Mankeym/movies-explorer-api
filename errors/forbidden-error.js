class NoAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

// eslint-disable-next-line no-undef
module.exports = NoAccessError;
