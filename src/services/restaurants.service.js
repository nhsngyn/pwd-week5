// src/services/restaurants.service.js
const path = require('path');
const { readFileSync } = require('fs');
const Restaurant = require('../models/restaurant.model');

// getNextRestaurantId 함수는 더 이상 필요 없으므로 삭제합니다.

async function getAllRestaurants() {
  // .lean()은 Mongoose Document를 순수 자바스크립트 객체로 변환해 성능을 향상시킵니다.
  // toObject()나 toJSON()을 호출할 필요가 없어집니다.
  const docs = await Restaurant.find({}).lean();
  return docs;
}

async function getRestaurantById(id) {
  // Mongoose의 내장 함수인 findById를 사용합니다.
  const doc = await Restaurant.findById(id).lean();
  return doc || null;
}

// createRestaurant 함수를 Mongoose 표준 방식으로 수정합니다.
async function createRestaurant(payload) {
  const doc = await Restaurant.create(payload);
  // .lean()을 사용하지 않았으므로, toObject()를 호출해 transform 옵션을 적용합니다.
  return doc.toObject();
}

async function updateRestaurant(id, payload) {
  // Mongoose의 내장 함수인 findByIdAndUpdate를 사용합니다.
  const updated = await Restaurant.findByIdAndUpdate(id, payload, {
    new: true, // 업데이트된 후의 문서를 반환
    runValidators: true, // 스키마 유효성 검사 실행
  }).lean();
  return updated;
}

async function deleteRestaurant(id) {
  // Mongoose의 내장 함수인 findByIdAndDelete를 사용합니다.
  const deleted = await Restaurant.findByIdAndDelete(id).lean();
  return deleted;
}

// ----- 아래 함수들은 수정할 필요가 없습니다. -----

function getAllRestaurantsSync() {
  const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
  const raw = readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function getPopularRestaurants(limit = 5) {
  const docs = await Restaurant.find({}).sort({ rating: -1 }).limit(limit).lean();
  return docs;
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
