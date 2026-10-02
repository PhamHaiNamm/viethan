/**
 * routes/authRoutes.js
 * Routes xác thực người dùng
 */
const express = require('express');
const router = express.Router();
const { login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// POST /api/auth/login - Đăng nhập
router.post('/login', login);

// GET /api/auth/me - Lấy thông tin user hiện tại
router.get('/me', protect, getMe);

// PUT /api/auth/change-password - Đổi mật khẩu
router.put('/change-password', protect, changePassword);

module.exports = router;
