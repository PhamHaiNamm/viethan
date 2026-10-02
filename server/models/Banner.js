/**
 * models/Banner.js
 * Schema banner/slide Hero section - quản lý từ admin
 */
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề banner'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    // Đường dẫn ảnh nền (Unsplash URL hoặc ảnh upload)
    image: {
      type: String,
      required: [true, 'Vui lòng chọn ảnh banner'],
    },
    // Nút CTA chính
    ctaText: {
      type: String,
      default: 'Nhận báo giá miễn phí',
    },
    ctaLink: {
      type: String,
      default: '/lien-he',
    },
    // Nút CTA phụ
    ctaSecondaryText: {
      type: String,
      default: 'Xem dự án',
    },
    ctaSecondaryLink: {
      type: String,
      default: '/du-an',
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
