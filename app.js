// eslint-disable-next-line no-undef
const express = require('express');
// eslint-disable-next-line no-undef
const mongoose = require('mongoose');
// eslint-disable-next-line no-undef
const { celebrate, Joi, errors } = require('celebrate');

// eslint-disable-next-line no-undef
const bodyParser = require('body-parser');
// eslint-disable-next-line no-undef
const userRouter = require('./routes/users');
// eslint-disable-next-line no-undef
const movieRouter = require('./routes/movies');
// eslint-disable-next-line no-undef
const { login, createUser } = require('./controllers/users');

// eslint-disable-next-line no-undef
const { PORT = 3020 } = process.env;
const app = express();
// eslint-disable-next-line no-undef
const auth = require('./middlewares/auth');
// eslint-disable-next-line no-undef
const errorHandler = require('./middlewares/errorHadler');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use('/', userRouter);
app.use('/', movieRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер:');
});
