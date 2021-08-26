// eslint-disable-next-line no-undef
const Movie = require('../models/movie');
// eslint-disable-next-line no-undef
const NotFoundError = require('../errors/not-found-error');
// eslint-disable-next-line no-undef
const BadRequestError = require('../errors/bad-request-error');

// eslint-disable-next-line no-undef
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

// eslint-disable-next-line no-undef
module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user._id;
  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner })
    // eslint-disable-next-line no-unused-vars
    .then((movie) => res.status(200).send({
      country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    })
    .catch(next);
};

// eslint-disable-next-line no-undef
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с указанным _id не найдена.');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new BadRequestError('Переданы некорректные данные.');
      }

      Movie.findByIdAndDelete(req.params.movieId).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch(next);
};
