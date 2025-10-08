// src/controllers/submissions.controller.js
const submissionsService = require('../services/submissions.service');
const asyncHandler = require('../utils/asyncHandler');

const normaliseMenu = (menu) => {
  if (!menu) return [];
  if (Array.isArray(menu)) return menu;
  if (typeof menu === 'string') {
    return menu.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

exports.list = asyncHandler(async (req, res) => {
  const items = await submissionsService.listSubmissions(req.query.status);
  res.json({ data: items });
});

exports.get = asyncHandler(async (req, res) => {
  const item = await submissionsService.getSubmissionById(req.params.id);
  if (!item) return res.status(404).json({ error: { message: 'Submission not found' } });
  res.json({ data: item });
});

// --- create 함수 수정 ---
exports.create = asyncHandler(async (req, res) => {
  // 1. 디버깅 로그: 컨트롤러 시작 및 원본 데이터 확인
  console.log("--- SUBMISSION CREATE 컨트롤러 시작 ---");
  console.log("서버가 프론트엔드로부터 받은 데이터 (req.body):", req.body);

  // 2. 필드명 불일치 문제 해결
  const payload = {
    // FIX 1: req.body.restaurantName -> req.body.name
    restaurantName: req.body.name, 
    category: req.body.category,
    // FIX 2: req.body.location -> req.body.address
    location: req.body.address,
    priceRange: req.body.priceRange ?? '',
    // FIX 3: req.body.recommendedMenu -> req.body.menu
    recommendedMenu: normaliseMenu(req.body.menu),
    review: req.body.review ?? '',
    submitterName: req.body.submitterName ?? '',
    submitterEmail: req.body.submitterEmail ?? '',
    status: 'pending',
  };
  
  // 3. 디버깅 로그: DB로 보낼 최종 데이터 확인
  console.log("DB로 전송할 최종 데이터 (payload):", payload);
  
  try {
    const created = await submissionsService.createSubmission(payload);
    console.log("DB 저장 성공!");
    res.status(201).json({ data: created });
  } catch (error) {
    // 4. 에러 발생 시 상세 내용 출력
    console.error("!!! DB 저장 중 에러 발생 !!!", error);
    res.status(500).send({ message: "서버 내부 오류", error: error.message });
  }
});

// --- (update, remove 함수는 생략) ---
exports.update = asyncHandler(async (req, res) => {
  // ... (만약 업데이트 기능도 사용한다면 이 부분도 위와 같이 수정해야 합니다)
  const payload = {
    restaurantName: req.body.name,
    category: req.body.category,
    location: req.body.address,
    // ...
  };
  const updated = await submissionsService.updateSubmission(req.params.id, payload);
  if (!updated) return res.status(404).json({ error: { message: 'Submission not found' } });
  res.json({ data: updated });
});

exports.remove = asyncHandler(async (req, res) => {
  const deleted = await submissionsService.deleteSubmission(req.params.id);
  if (!deleted) return res.status(404).json({ error: { message: 'Submission not found' } });
  res.status(204).send();
});
