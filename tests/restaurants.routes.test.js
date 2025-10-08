// tests/restaurants.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const Restaurant = require('../src/models/restaurant.model');
const createApp = require('../src/app');

describe('Restaurant routes', () => {
  let app;
  let server;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    app = createApp();
    server = app.listen(4003); // 다른 테스트와 겹치지 않는 포트
  });

  afterEach(async () => {
    await Restaurant.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('POST /api/restaurants creates a restaurant', async () => {
    const payload = {
      name: '새로운 식당',
      category: '카페',
      location: '캠퍼스 타운',
      rating: 5,
    };

    const response = await request(app)
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.id).toBeDefined();
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const newRestaurant = await Restaurant.create({
      name: 'ID 조회용 식당',
      category: '일식',
      location: '테스트 위치',
      rating: 4,
    });
    const restaurantId = newRestaurant._id;

    const response = await request(app).get(`/api/restaurants/${restaurantId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(restaurantId.toString());
  });
  
  // sync-demo, 숫자 ID 기반 테스트 등은 현재 로직과 맞지 않으므로 삭제합니다.
});
