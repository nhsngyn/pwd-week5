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
    server = app.listen(4004); // 테스트용 포트
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
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const newRestaurant = await Restaurant.create({
      name: 'ID 조회용 식당',
      category: '일식',
      location: '테스트 위치',
      rating: 4,
    });
    const restaurantId = newRestaurant._id; // DB 객체에서 _id를 가져옴

    const response = await request(app).get(`/api/restaurants/${restaurantId}`);

    expect(response.status).toBe(200);
    // API 응답에서는 id로 변환되었는지 확인
    expect(response.body.data.id).toBe(restaurantId.toString());
  });
});
