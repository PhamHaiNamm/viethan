/**
 * index.js - Entry point của VietHan Sports Server
 * Node.js + Express + MongoDB
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Kết nối database
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middlewares
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// ===== KHỞI TẠO APP =====
const app = express();

// Kết nối MongoDB
connectDB();

// ===== SECURITY MIDDLEWARES =====
// Helmet: thiết lập HTTP headers bảo mật
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép load ảnh từ domain khác
  })
);

// CORS: chỉ cho phép client URL được cấu hình
app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép requests không có origin (Postman, mobile apps)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Không được phép bởi CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Rate limit chung cho toàn bộ API
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: 'Quá nhiều requests từ IP này. Vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// ===== PARSING MIDDLEWARES =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger (chỉ trong development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===== STATIC FILES =====
// Phục vụ ảnh đã upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);          // Authentication
app.use('/api', publicRoutes);             // Public endpoints
app.use('/api/admin', adminRoutes);        // Admin CRUD (protected)

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏟️ VietHan Sports API đang hoạt động',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ===== ROOT =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏟️ Chào mừng đến với VietHan Sports API',
    docs: '/api/health',
    version: '1.0.0',
  });
});

// ===== ERROR HANDLING =====
// 404 - Route không tồn tại
app.use(notFound);

// Xử lý lỗi tập trung (phải để cuối cùng)
app.use(errorHandler);

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏟️  =========================================`);
  console.log(`🏟️  VietHan Sports Server đang chạy`);
  console.log(`🏟️  Port: ${PORT}`);
  console.log(`🏟️  Môi trường: ${process.env.NODE_ENV}`);
  console.log(`🏟️  API: http://localhost:${PORT}/api`);
  console.log(`🏟️  =========================================\n`);
});

// Xử lý unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

module.exports = app;
