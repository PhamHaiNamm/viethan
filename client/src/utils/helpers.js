/**
 * utils/helpers.js
 * Các hàm tiện ích dùng chung trong toàn ứng dụng
 */

// Bản đồ tên danh mục dự án
export const CATEGORY_MAP = {
  'bong-da':    { label: 'Sân bóng đá cỏ nhân tạo', icon: '⚽', color: 'bg-green-100 text-green-800' },
  'bong-ro':    { label: 'Sân bóng rổ',              icon: '🏀', color: 'bg-orange-100 text-orange-800' },
  'tennis':     { label: 'Sân tennis',                icon: '🎾', color: 'bg-yellow-100 text-yellow-800' },
  'pickleball': { label: 'Sân pickleball',            icon: '🏓', color: 'bg-blue-100 text-blue-800' },
  'cau-long':   { label: 'Sân cầu lông',              icon: '🏸', color: 'bg-purple-100 text-purple-800' },
  'duong-chay': { label: 'Đường chạy điền kinh',      icon: '🏃', color: 'bg-red-100 text-red-800' },
  'khac':       { label: 'Loại khác',                 icon: '🏟️', color: 'bg-gray-100 text-gray-800' },
};

export const FIELD_TYPE_OPTIONS = [
  { value: 'bong-da',    label: 'Sân bóng đá cỏ nhân tạo' },
  { value: 'bong-ro',    label: 'Sân bóng rổ' },
  { value: 'tennis',     label: 'Sân tennis' },
  { value: 'pickleball', label: 'Sân pickleball' },
  { value: 'cau-long',   label: 'Sân cầu lông' },
  { value: 'duong-chay', label: 'Đường chạy điền kinh' },
  { value: 'tu-van',     label: 'Tư vấn chung' },
  { value: 'khac',       label: 'Loại khác' },
];

/** Format số có dấu phẩy (VD: 1200 → 1,200) */
export const formatNumber = (num) =>
  new Intl.NumberFormat('vi-VN').format(num);

/** Format ngày tháng tiếng Việt */
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

/** Rút gọn text */
export const truncate = (text, maxLength = 150) =>
  text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;

/** Scroll lên đầu trang */
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

/** Scroll đến element theo id */
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
