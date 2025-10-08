// src/services/restaurants.service.js
const Restaurant = require('../models/restaurant.model');

async function getAllRestaurants() {
  const docs = await Restaurant.find({});
  return docs.map((doc) => doc.toObject());
}

async function getRestaurantById(id) {
  const doc = await Restaurant.findById(id);
  return doc ? doc.toObject() : null;
}

async function createRestaurant(payload) {
  const doc = await Restaurant.create(payload);
  return doc.toObject();
}

async function updateRestaurant(id, payload) {
  const updated = await Restaurant.findByIdAndUpdate(id, payload, { new: true });
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

// module.exports 부분은 기존 코드와 동일하게 유지
module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getPopularRestaurants,
  // ... 등등 다른 export가 있다면 유지
};