// eslint-disable-next-line no-unused-vars,no-undef
const { isEmail, isURL } = require('validator');
// eslint-disable-next-line no-undef
const mongoose = require('mongoose');
// eslint-disable-next-line no-undef
const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-undef
const NoAuthorizationError = require('../errors/no-authorization');

const { Schema } = mongoose;

const User = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
User.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoAuthorizationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthorizationError('Неправильные почта или пароль');
          }
          return user; // теперь user доступен
        });
    });
};

// eslint-disable-next-line no-undef
module.exports = mongoose.model('user', User);
