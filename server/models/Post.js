/**
 * models/Post.js
 * Schema bài viết tin tức / kiến thức (Blog)
 */
const mongoose = require('mongoose');
const slugify = require('slugify');
const { vietnameseSlug } = require('./Project');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề bài viết'],
      trim: true,
      maxlength: [250, 'Tiêu đề không quá 250 ký tự'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả ngắn'],
      maxlength: [500, 'Mô tả ngắn không quá 500 ký tự'],
    },
    content: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung bài viết'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'VietHan Sports',
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

postSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    const deAccented = vietnameseSlug(this.title);
    this.slug = slugify(deAccented, { lower: true, strict: true });
  }
  // Khi publish thì set thời gian publish
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index tìm kiếm toàn văn
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
