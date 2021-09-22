const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');

const BadRequestError = require('../errors/bad-request-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = new mongoose.Types.ObjectId(req.user._id);
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then(() => res.status(200).send({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с указанным _id не найдена.');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new BadRequestError('Переданы некорректные данные.');
      }

      Movie.findByIdAndDelete(req.params.movieId).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch((err) => {
          if (err.kind === 'ObjectId') {
            next(new BadRequestError('Невалидный id'));
          }
          return next(err);
        });
    });
};
