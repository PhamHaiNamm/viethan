/**
 * middlewares/upload.js
 * Cấu hình upload ảnh với Multer (local) hoặc Cloudinary
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============= UPLOAD LOCAL =============
// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tên file: timestamp-originalname (tránh trùng)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Lọc loại file - chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (JPEG, PNG, WebP, GIF)'), false);
  }
};

// Multer instance (Multer v2+)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn 10MB mỗi file
  },
});

// ============= UPLOAD CLOUDINARY =============
// Chỉ dùng khi UPLOAD_TYPE=cloudinary trong .env
let uploadToCloudinary = null;
if (process.env.UPLOAD_TYPE === 'cloudinary') {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'viethan-sports',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1920, crop: 'limit', quality: 'auto' }],
    },
  });

  uploadToCloudinary = multer({
    storage: cloudinaryStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  });
}

// Export middleware upload phù hợp theo cấu hình
const getUploadMiddleware = () => {
  if (process.env.UPLOAD_TYPE === 'cloudinary' && uploadToCloudinary) {
    return uploadToCloudinary;
  }
  return upload;
};

module.exports = { upload, uploadToCloudinary, getUploadMiddleware };
