const mongoose = require('mongoose');
const boardSchema = new mongoose.Schema({
  boardId: { type: String, unique: true, required: true },
  password: { type: String, required: false, default: '' }, // 允许无密码
  lastAccess: { type: Date, default: Date.now } // 新增字段
});
module.exports = mongoose.model('Board', boardSchema);
