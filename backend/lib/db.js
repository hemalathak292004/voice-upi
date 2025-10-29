const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    console.error('Failed to read DB:', e);
    return {};
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write DB:', e);
  }
}

module.exports = { readDB, writeDB, DB_PATH };
