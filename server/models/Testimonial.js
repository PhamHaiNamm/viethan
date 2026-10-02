/**
 * models/Testimonial.js
 * Schema cảm nhận / đánh giá của khách hàng
 */
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên khách hàng'],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'Khách hàng',
      // Ví dụ: "Chủ đầu tư sân bóng Hạ Long"
    },
    company: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung cảm nhận'],
      maxlength: [1000, 'Cảm nhận không quá 1000 ký tự'],
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    projectRef: {
      type: String, // Tên dự án liên quan
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
