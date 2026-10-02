/**
 * models/Setting.js
 * Schema cài đặt chung - thông tin công ty, số liệu thống kê
 * Chỉ có 1 document duy nhất trong collection này
 */
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    // Khóa để xác định document duy nhất
    key: {
      type: String,
      default: 'main',
      unique: true,
    },
    // ===== THÔNG TIN CÔNG TY =====
    companyName: {
      type: String,
      default: 'VietHan Sports',
    },
    companyNameFull: {
      type: String,
      default: 'Công ty TNHH VietHan Sports',
    },
    slogan: {
      type: String,
      default: 'Kiến tạo sân chơi – Nâng tầm thể thao',
    },
    address: {
      type: String,
      default: 'Hạ Long, Quảng Ninh',
    },
    hotline: {
      type: String,
      default: '0901 234 567',
    },
    phone2: {
      type: String,
    },
    email: {
      type: String,
      default: 'info@viethansports.vn',
    },
    zalo: {
      type: String,
      default: '0901 234 567',
    },
    website: {
      type: String,
      default: 'https://viethansports.vn',
    },
    // ===== MẠNG XÃ HỘI =====
    socialLinks: {
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      zalo: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    // ===== SỐ LIỆU THỐNG KÊ (Cho counter) =====
    stats: {
      projects: { type: Number, default: 100 },      // Công trình hoàn thành
      years: { type: Number, default: 10 },           // Năm kinh nghiệm
      clients: { type: Number, default: 50 },         // Khách hàng tin tưởng
      warranty: { type: Number, default: 100 },       // % bảo hành
    },
    // ===== META / SEO =====
    metaTitle: {
      type: String,
      default: 'VietHan Sports – Thi công sân thể thao chuẩn Hàn Quốc tại Hạ Long, Quảng Ninh',
    },
    metaDescription: {
      type: String,
      default:
        'VietHan Sports chuyên tư vấn, thiết kế và thi công sân bóng đá cỏ nhân tạo, sân tennis, pickleball, bóng rổ, cầu lông tại Hạ Long, Quảng Ninh theo tiêu chuẩn Hàn Quốc.',
    },
    // ===== LOGO & FAVICON =====
    logo: {
      type: String,
      default: '/logo.svg',
    },
    favicon: {
      type: String,
      default: '/favicon.ico',
    },
    // Google Maps embed URL
    googleMapsEmbed: {
      type: String,
      default: '',
    },
    // Tọa độ
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
