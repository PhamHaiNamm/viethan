/**
 * controllers/miscController.js
 * Xử lý các API còn lại: Testimonials, Banners, Stats, Settings, Upload
 */
const Testimonial = require('../models/Testimonial');
const Banner = require('../models/Banner');
const Setting = require('../models/Setting');
const Project = require('../models/Project');
const Post = require('../models/Post');
const Contact = require('../models/Contact');
const path = require('path');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ===================================================
// TESTIMONIALS
// ===================================================

/** GET /api/testimonials - Lấy cảm nhận đã publish */
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort('order -createdAt');
    return successResponse(res, testimonials, 'Lấy cảm nhận thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

/** CRUD Testimonials cho Admin */
const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort('order');
    return successResponse(res, testimonials, 'Lấy cảm nhận thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const createTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    return successResponse(res, t, 'Tạo cảm nhận thành công', 201);
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return errorResponse(res, 'Không tìm thấy cảm nhận', 404);
    return successResponse(res, t, 'Cập nhật thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return errorResponse(res, 'Không tìm thấy cảm nhận', 404);
    return successResponse(res, null, 'Xóa thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

// ===================================================
// BANNERS
// ===================================================

/** GET /api/banners - Lấy banner đang active, sắp xếp theo order */
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('order');
    return successResponse(res, banners, 'Lấy banners thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('order');
    return successResponse(res, banners, 'Lấy banners thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    return successResponse(res, banner, 'Tạo banner thành công', 201);
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return errorResponse(res, 'Không tìm thấy banner', 404);
    return successResponse(res, banner, 'Cập nhật banner thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return errorResponse(res, 'Không tìm thấy banner', 404);
    return successResponse(res, null, 'Xóa banner thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

// ===================================================
// STATS - Số liệu cho counter (từ Setting)
// ===================================================

/** GET /api/stats - Lấy số liệu thống kê */
const getStats = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'main' });

    if (!setting) {
      // Trả về giá trị mặc định nếu chưa có setting
      return successResponse(
        res,
        {
          projects: 100,
          years: 10,
          clients: 50,
          warranty: 100,
        },
        'Lấy số liệu thành công'
      );
    }

    return successResponse(res, setting.stats, 'Lấy số liệu thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy số liệu', 500);
  }
};

// ===================================================
// SETTINGS - Cài đặt chung
// ===================================================

/** GET /api/settings - Lấy cài đặt công ty */
const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'main' });

    if (!setting) {
      // Tạo setting mặc định nếu chưa có
      setting = await Setting.create({ key: 'main' });
    }

    return successResponse(res, setting, 'Lấy cài đặt thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy cài đặt', 500);
  }
};

/** PUT /api/admin/settings - Cập nhật cài đặt (Admin) */
const updateSettings = async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: 'main' },
      req.body,
      { new: true, upsert: true } // Tạo mới nếu chưa có
    );
    return successResponse(res, setting, 'Cập nhật cài đặt thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi cập nhật cài đặt', 500);
  }
};

// ===================================================
// UPLOAD ẢNH
// ===================================================

/** POST /api/admin/upload - Upload ảnh lên server */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Vui lòng chọn file ảnh để upload', 400);
    }

    let imageUrl;

    if (process.env.UPLOAD_TYPE === 'cloudinary') {
      // Cloudinary trả về URL trực tiếp
      imageUrl = req.file.path;
    } else {
      // Local: tạo URL public
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    }

    return successResponse(
      res,
      { url: imageUrl, filename: req.file.filename },
      'Upload ảnh thành công'
    );
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi upload ảnh', 500);
  }
};

// ===================================================
// DASHBOARD STATS (Admin)
// ===================================================

/** GET /api/admin/dashboard - Thống kê cho admin dashboard */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      totalPosts,
      publishedPosts,
      totalContacts,
      newContacts,
      unreadContacts,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Post.countDocuments(),
      Post.countDocuments({ isPublished: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ isRead: false }),
    ]);

    // 10 liên hệ mới nhất
    const recentContacts = await Contact.find()
      .sort('-createdAt')
      .limit(10)
      .select('fullName phone fieldType status createdAt isRead');

    return successResponse(
      res,
      {
        projects: { total: totalProjects, published: publishedProjects },
        posts: { total: totalPosts, published: publishedPosts },
        contacts: {
          total: totalContacts,
          new: newContacts,
          unread: unreadContacts,
        },
        recentContacts,
      },
      'Lấy thống kê dashboard thành công'
    );
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy thống kê', 500);
  }
};

module.exports = {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getStats,
  getSettings,
  updateSettings,
  uploadImage,
  getDashboardStats,
};
