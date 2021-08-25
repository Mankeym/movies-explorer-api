class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

// eslint-disable-next-line no-undef
module.exports = ConflictError;
