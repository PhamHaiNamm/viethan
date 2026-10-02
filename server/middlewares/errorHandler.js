/**
 * middlewares/errorHandler.js
 * Xử lý lỗi tập trung - Middleware cuối cùng trong chain
 */
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware xử lý lỗi tổng quát
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi máy chủ nội bộ';

  // Lỗi Mongoose: document không tìm thấy
  if (err.name === 'CastError') {
    message = `Không tìm thấy tài nguyên với ID: ${err.value}`;
    statusCode = 404;
  }

  // Lỗi Mongoose: trùng unique field
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const fieldMap = {
      email: 'Email',
      slug: 'Đường dẫn (slug)',
      phone: 'Số điện thoại',
    };
    message = `${fieldMap[field] || field} đã tồn tại. Vui lòng dùng giá trị khác.`;
    statusCode = 400;
  }

  // Lỗi Mongoose: validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = 'Dữ liệu không hợp lệ';
    statusCode = 400;
    return errorResponse(res, message, statusCode, errors);
  }

  // Lỗi JWT
  if (err.name === 'JsonWebTokenError') {
    message = 'Token không hợp lệ';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Phiên đăng nhập đã hết hạn';
    statusCode = 401;
  }

  // Log lỗi trong development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  return errorResponse(res, message, statusCode);
};

/**
 * Middleware xử lý route không tồn tại (404)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy route: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
