// eslint-disable-next-line no-unused-vars,no-undef
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line no-undef
const userRouter = require('express').Router();
// eslint-disable-next-line no-undef
const { getUsers, updateProfile, } = require('../controllers/users');



userRouter.get('/users/me', getUsers);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
// eslint-disable-next-line no-undef
module.exports = userRouter;
