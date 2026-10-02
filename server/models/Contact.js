/**
 * models/Contact.js
 * Schema liên hệ / yêu cầu báo giá từ khách hàng
 */
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
      maxlength: [100, 'Họ tên không quá 100 ký tự'],
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      trim: true,
      match: [/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    // Loại sân cần thi công
    fieldType: {
      type: String,
      enum: [
        'bong-da',
        'bong-ro',
        'tennis',
        'pickleball',
        'cau-long',
        'duong-chay',
        'khac',
        'tu-van',
      ],
      required: [true, 'Vui lòng chọn loại sân/dịch vụ'],
    },
    area: {
      type: Number, // Diện tích m² (ước tính)
      min: [0, 'Diện tích không hợp lệ'],
    },
    location: {
      type: String, // Địa điểm muốn thi công
      trim: true,
    },
    note: {
      type: String,
      maxlength: [1000, 'Ghi chú không quá 1000 ký tự'],
    },
    // Trạng thái xử lý
    status: {
      type: String,
      enum: ['new', 'contacted', 'consulting', 'done', 'cancelled'],
      default: 'new',
      index: true,
    },
    // Admin ghi chú
    adminNote: {
      type: String,
    },
    // Nguồn (từ form nào)
    source: {
      type: String,
      enum: ['hero', 'home-form', 'contact-page', 'service-page', 'other'],
      default: 'other',
    },
    // Đã đọc chưa
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt = thời điểm gửi form
  }
);

module.exports = mongoose.model('Contact', contactSchema);
