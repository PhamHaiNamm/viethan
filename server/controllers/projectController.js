/**
 * controllers/projectController.js
 * CRUD dự án thi công sân thể thao
 */
const Project = require('../models/Project');
const { successResponse, errorResponse, paginatedResponse, getPagination } = require('../utils/apiResponse');

/**
 * @desc    Lấy danh sách dự án (public, có lọc và phân trang)
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res) => {
  try {
    const {
      category,
      featured,
      page = 1,
      limit = 12,
      search,
      sort = '-createdAt',
    } = req.query;

    // Xây dựng filter
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content -__v'); // Không trả content dài trong danh sách

    const pagination = getPagination(page, limit, total);
    return paginatedResponse(res, projects, pagination, 'Lấy danh sách dự án thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy danh sách dự án', 500);
  }
};

/**
 * @desc    Lấy chi tiết dự án theo slug
 * @route   GET /api/projects/:slug
 * @access  Public
 */
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!project) {
      return errorResponse(res, 'Không tìm thấy dự án', 404);
    }

    // Tăng view count
    project.viewCount += 1;
    await project.save({ validateBeforeSave: false });

    // Lấy dự án liên quan (cùng category)
    const related = await Project.find({
      category: project.category,
      isPublished: true,
      _id: { $ne: project._id },
    })
      .limit(3)
      .select('title slug thumbnail category location area year');

    return successResponse(res, { project, related }, 'Lấy chi tiết dự án thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy chi tiết dự án', 500);
  }
};

/**
 * @desc    Tạo dự án mới (Admin)
 * @route   POST /api/admin/projects
 * @access  Private/Admin
 */
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return successResponse(res, project, 'Tạo dự án thành công', 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    return errorResponse(res, 'Lỗi server khi tạo dự án', 500);
  }
};

/**
 * @desc    Cập nhật dự án (Admin)
 * @route   PUT /api/admin/projects/:id
 * @access  Private/Admin
 */
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return errorResponse(res, 'Không tìm thấy dự án', 404);
    }

    return successResponse(res, project, 'Cập nhật dự án thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi cập nhật dự án', 500);
  }
};

/**
 * @desc    Xóa dự án (Admin)
 * @route   DELETE /api/admin/projects/:id
 * @access  Private/Admin
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return errorResponse(res, 'Không tìm thấy dự án', 404);
    }

    return successResponse(res, null, 'Xóa dự án thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi xóa dự án', 500);
  }
};

/**
 * @desc    Lấy tất cả dự án cho Admin (không lọc isPublished)
 * @route   GET /api/admin/projects
 * @access  Private/Admin
 */
const getAdminProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content -__v');

    const pagination = getPagination(page, limit, total);
    return paginatedResponse(res, projects, pagination, 'Lấy danh sách dự án thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getAdminProjects,
};
