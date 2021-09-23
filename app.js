const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const authRouter = require('./routes/auth');

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
const { PORT = 3050 } = process.env;

const allowedCors = [
  'http://diplom.prakticum.api.nomoredomains.club',
  'https://diplom.prakticum.api.nomoredomains.club',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', '*');
  }
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
});
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
