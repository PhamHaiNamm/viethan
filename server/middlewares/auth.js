/**
 * middlewares/auth.js
 * Middleware xác thực JWT cho các route Admin
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware bảo vệ route - yêu cầu đăng nhập
 */
const protect = async (req, res, next) => {
  let token;

  // Lấy token từ header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Hoặc từ cookie (nếu dùng)
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return errorResponse(res, 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.', 401);
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user từ DB (bỏ password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return errorResponse(res, 'Tài khoản không còn tồn tại.', 401);
    }

    if (!req.user.isActive) {
      return errorResponse(res, 'Tài khoản đã bị vô hiệu hóa.', 401);
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
    }
    return errorResponse(res, 'Token không hợp lệ.', 401);
  }
};

/**
 * Middleware kiểm tra quyền Admin
 * Phải dùng sau middleware protect
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Bạn không có quyền thực hiện hành động này.', 403);
  }
};

module.exports = { protect, adminOnly };
