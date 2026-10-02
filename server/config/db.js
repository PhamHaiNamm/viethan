/**
 * config/db.js
 * Kết nối MongoDB bằng Mongoose
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Các options tối ưu cho production
    });
    console.log(`✅ MongoDB đã kết nối: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Thoát nếu không kết nối được
  }
};

module.exports = connectDB;
