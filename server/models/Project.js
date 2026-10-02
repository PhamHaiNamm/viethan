/**
 * models/Project.js
 * Schema dự án thi công sân thể thao
 */
const mongoose = require('mongoose');
const slugify = require('slugify');

// Hàm tạo slug từ tiếng Việt (bỏ dấu)
const vietnameseSlug = (text) => {
  const vietnameseMap = {
    à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
    ă: 'a', ắ: 'a', ằ: 'a', ẵ: 'a', ặ: 'a', ẳ: 'a',
    â: 'a', ấ: 'a', ầ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
    è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
    ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
    ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
    ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
    ô: 'o', ố: 'o', ồ: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
    ơ: 'o', ớ: 'o', ờ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
    ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
    ư: 'u', ứ: 'u', ừ: 'u', ử: 'u', ữ: 'u', ự: 'u',
    ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
    đ: 'd',
    // Chữ hoa
    À: 'A', Á: 'A', Ả: 'A', Ã: 'A', Ạ: 'A',
    Ă: 'A', Ắ: 'A', Ằ: 'A', Ẵ: 'A', Ặ: 'A', Ẳ: 'A',
    Â: 'A', Ấ: 'A', Ầ: 'A', Ẩ: 'A', Ẫ: 'A', Ậ: 'A',
    È: 'E', É: 'E', Ẻ: 'E', Ẽ: 'E', Ẹ: 'E',
    Ê: 'E', Ề: 'E', Ế: 'E', Ể: 'E', Ễ: 'E', Ệ: 'E',
    Ì: 'I', Í: 'I', Ỉ: 'I', Ĩ: 'I', Ị: 'I',
    Ò: 'O', Ó: 'O', Ỏ: 'O', Õ: 'O', Ọ: 'O',
    Ô: 'O', Ố: 'O', Ồ: 'O', Ổ: 'O', Ỗ: 'O', Ộ: 'O',
    Ơ: 'O', Ớ: 'O', Ờ: 'O', Ở: 'O', Ỡ: 'O', Ợ: 'O',
    Ù: 'U', Ú: 'U', Ủ: 'U', Ũ: 'U', Ụ: 'U',
    Ư: 'U', Ứ: 'U', Ừ: 'U', Ử: 'U', Ữ: 'U', Ự: 'U',
    Ỳ: 'Y', Ý: 'Y', Ỷ: 'Y', Ỹ: 'Y', Ỵ: 'Y',
    Đ: 'D',
  };

  return text
    .split('')
    .map((char) => vietnameseMap[char] || char)
    .join('');
};

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên dự án'],
      trim: true,
      maxlength: [200, 'Tên dự án không được quá 200 ký tự'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    // Loại sân thi công
    category: {
      type: String,
      required: [true, 'Vui lòng chọn loại sân'],
      enum: [
        'bong-da',      // Sân bóng đá cỏ nhân tạo
        'bong-ro',      // Sân bóng rổ
        'tennis',       // Sân tennis
        'pickleball',   // Sân pickleball
        'cau-long',     // Sân cầu lông
        'duong-chay',   // Đường chạy điền kinh
        'khac',         // Loại khác
      ],
    },
    location: {
      type: String,
      trim: true,
      default: 'Hạ Long, Quảng Ninh',
    },
    area: {
      type: Number, // Diện tích m²
      min: [0, 'Diện tích không hợp lệ'],
    },
    year: {
      type: Number,
      min: [2000, 'Năm không hợp lệ'],
      max: [new Date().getFullYear() + 1, 'Năm không hợp lệ'],
    },
    client: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String, // Nội dung chi tiết HTML/Markdown
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        caption: { type: String, default: '' },
      },
    ],
    thumbnail: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Tự tạo slug từ title trước khi lưu
projectSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    const deAccented = vietnameseSlug(this.title);
    this.slug = slugify(deAccented, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
  next();
});

// Index tìm kiếm toàn văn
projectSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Project', projectSchema);
module.exports.vietnameseSlug = vietnameseSlug; // Export để dùng ở models khác
