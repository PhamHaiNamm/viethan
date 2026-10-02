/**
 * utils/apiResponse.js
 * Định dạng response thống nhất cho toàn bộ API
 * Format: { success, data, message, pagination? }
 */

/**
 * Trả về response thành công
 */
const successResponse = (res, data = null, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Trả về response lỗi
 */
const errorResponse = (res, message = 'Đã xảy ra lỗi', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Trả về response có phân trang
 */
const paginatedResponse = (res, data, pagination, message = 'Thành công') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

/**
 * Tính toán thông tin phân trang
 */
const getPagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    total,
    totalPages,
    currentPage,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

module.exports = { successResponse, errorResponse, paginatedResponse, getPagination };
