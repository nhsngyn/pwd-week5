// src/services/submissions.service.js
const Submission = require('../models/submission.model');

async function listSubmissions(status) {
  const filter = status ? { status } : {};
  const docs = await Submission.find(filter).sort({ createdAt: -1 });
  // 각 문서에 transform을 적용하여 'id' 필드를 갖게 합니다.
  return docs.map((doc) => doc.toObject());
}

async function getSubmissionById(id) {
  const doc = await Submission.findById(id);
  // 문서가 존재하면 toObject()를 호출하고, 없으면 null을 반환합니다.
  return doc ? doc.toObject() : null;
}

async function createSubmission(payload) {
  const doc = await Submission.create(payload);
  return doc.toObject();
}

async function updateSubmission(id, payload) {
  const updated = await Submission.findByIdAndUpdate(id, payload, {
    new: true, // 업데이트된 후의 문서를 반환
    runValidators: true, // 스키마 유효성 검사 실행
  });
  return updated ? updated.toObject() : null;
}

async function deleteSubmission(id) {
  const deleted = await Submission.findByIdAndDelete(id);
  return deleted ? deleted.toObject() : null;
}

module.exports = {
  listSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
};
