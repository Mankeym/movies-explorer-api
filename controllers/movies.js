const Card = require('../models/card');
const NoAccessError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new NoAccessError('Невозможно удалить чужую карточку'));
      }
      Card.deleteOne({ _id: card._id })
        .then(() => {
          res.status(200).send({ card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные.');
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch(next);
};
