/**
 * routes/publicRoutes.js
 * Tất cả routes PUBLIC không cần auth
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Controllers
const { getProjects, getProjectBySlug } = require('../controllers/projectController');
const { getServices, getServiceBySlug } = require('../controllers/serviceController');
const { getPosts, getPostBySlug } = require('../controllers/postController');
const { createContact } = require('../controllers/contactController');
const {
  getTestimonials,
  getBanners,
  getStats,
  getSettings,
} = require('../controllers/miscController');

// Rate limit đặc biệt cho form liên hệ (chống spam)
const contactRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 phút
  max: parseInt(process.env.CONTACT_RATE_LIMIT_MAX) || 5, // Tối đa 5 lần/15 phút
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== PROJECTS =====
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);

// ===== SERVICES =====
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);

// ===== POSTS / TIN TỨC =====
router.get('/posts', getPosts);
router.get('/posts/:slug', getPostBySlug);

// ===== TESTIMONIALS =====
router.get('/testimonials', getTestimonials);

// ===== BANNERS =====
router.get('/banners', getBanners);

// ===== STATS (cho counter) =====
router.get('/stats', getStats);

// ===== SETTINGS (thông tin công ty) =====
router.get('/settings', getSettings);

// ===== CONTACTS (form báo giá, có rate limit) =====
router.post('/contacts', contactRateLimiter, createContact);

module.exports = router;
