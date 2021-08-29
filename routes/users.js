const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { getUsers, updateProfile } = require('../controllers/users');

userRouter.get('/users/me', getUsers);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

module.exports = userRouter;
