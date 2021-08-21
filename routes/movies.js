const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCard, likeCard, dislikeCard, createCard,
} = require('../controllers/movies');


moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', createMovie);

moviesRouter.delete('/movies/:movieId', deleteMovie);




/**moviesRouter.get('/', getCards);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }),
}), createCard);
moviesRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);
moviesRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);
moviesRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);*/
module.exports = moviesRouter;
