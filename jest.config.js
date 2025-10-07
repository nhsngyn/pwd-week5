// jest.config.js

module.exports = {
  // 이 설정은 Jest가 테스트를 시작하기 전에 .env 파일을 먼저 읽어오게 합니다.
  setupFiles: ['dotenv/config'],
};