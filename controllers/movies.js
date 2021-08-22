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
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user._id;
  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner })
    .then((movie) => res.status(200).send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    })
    .catch(next);
};
/**
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .orFail(new Error('NotValidId'))
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(new NoAccessError('Невозможно удалить чужую карточку'));
      }
      movie.deleteOne({ _id: movie._id })
        .then(() => {
          res.status(200).send({ movie });
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
 */
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new BadRequestError('Переданы некорректные данные.');
      }

      Movie.findByIdAndDelete(req.params.movieId).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch(next);
};
