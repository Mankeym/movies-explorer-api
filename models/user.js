const { isEmail } = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

User.statics.findUserByCredentials = function findUser(email, password) {
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
module.exports = mongoose.model('user', User);
