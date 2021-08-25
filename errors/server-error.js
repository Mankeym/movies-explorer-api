class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

// eslint-disable-next-line no-undef
module.exports = ServerError;
