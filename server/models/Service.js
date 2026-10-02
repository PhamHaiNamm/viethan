/**
 * models/Service.js
 * Schema dịch vụ công ty (Tư vấn, Thiết kế, Thi công, Bảo trì...)
 */
const mongoose = require('mongoose');
const slugify = require('slugify');
const { vietnameseSlug } = require('./Project');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên dịch vụ'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả ngắn'],
      maxlength: [300, 'Mô tả ngắn không quá 300 ký tự'],
    },
    content: {
      type: String, // Nội dung chi tiết HTML
      required: [true, 'Vui lòng nhập nội dung dịch vụ'],
    },
    // Icon: tên icon từ lucide-react hoặc đường dẫn SVG
    icon: {
      type: String,
      default: 'Wrench',
    },
    image: {
      type: String,
      default: '',
    },
    features: [
      {
        type: String, // Các điểm nổi bật của dịch vụ
      },
    ],
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

serviceSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    const deAccented = vietnameseSlug(this.title);
    this.slug = slugify(deAccented, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
