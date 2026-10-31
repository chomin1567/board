const fs = require('fs');
const FILE = './data.json';

// 파일에서 데이터 읽기 (없으면 빈 데이터)
function load() {
  if (!fs.existsSync(FILE)) return { users: [], posts: [] };
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

// 데이터를 파일에 저장
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = { load, save }; 