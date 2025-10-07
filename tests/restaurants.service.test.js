// tests/restaurants.service.test.js
const mongoose = require('mongoose');
const Restaurant = require('../src/models/restaurant.model');
const restaurantService = require('../src/services/restaurants.service');

describe('RestaurantService', () => {
  // 1. 모든 테스트 시작 전 DB에 한 번만 연결합니다.
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  // 2. 각 테스트가 끝난 후 DB를 깨끗하게 비웁니다.
  afterEach(async () => {
    await Restaurant.deleteMany({});
  });

  // 3. 모든 테스트가 끝난 후 DB 연결을 끊습니다.
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('getAllRestaurants resolves with data', async () => {
    // given: 이 테스트를 위한 데이터를 생성합니다.
    await Restaurant.create({
      name: '임시 식당',
      category: '한식',
      location: '테스트 캠퍼스',
      rating: 5,
    });

    // when: 서비스 함수를 호출합니다.
    const restaurants = await restaurantService.getAllRestaurants();

    // then: 결과를 검증합니다.
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBe(1);
  });

  test('createRestaurant appends a new entry', async () => {
    const payload = {
      name: '테스트 식당',
      category: '테스트',
      location: '가상 캠퍼스',
      rating: 4.5,
    };

    const created = await restaurantService.createRestaurant(payload);

    // 스키마의 transform 옵션에 따라, 반환된 객체는 'id' 필드를 갖습니다.
    expect(created.id).toBeDefined(); // 👈 .id 확인
    expect(created.name).toBe(payload.name);

    const all = await restaurantService.getAllRestaurants();

    // all 배열에 있는 객체들도 모두 'id' 필드를 갖습니다.
    const found = all.find((item) => item.id === created.id); // 👈 .id로 비교
    expect(found).toBeTruthy();
  });

  test('createRestaurant rejects invalid payloads', async () => {
    // Mongoose가 반환하는 실제 에러 메시지에 더 가깝게 수정합니다.
    await expect(
      restaurantService.createRestaurant({ name: '누락된 식당' })
    ).rejects.toThrow('Restaurant validation failed: category: Path `category` is required.');
  });
});
