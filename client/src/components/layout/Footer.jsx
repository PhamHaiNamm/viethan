/**
 * components/layout/Footer.jsx
 * Footer doanh nghiệp phong cách hiện đại, CTA Banner dạng thẻ đảo nổi (Floating Island Card)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const SERVICES_LINKS = [
  { label: 'Sân bóng đá cỏ nhân tạo', to: '/du-an?category=bong-da' },
  { label: 'Sân tennis tiêu chuẩn',   to: '/du-an?category=tennis' },
  { label: 'Sân pickleball',           to: '/du-an?category=pickleball' },
  { label: 'Sân bóng rổ',             to: '/du-an?category=bong-ro' },
  { label: 'Sân cầu lông thảm Vinyl', to: '/du-an?category=cau-long' },
  { label: 'Đường chạy điền kinh',    to: '/du-an?category=duong-chay' },
];

const PAGE_LINKS = [
  { label: 'Trang chủ',     to: '/' },
  { label: 'Về chúng tôi', to: '/gioi-thieu' },
  { label: 'Dịch vụ thi công', to: '/dich-vu' },
  { label: 'Dự án đã làm', to: '/du-an' },
  { label: 'Cẩm nang tin tức', to: '/tin-tuc' },
  { label: 'Liên hệ & Báo giá', to: '/lien-he' },
];

export default function Footer() {
  return (
    <footer className="bg-[#080E0B] text-white relative pt-12 sm:pt-16">

      {/* ===== FLOATING CTA BANNER (THẺ ĐẢO NỔI SANG TRỌNG) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#0E1712] p-8 sm:p-12 lg:p-14 shadow-[0_20px_50px_rgba(22,163,74,0.3)] border border-green-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Hào quang nền nhẹ */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-green-400/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Khởi đầu công trình thể thao đẳng cấp
            </span>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Sẵn sàng xây dựng sân thể thao của bạn?
            </h3>
            <p className="text-green-100 text-sm sm:text-base mt-2 max-w-xl">
              Nhận tư vấn khảo sát mặt bằng và dự toán sơ bộ miễn phí trong vòng 24 giờ.
            </p>
          </div>

          <Link
            to="/lien-he"
            className="relative z-10 flex items-center gap-3 px-8 py-4 sm:py-4.5 rounded-2xl bg-white text-[#16A34A] hover:text-[#15803D] font-extrabold text-base hover:bg-green-50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap shrink-0"
          >
            Liên hệ ngay <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ===== MAIN FOOTER (4 CỘT) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* CỘT 1: THÔNG TIN CÔNG TY (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">V</span>
              </div>
              <div>
                <div className="font-black text-white text-xl tracking-tight leading-none" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  VietHan<span className="text-[#22C55E]">Sports</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Việt – Hàn • Chuẩn FIFA Quốc Tế</div>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              Đơn vị tiên phong tư vấn, thiết kế và thi công sân thể thao theo công nghệ và tiêu chuẩn chất lượng Hàn Quốc tại Hạ Long, Cẩm Phả, Uông Bí và toàn tỉnh Quảng Ninh.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-gray-300 font-semibold">
                <span>🇰🇷 Công nghệ Hàn Quốc</span>
                <span className="text-gray-500">•</span>
                <span>🇻🇳 Kỹ sư Việt Nam</span>
              </div>
            </div>
          </div>

          {/* CỘT 2: LOẠI SÂN THI CÔNG (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              Loại sân thi công
            </h4>
            <ul className="space-y-3">
              {SERVICES_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={13} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: LIÊN KẾT NHANH (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              {PAGE_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={13} className="text-green-500 group-hover:translate-x-1 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 4: THÔNG TIN LIÊN HỆ (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              Trụ sở & Hotline
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span>123 Đường Trần Quốc Nghiễn, P. Bãi Cháy, TP. Hạ Long, Quảng Ninh</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#16A34A] shrink-0" />
                <a href="tel:0901234567" className="text-white font-bold hover:text-green-400 transition-colors">
                  0901 234 567 (Hotline 24/7)
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#16A34A] shrink-0" />
                <a href="mailto:info@viethansports.vn" className="text-gray-300 hover:text-green-400 transition-colors">
                  info@viethansports.vn
                </a>
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com/viethansports"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#16A34A] flex items-center justify-center transition-colors text-white"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@viethansports"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#16A34A] flex items-center justify-center transition-colors text-white"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://zalo.me/0901234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#16A34A] flex items-center justify-center font-bold text-xs transition-colors text-white"
                aria-label="Zalo"
              >
                Zalo
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VietHan Sports. Kiến tạo sân chơi – Nâng tầm thể thao.</p>
          <div className="flex items-center gap-6">
            <span>GPKD: 5701234567 cấp bởi Sở KH&ĐT Quảng Ninh</span>
            <Link to="/admin/login" className="hover:text-green-400 transition-colors">
              Quản trị viên
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
