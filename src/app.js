// src/app.js
const express = require('express');
const cors = require('cors');
const restaurantsRouter = require('./routes/restaurants.routes.js');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

// 기본 경로(루트 경로)에 대한 라우터 추가
app.get('/', (req, res) => {
  res.send('Welcome to the PWD Week 4 Restaurant API!');
});

// 기존 헬스 체크 라우터
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

  app.use('/api/restaurants', restaurantsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
