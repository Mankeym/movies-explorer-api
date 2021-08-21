// eslint-disable-next-line no-unused-vars
const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getUsers, findUser, updateProfile, updateAvatar, getInfoProfile,
// eslint-disable-next-line import/no-dynamic-require
} = require('../controllers/users');

userRouter.get('/users/me', getUsers);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
/**
userRouter.get('/', getUsers);
userRouter.get('/me', getInfoProfile);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), findUser);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-/]))?/),
  }),
}), updateAvatar);*/
module.exports = userRouter;
