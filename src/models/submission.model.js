// src/models/submission.model.js
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    location: { type: String, required: true },
    priceRange: { type: String, default: '' },
    recommendedMenu: { type: [String], default: [] },
    review: { type: String, default: '' },
    submitterName: { type: String, default: '' },
    submitterEmail: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
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

module.exports = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);