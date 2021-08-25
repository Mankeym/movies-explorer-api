class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

// eslint-disable-next-line no-undef
module.exports = BadRequestError;
