/**
 * services/api.js
 * Cấu hình Axios instance và tất cả API calls
 */
import axios from 'axios';

// Base URL từ env hoặc proxy Vite
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – tự động đính kèm JWT token cho admin
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('viethan_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → xóa và redirect về login
      localStorage.removeItem('viethan_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ================================================
// PUBLIC APIs
// ================================================

export const publicApi = {
  // Banners
  getBanners: () => api.get('/banners'),

  // Projects
  getProjects: (params = {}) => api.get('/projects', { params }),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),

  // Services
  getServices: () => api.get('/services'),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),

  // Posts
  getPosts: (params = {}) => api.get('/posts', { params }),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),

  // Testimonials
  getTestimonials: () => api.get('/testimonials'),

  // Stats (counter numbers)
  getStats: () => api.get('/stats'),

  // Settings (thông tin công ty)
  getSettings: () => api.get('/settings'),

  // Gửi form liên hệ
  createContact: (data) => api.post('/contacts', data),
};

// ================================================
// ADMIN APIs
// ================================================

export const adminApi = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),

  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Projects
  getProjects: (params) => api.get('/admin/projects', { params }),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),

  // Services
  getServices: () => api.get('/admin/services'),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),

  // Posts
  getPosts: (params) => api.get('/admin/posts', { params }),
  createPost: (data) => api.post('/admin/posts', data),
  updatePost: (id, data) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),

  // Contacts
  getContacts: (params) => api.get('/admin/contacts', { params }),
  updateContact: (id, data) => api.put(`/admin/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
  exportContactsCSV: () =>
    api.get('/admin/contacts/export', { responseType: 'blob' }),

  // Testimonials
  getTestimonials: () => api.get('/admin/testimonials'),
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),

  // Banners
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data) => api.post('/admin/banners', data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),

  // Settings
  updateSettings: (data) => api.put('/admin/settings', data),

  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
