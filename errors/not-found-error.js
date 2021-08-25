class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

// eslint-disable-next-line no-undef
module.exports = NotFoundError;
