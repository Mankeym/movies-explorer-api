const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

// eslint-disable-next-line import/no-dynamic-require

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};
module.exports.findUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(200).send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else if (err.name === 'MongoError') {
        throw new ConflictError('Ошибка базы данных');
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (!name || !about) {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};
module.exports.getInfoProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.status(200).send({ name: user.name, about: user.about });
    })
    .catch(next);
};
