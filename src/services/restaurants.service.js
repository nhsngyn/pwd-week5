// src/services/restaurants.service.js
const path = require('path');
const { readFileSync } = require('fs');
const Restaurant = require('../models/restaurant.model');

async function getAllRestaurants() {
  const docs = await Restaurant.find({});
  // .map(doc => doc.toObject())를 추가하여 각 문서에 transform을 적용합니다.
  return docs.map(doc => doc.toObject());
}

async function getRestaurantById(id) {
  const doc = await Restaurant.findById(id);
  // 문서가 존재하면 toObject()를 호출하고, 없으면 null을 반환합니다.
  return doc ? doc.toObject() : null;
}

async function createRestaurant(payload) {
  const doc = await Restaurant.create(payload);
  return doc.toObject();
}

async function updateRestaurant(id, payload) {
  const updated = await Restaurant.findByIdAndUpdate(id, payload, {
    new: true, // 업데이트된 후의 문서를 반환
    runValidators: true, // 스키마 유효성 검사 실행
  });
  return updated ? updated.toObject() : null;
}

async function deleteRestaurant(id) {
  const deleted = await Restaurant.findByIdAndDelete(id);
  return deleted ? deleted.toObject() : null;
}

async function getPopularRestaurants(limit = 5) {
  const docs = await Restaurant.find({}).sort({ rating: -1 }).limit(limit);
  return docs.map((doc) => doc.toObject());
}

// ----- 아래 함수들은 데이터베이스 객체를 직접 반환하지 않으므로 수정할 필요가 없습니다. -----

function getAllRestaurantsSync() {
  const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
  const raw = readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function resetStore() {
  const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
  const raw = readFileSync(DATA_PATH, 'utf8');
  const seed = JSON.parse(raw);
  await Restaurant.deleteMany({});
  await Restaurant.insertMany(seed);
}

async function ensureSeededOnce() {
  const count = await Restaurant.estimatedDocumentCount();
  if (count > 0) return { seeded: false, count };
  const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
  const raw = readFileSync(DATA_PATH, 'utf8');
  const seed = JSON.parse(raw);
  await Restaurant.insertMany(seed);
  return { seeded: true, count: seed.length };
}

module.exports = {
  getAllRestaurants,
  getAllRestaurantsSync,
  getRestaurantById,
  getPopularRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  resetStore,
  ensureSeededOnce,
};
