// tests/restaurants.service.test.js

// 1. (추가) mongoose와 Restaurant 모델을 불러옵니다.
const mongoose = require('mongoose');
const Restaurant = require('../src/models/restaurant.model'); // 👈 실제 모델 파일 경로를 확인하세요.
const restaurantService = require('../src/services/restaurants.service');

describe('RestaurantService', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    await Restaurant.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('getAllRestaurants resolves with data', async () => {
    // 2. (추가) 테스트를 위해 데이터를 먼저 생성합니다 (Arrange)
    await Restaurant.create({
      name: '임시 식당',
      category: '한식',
      location: '테스트 캠퍼스',
      rating: 5,
    });

    const restaurants = await restaurantService.getAllRestaurants(); // (Act)
    expect(Array.isArray(restaurants)).toBe(true); // (Assert)
    expect(restaurants.length).toBeGreaterThan(0); // (Assert)
  });

  test('getAllRestaurantsSync returns data immediately', () => {
    // 2. (추가) 동기 테스트도 마찬가지로 데이터를 먼저 생성해야 합니다.
    // 서비스 로직에 따라 이 부분은 Mongoose 모델을 사용하지 않을 수 있으나,
    // 일관성을 위해 DB에 데이터를 생성하는 방식을 따릅니다.
    // 만약 getAllRestaurantsSync가 DB와 무관하다면 이 부분은 다를 수 있습니다.
    restaurantService.createRestaurant({
      name: '임시 동기 식당',
      category: '중식',
      location: '테스트 캠퍼스',
      rating: 4,
    });

    const restaurants = restaurantService.getAllRestaurantsSync();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  test('createRestaurant appends a new entry', async () => {
    const payload = {
      name: '테스트 식당',
      category: '테스트',
      location: '가상 캠퍼스',
      rating: 4.5,
    };

    const created = await restaurantService.createRestaurant(payload);
    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);

    const all = await restaurantService.getAllRestaurants();
    const found = all.find((item) => item.id === created.id);
    expect(found).toBeTruthy();
  });

  test('createRestaurant rejects invalid payloads', async () => {
    await expect(
      restaurantService.createRestaurant({ name: '누락된 식당' })
    ).rejects.toThrow("'category' is required");
  });
});
