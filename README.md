# VietHan Sports – Website Công Ty Thi Công Sân Thể Thao

> **Công ty Việt – Hàn** chuyên tư vấn, thiết kế và thi công sân thể thao chuẩn Hàn Quốc  
> Khu vực: Hạ Long, Quảng Ninh và các tỉnh lân cận

---

## Cấu trúc dự án (Monorepo)

```
VIETHAN/
├── client/                   # Frontend: React (Vite) + Tailwind + Framer Motion
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # UI components dùng chung
│   │   │   ├── layout/       # Navbar, Footer, Layout
│   │   │   ├── home/         # HeroBanner, ServicesSection, ...
│   │   │   ├── ui/           # Button, Card, Modal, ...
│   │   │   └── admin/        # Admin layout & components
│   │   ├── pages/            # Pages theo React Router
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   ├── hooks/            # Custom hooks (useCounter, useInView, ...)
│   │   ├── services/         # API calls (axios)
│   │   ├── context/          # React Context (Auth, Settings)
│   │   └── utils/            # Helper functions
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                   # Backend: Node.js + Express + MongoDB
    ├── config/
    │   └── db.js             # Kết nối MongoDB
    ├── controllers/          # Business logic
    │   ├── authController.js
    │   ├── projectController.js
    │   ├── serviceController.js
    │   ├── postController.js
    │   ├── contactController.js
    │   └── miscController.js
    ├── middlewares/
    │   ├── auth.js           # JWT protect & adminOnly
    │   ├── errorHandler.js   # Xử lý lỗi tập trung
    │   └── upload.js         # Multer (local/Cloudinary)
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   ├── Service.js
    │   ├── Post.js
    │   ├── Testimonial.js
    │   ├── Banner.js
    │   ├── Contact.js
    │   └── Setting.js
    ├── routes/
    │   ├── authRoutes.js     # /api/auth/*
    │   ├── publicRoutes.js   # /api/* (public)
    │   └── adminRoutes.js    # /api/admin/* (protected)
    ├── utils/
    │   ├── apiResponse.js    # Format response thống nhất
    │   └── sendEmail.js      # Nodemailer
    ├── seed/
    │   └── seed.js           # Script tạo dữ liệu mẫu
    ├── uploads/              # Ảnh upload (local)
    ├── .env
    ├── .env.example
    ├── index.js              # Entry point
    └── package.json
```

---

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- MongoDB >= 5.0 (local hoặc Atlas)
- npm >= 9.0

### 1. Clone và cài đặt

```bash
# Clone project
git clone <repo-url>
cd VIETHAN

# Cài đặt server
cd server
npm install

# Cài đặt client
cd ../client
npm install
```

### 2. Cấu hình biến môi trường

```bash
# Server
cd server
cp .env.example .env
# Chỉnh sửa .env với thông tin thực tế
```

### 3. Chạy với MongoDB Local

```bash
# Đảm bảo MongoDB đang chạy
# Windows: net start MongoDB
# hoặc: mongod --dbpath C:\data\db

# Seed dữ liệu mẫu
cd server
npm run seed

# Chạy server (development)
npm run dev
# Server chạy tại: http://localhost:5000

# Chạy client (terminal mới)
cd client
npm run dev
# Client chạy tại: http://localhost:5173
```

### 4. Chạy với MongoDB Atlas

Thay `MONGO_URI` trong `.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/viethan_sports?retryWrites=true&w=majority
```

---

## API Endpoints

### Public
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/projects` | Danh sách dự án (lọc, phân trang) |
| GET | `/api/projects/:slug` | Chi tiết dự án |
| GET | `/api/services` | Danh sách dịch vụ |
| GET | `/api/services/:slug` | Chi tiết dịch vụ |
| GET | `/api/posts` | Danh sách bài viết |
| GET | `/api/posts/:slug` | Chi tiết bài viết |
| GET | `/api/testimonials` | Cảm nhận khách hàng |
| GET | `/api/banners` | Banners hero slider |
| GET | `/api/stats` | Số liệu thống kê |
| GET | `/api/settings` | Thông tin công ty |
| POST | `/api/contacts` | Gửi form báo giá (rate limit: 5/15 phút) |

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập admin |
| GET | `/api/auth/me` | Thông tin user hiện tại |
| PUT | `/api/auth/change-password` | Đổi mật khẩu |

### Admin (Bearer Token required)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/dashboard` | Thống kê dashboard |
| CRUD | `/api/admin/projects` | Quản lý dự án |
| CRUD | `/api/admin/services` | Quản lý dịch vụ |
| CRUD | `/api/admin/posts` | Quản lý bài viết |
| CRUD | `/api/admin/contacts` | Quản lý liên hệ |
| GET | `/api/admin/contacts/export` | Xuất CSV |
| CRUD | `/api/admin/testimonials` | Quản lý cảm nhận |
| CRUD | `/api/admin/banners` | Quản lý banners |
| PUT | `/api/admin/settings` | Cập nhật cài đặt |
| POST | `/api/admin/upload` | Upload 1 ảnh |
| POST | `/api/admin/upload-multiple` | Upload nhiều ảnh |

---

## Deploy

### Client → Vercel/Netlify

```bash
cd client
npm run build
# Upload thư mục dist/ lên Vercel hoặc Netlify
# Cấu hình environment variable VITE_API_URL=https://your-server.com/api
```

### Server → Render/Railway

1. Push code lên GitHub
2. Tạo Web Service mới trên Render/Railway
3. Cấu hình environment variables từ `.env`
4. Build command: `npm install`
5. Start command: `node index.js`

### Database → MongoDB Atlas

1. Tạo cluster miễn phí tại [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Thêm IP whitelist (0.0.0.0/0 cho production)
3. Tạo database user
4. Copy connection string vào `MONGO_URI`

---

## Thay thế nội dung

### Thay thông tin công ty
Chỉnh trong **Admin Panel** > Cài đặt, hoặc trực tiếp trong database (collection `settings`).

### Thay logo
Thay file `client/public/logo.svg` và `client/public/favicon.ico`.

### Thay số điện thoại
Chỉnh `hotline` và `zalo` trong Admin > Cài đặt.

### Thay ảnh banner
Admin Panel > Quản lý Banner > Upload ảnh mới.

### Thêm dự án
Admin Panel > Dự án > Thêm mới.

---

## Thông tin đăng nhập mặc định (sau seed)

- **Email:** admin@viethansports.vn  
- **Mật khẩu:** Admin@123456  
- **⚠️ Đổi ngay sau khi chạy seed!**
