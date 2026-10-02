/**
 * routes/adminRoutes.js
 * Tất cả routes ADMIN - yêu cầu JWT + quyền admin
 */
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth');
const { getUploadMiddleware } = require('../middlewares/upload');

// Controllers
const {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const {
  getAdminServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const {
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const {
  getContacts,
  updateContact,
  deleteContact,
  exportContactsCSV,
} = require('../controllers/contactController');
const {
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  updateSettings,
  uploadImage,
  getDashboardStats,
} = require('../controllers/miscController');

// Áp dụng auth middleware cho tất cả admin routes
router.use(protect, adminOnly);

// ===== DASHBOARD =====
router.get('/dashboard', getDashboardStats);

// ===== PROJECTS =====
router.get('/projects', getAdminProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// ===== SERVICES =====
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// ===== POSTS =====
router.get('/posts', getAdminPosts);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// ===== CONTACTS =====
router.get('/contacts', getContacts);
router.get('/contacts/export', exportContactsCSV); // Xuất CSV
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

// ===== TESTIMONIALS =====
router.get('/testimonials', getAdminTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// ===== BANNERS =====
router.get('/banners', getAdminBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// ===== SETTINGS =====
router.put('/settings', updateSettings);

// ===== UPLOAD ẢNH =====
router.post('/upload', getUploadMiddleware().single('image'), uploadImage);
// Upload nhiều ảnh cùng lúc
router.post('/upload-multiple', getUploadMiddleware().array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất 1 ảnh' });
    }
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const urls = req.files.map((file) =>
      process.env.UPLOAD_TYPE === 'cloudinary'
        ? file.path
        : `${serverUrl}/uploads/${file.filename}`
    );
    return res.json({ success: true, message: 'Upload thành công', data: { urls } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server khi upload' });
  }
});

module.exports = router;
