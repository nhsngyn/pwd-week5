// tests/restaurants.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const Restaurant = require('../src/models/restaurant.model');
const createApp = require('../src/app');

describe('Restaurant routes', () => {
  let app;

  // 1. 모든 테스트 시작 전 DB에 연결하고 앱을 생성합니다.
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    app = createApp();
  });

  // 2. 각 테스트가 끝난 후 DB를 깨끗하게 비웁니다.
  afterEach(async () => {
    await Restaurant.deleteMany({});
  });

  // 3. 모든 테스트가 끝난 후 DB 연결을 끊습니다.
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/restaurants returns a list', async () => {
    // given: 테스트를 위한 데이터를 먼저 생성
    await Restaurant.create({
      name: '테스트 식당',
      category: '한식',
      location: '테스트 위치',
      rating: 5,
    });

    // when: API를 호출
    const response = await request(app).get('/api/restaurants');

    // then: 결과를 검증
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe('테스트 식당');
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    // given
    const newRestaurant = await Restaurant.create({
      name: 'ID 조회용 식당',
      category: '일식',
      location: '테스트 위치',
      rating: 4,
    });
    const restaurantId = newRestaurant._id;

    // when
    const response = await request(app).get(`/api/restaurants/${restaurantId}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('ID 조회용 식당');
    expect(response.body.data._id).toBe(restaurantId.toString());
  });

  test('GET /api/restaurants/:id handles missing items', async () => {
    // given: 존재하지 않는 유효한 형식의 ID
    const nonExistentId = new mongoose.Types.ObjectId();

    // when
    const response = await request(app).get(`/api/restaurants/${nonExistentId}`);

    // then
    expect(response.status).toBe(404);
    expect(response.body.error.message).toContain('not found');
  });

  test('POST /api/restaurants creates a restaurant', async () => {
    // given
    const payload = {
      name: '새로운 식당',
      category: '카페',
      location: '캠퍼스 타운',
      rating: 5,
    };

    // when
    const response = await request(app)
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    // then: 응답을 검증
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.id).toBeDefined();

    // then: 실제로 DB에 데이터가 들어갔는지 한 번 더 검증
    const allRestaurants = await Restaurant.find({});
    expect(allRestaurants.length).toBe(1);
    expect(allRestaurants[0].name).toBe(payload.name);
  });

  test('POST /api/restaurants validates payload for missing fields', async () => {
    // given: 필수 필드인 'category'가 누락된 데이터
    const payload = {
      name: '잘못된 식당',
      location: '캠퍼스 타운',
      rating: 3,
    };

    // when
    const response = await request(app)
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    // then
    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('category');
  });
});
