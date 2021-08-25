// eslint-disable-next-line no-undef
const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-undef
const jwt = require('jsonwebtoken');

// eslint-disable-next-line no-undef
const NotFoundError = require('../errors/not-found-error');
// eslint-disable-next-line no-undef
const BadRequestError = require('../errors/bad-request-error');
// eslint-disable-next-line no-undef
const ConflictError = require('../errors/conflict-error');
// eslint-disable-next-line no-undef
const User = require('../models/user');

// eslint-disable-next-line no-undef
module.exports.getUsers = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка сервера');
      }
      return next(err);
    })
    .catch(next);
};
// eslint-disable-next-line no-undef
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой пользователь уже создан');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => res.status(200).send({
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Ошибка сервера');
        }
        return next(err);
      }))
    .catch(next);
};
// eslint-disable-next-line no-undef
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};
// eslint-disable-next-line no-undef
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (!name || !email) {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};

