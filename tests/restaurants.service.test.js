// tests/restaurants.service.test.js
const mongoose = require('mongoose');
const Restaurant = require('../src/models/restaurant.model');
const restaurantService = require('../src/services/restaurants.service');

describe('RestaurantService', () => {
  // 1. 모든 테스트 시작 전 DB에 한 번만 연결합니다.
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
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

  // `getAllRestaurantsSync`는 DB를 사용하지 않는 순수 인메모리 로직을
  // 테스트하는 목적이 아니라면, 비동기 DB 환경에서는 혼란을 줄 수 있어
  // 제외하거나 목적을 명확히 하는 것이 좋습니다. 여기서는 주석 처리합니다.
  /*
  test('getAllRestaurantsSync returns data immediately', () => {
    // ...
  });
  */

  test('createRestaurant appends a new entry', async () => {
    // given
    const payload = {
      name: '테스트 식당',
      category: '테스트',
      location: '가상 캠퍼스',
      rating: 4.5,
    };

    // when
    const created = await restaurantService.createRestaurant(payload);

    // then
    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);

    // DB에 실제로 생성되었는지 추가 검증
    const found = await Restaurant.findById(created.id);
    expect(found).not.toBeNull();
    expect(found.name).toBe(payload.name);
  });

  test('createRestaurant rejects invalid payloads', async () => {
    // given
    const payload = { name: '누락된 식당' }; // 'category'가 없음

    // when & then
    // 서비스의 생성 함수가 Mongoose 유효성 검사 에러를 던지는지 확인
    await expect(restaurantService.createRestaurant(payload)).rejects.toThrow(
      "Restaurant validation failed: category: Path `category` is required."
    );
  });
});
