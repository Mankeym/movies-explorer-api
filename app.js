const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const authRouter = require('./routes/auth');

const { PORT = 3050 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHadler');
const { errorLogger, requestLogger } = require('./middlewares/logger');

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const options = {
  origin: [
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

app.use('*', cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/', authRouter);

app.use(auth);
app.use('/', userRouter);
app.use('/', movieRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
