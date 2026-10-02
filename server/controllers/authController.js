/**
 * controllers/authController.js
 * Xử lý đăng nhập admin và quản lý tài khoản
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Tạo JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Đăng nhập admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input cơ bản
    if (!email || !password) {
      return errorResponse(res, 'Vui lòng nhập email và mật khẩu', 400);
    }

    // Tìm user theo email, lấy cả password (đã bị select:false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Tài khoản đã bị vô hiệu hóa', 401);
    }

    // Kiểm tra password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    // Tạo token
    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      'Đăng nhập thành công'
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Lỗi server khi đăng nhập', 500);
  }
};

/**
 * @desc    Lấy thông tin user hiện tại
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    return successResponse(res, req.user, 'Lấy thông tin tài khoản thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

/**
 * @desc    Đổi mật khẩu
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Vui lòng nhập đầy đủ thông tin', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, 'Mật khẩu hiện tại không đúng', 400);
    }

    user.password = newPassword;
    await user.save(); // Pre-save hook tự động hash

    return successResponse(res, null, 'Đổi mật khẩu thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server', 500);
  }
};

module.exports = { login, getMe, changePassword };
