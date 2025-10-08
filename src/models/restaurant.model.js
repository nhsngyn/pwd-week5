// src/models/restaurant.model.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    location: { type: String, required: true },
    priceRange: { type: String, default: '정보 없음' },
    rating: { type: Number, default: 0 },
    description: { type: String, default: '' },
    recommendedMenu: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    image: { type: String, default: '' }
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      virtuals: true, // virtual 필드를 포함시키기 위해 true로 설정
      transform: (_doc, ret) => {
        ret.id = ret._id; // _id를 id로 복사
        delete ret._id;   // 원본 _id는 삭제
        return ret;
      },
    },
    toJSON: {
     virtuals: true, // virtual 필드를 포함시키기 위해 true로 설정
      transform: (_doc, ret) => {
        ret.id = ret._id; // _id를 id로 복사
        delete ret._id;   // 원본 _id는 삭제
        return ret;
      },
    }
  }
);

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);