const jwt = require('jsonwebtoken');
const NoAuthorizationError = require('../errors/no-authorization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send(new NoAuthorizationError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send(new NoAuthorizationError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
