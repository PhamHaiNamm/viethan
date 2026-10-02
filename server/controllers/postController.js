/**
 * controllers/postController.js
 * CRUD bài viết tin tức và kiến thức (Blog)
 */
const Post = require('../models/Post');
const { successResponse, errorResponse, paginatedResponse, getPagination } = require('../utils/apiResponse');

/**
 * @desc    Lấy danh sách bài viết đã publish (public)
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 9, tag, search } = req.query;
    const filter = { isPublished: true };

    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort('-publishedAt -createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content -__v');

    const pagination = getPagination(page, limit, total);
    return paginatedResponse(res, posts, pagination, 'Lấy danh sách bài viết thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy bài viết', 500);
  }
};

/**
 * @desc    Lấy chi tiết bài viết theo slug (public)
 * @route   GET /api/posts/:slug
 * @access  Public
 */
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, isPublished: true });

    if (!post) {
      return errorResponse(res, 'Không tìm thấy bài viết', 404);
    }

    // Tăng view count
    post.viewCount += 1;
    await post.save({ validateBeforeSave: false });

    // Bài viết liên quan (cùng tag)
    const related = await Post.find({
      isPublished: true,
      _id: { $ne: post._id },
      tags: { $in: post.tags },
    })
      .limit(3)
      .select('title slug excerpt thumbnail publishedAt');

    return successResponse(res, { post, related }, 'Lấy bài viết thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy bài viết', 500);
  }
};

/**
 * @desc    Tạo bài viết mới (Admin)
 * @route   POST /api/admin/posts
 * @access  Private/Admin
 */
const createPost = async (req, res) => {
  try {
    const postData = { ...req.body, author: req.user._id, authorName: req.user.name };
    const post = await Post.create(postData);
    return successResponse(res, post, 'Tạo bài viết thành công', 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    return errorResponse(res, 'Lỗi server khi tạo bài viết', 500);
  }
};

/**
 * @desc    Cập nhật bài viết (Admin)
 * @route   PUT /api/admin/posts/:id
 * @access  Private/Admin
 */
const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return errorResponse(res, 'Không tìm thấy bài viết', 404);
    }

    return successResponse(res, post, 'Cập nhật bài viết thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi cập nhật bài viết', 500);
  }
};

/**
 * @desc    Xóa bài viết (Admin)
 * @route   DELETE /api/admin/posts/:id
 * @access  Private/Admin
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return errorResponse(res, 'Không tìm thấy bài viết', 404);
    }

    return successResponse(res, null, 'Xóa bài viết thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi xóa bài viết', 500);
  }
};

// Lấy tất cả bài viết cho Admin
const getAdminPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content -__v');
    const pagination = getPagination(page, limit, total);
    return paginatedResponse(res, posts, pagination, 'Lấy danh sách bài viết thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getAdminPosts,
};
