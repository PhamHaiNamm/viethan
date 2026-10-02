/**
 * controllers/serviceController.js
 * CRUD dịch vụ công ty
 */
const Service = require('../models/Service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Lấy danh sách dịch vụ (public)
 * @route   GET /api/services
 * @access  Public
 */
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isPublished: true })
      .sort('order')
      .select('-content -__v');

    return successResponse(res, services, 'Lấy danh sách dịch vụ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy danh sách dịch vụ', 500);
  }
};

/**
 * @desc    Lấy chi tiết dịch vụ theo slug (public)
 * @route   GET /api/services/:slug
 * @access  Public
 */
const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isPublished: true });

    if (!service) {
      return errorResponse(res, 'Không tìm thấy dịch vụ', 404);
    }

    return successResponse(res, service, 'Lấy chi tiết dịch vụ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy dịch vụ', 500);
  }
};

/**
 * @desc    Tạo dịch vụ mới (Admin)
 * @route   POST /api/admin/services
 * @access  Private/Admin
 */
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    return successResponse(res, service, 'Tạo dịch vụ thành công', 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    return errorResponse(res, 'Lỗi server khi tạo dịch vụ', 500);
  }
};

/**
 * @desc    Cập nhật dịch vụ (Admin)
 * @route   PUT /api/admin/services/:id
 * @access  Private/Admin
 */
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return errorResponse(res, 'Không tìm thấy dịch vụ', 404);
    }

    return successResponse(res, service, 'Cập nhật dịch vụ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi cập nhật dịch vụ', 500);
  }
};

/**
 * @desc    Xóa dịch vụ (Admin)
 * @route   DELETE /api/admin/services/:id
 * @access  Private/Admin
 */
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return errorResponse(res, 'Không tìm thấy dịch vụ', 404);
    }

    return successResponse(res, null, 'Xóa dịch vụ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi xóa dịch vụ', 500);
  }
};

// Lấy tất cả dịch vụ cho admin (kể cả ẩn)
const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    return successResponse(res, services, 'Lấy danh sách dịch vụ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getAdminServices,
};
