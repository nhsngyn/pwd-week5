// src/models/restaurant.model.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema(
  {
    // Mongoose는 데이터를 생성할 때 자동으로 고유한 _id 필드를 만들어줍니다. 
    // 따라서 사용자가 직접 id를 스키마에 추가하고 필수로 설정하면, 
    // id 값을 주지 않고 데이터를 만들려고 할 때마다 유효성 검사 오류가 발생합니다.
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