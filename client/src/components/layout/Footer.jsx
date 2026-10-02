/**
 * components/layout/Footer.jsx
 * Footer đầy đủ thông tin công ty, links, mạng xã hội
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

const SERVICES_LINKS = [
  { label: 'Sân bóng đá cỏ nhân tạo', to: '/du-an?category=bong-da' },
  { label: 'Sân tennis',               to: '/du-an?category=tennis' },
  { label: 'Sân pickleball',           to: '/du-an?category=pickleball' },
  { label: 'Sân bóng rổ',             to: '/du-an?category=bong-ro' },
  { label: 'Sân cầu lông',            to: '/du-an?category=cau-long' },
  { label: 'Đường chạy điền kinh',    to: '/du-an?category=duong-chay' },
];

const PAGE_LINKS = [
  { label: 'Trang chủ',  to: '/' },
  { label: 'Giới thiệu', to: '/gioi-thieu' },
  { label: 'Dịch vụ',   to: '/dich-vu' },
  { label: 'Dự án',     to: '/du-an' },
  { label: 'Tin tức',   to: '/tin-tuc' },
  { label: 'Liên hệ',  to: '/lien-he' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B1410] text-gray-300">
      {/* ===== CTA Banner ===== */}
      <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Sẵn sàng xây dựng sân thể thao của bạn?
            </h3>
            <p className="text-green-100 mt-1">Nhận tư vấn và báo giá miễn phí trong 24 giờ</p>
          </div>
          <Link
            to="/lien-he"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-[#16A34A] font-bold text-lg hover:bg-green-50 transition-colors shadow-xl whitespace-nowrap"
          >
            Liên hệ ngay <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* ===== Main Footer ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Cột 1: Thông tin công ty */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center">
                <span className="text-white font-black text-lg">V</span>
              </div>
              <div>
                <div className="font-black text-white text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  VietHan<span className="text-[#22C55E]">Sports</span>
                </div>
                <div className="text-[10px] text-gray-500">Việt – Hàn • Chuẩn FIFA</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Chuyên gia tư vấn, thiết kế và thi công sân thể thao theo tiêu chuẩn Hàn Quốc tại Hạ Long, Quảng Ninh và các tỉnh lân cận.
            </p>
            {/* Đối tác */}
            <div className="flex items-center gap-2">
              <div className="h-7 flex items-center gap-1">
                {/* Cờ Việt Nam */}
                <div className="w-6 h-4 rounded-sm bg-red-600 flex items-center justify-center">
                  <span className="text-yellow-400 text-[10px]">★</span>
                </div>
                {/* Cờ Hàn Quốc */}
                <div className="w-6 h-4 rounded-sm bg-white border border-gray-200 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-gray-400"></div>
                </div>
              </div>
              <span className="text-xs text-gray-500">Đối tác Việt – Hàn</span>
            </div>
          </div>

          {/* Cột 2: Loại sân */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Loại sân thi công
            </h4>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-[#22C55E] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="text-[#16A34A] group-hover:translate-x-1 transition-transform" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Trang */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2.5">
              {PAGE_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-[#22C55E] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="text-[#16A34A] group-hover:translate-x-1 transition-transform" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Liên hệ
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={18} className="text-[#22C55E] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  123 Đường Trần Quốc Nghiễn, P. Bãi Cháy,<br />
                  TP. Hạ Long, Quảng Ninh
                </span>
              </li>
              <li>
                <a href="tel:0901234567" className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#22C55E] transition-colors">
                  <Phone size={18} className="text-[#22C55E]" />
                  <span>0901 234 567</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@viethansports.vn" className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#22C55E] transition-colors">
                  <Mail size={18} className="text-[#22C55E]" />
                  <span>info@viethansports.vn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://zalo.me/0901234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#22C55E] transition-colors"
                >
                  <MessageCircle size={18} className="text-[#22C55E]" />
                  <span>Zalo: 0901 234 567</span>
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com/viethansports"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#16A34A] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@viethansports"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#16A34A] flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://zalo.me/0901234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#16A34A] flex items-center justify-center text-xs font-bold transition-colors"
                aria-label="Zalo"
              >
                Z
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} VietHan Sports. Thiết kế bởi đội ngũ VietHan.
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <span>GPKD: 5701234567</span>
            <span>•</span>
            <span>MST: 5701234567</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
