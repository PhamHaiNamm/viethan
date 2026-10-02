/**
 * components/layout/Navbar.jsx
 * Header điều hướng phong cách thể thao, glassmorphism cao cấp, khoảng cách rộng rãi
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, ArrowRight, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Giới thiệu', to: '/gioi-thieu' },
  {
    label: 'Dịch vụ',
    to: '/dich-vu',
    children: [
      { label: 'Tư vấn & Khảo sát',   to: '/dich-vu/tu-van-khao-sat' },
      { label: 'Thiết kế 2D/3D',       to: '/dich-vu/thiet-ke-lap-ban-ve' },
      { label: 'Thi công trọn gói',   to: '/dich-vu/thi-cong-tron-goi' },
      { label: 'Bảo trì & Sửa chữa', to: '/dich-vu/bao-tri-sua-chua' },
    ],
  },
  {
    label: 'Dự án',
    to: '/du-an',
    children: [
      { label: 'Sân bóng đá cỏ nhân tạo', to: '/du-an?category=bong-da' },
      { label: 'Sân Pickleball',          to: '/du-an?category=pickleball' },
      { label: 'Sân Tennis tiêu chuẩn',   to: '/du-an?category=tennis' },
      { label: 'Sân Bóng rổ & Cầu lông',  to: '/du-an?category=bong-ro' },
      { label: 'Đường chạy điền kinh',    to: '/du-an?category=duong-chay' },
    ],
  },
  { label: 'Tin tức', to: '/tin-tuc' },
  { label: 'Liên hệ', to: '/lien-he' },
];

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdown]     = useState(null);
  const [mobileExpanded, setMobileExp]  = useState({});
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080E0B]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 sm:py-3'
          : 'bg-gradient-to-b from-[#080E0B]/80 via-[#080E0B]/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-105 transition-all">
              <span className="text-white font-black text-xl tracking-tighter">V</span>
            </div>
            <div>
              <div className="font-black text-white text-xl sm:text-2xl tracking-tight leading-none" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                VietHan<span className="text-[#22C55E]">Sports</span>
              </div>
              <div className="text-[10px] sm:text-xs text-green-400 font-semibold tracking-wider uppercase mt-1 flex items-center gap-1.5">
                <span>🇰🇷 Chuẩn Hàn Quốc</span>
                <span className="text-gray-500">•</span>
                <span>Hạ Long</span>
              </div>
            </div>
          </Link>

          {/* ===== MENU DESKTOP ===== */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="relative group" onMouseLeave={() => setDropdown(null)}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setDropdown((p) => (p === link.label ? null : link.label))}
                      onMouseEnter={() => setDropdown(link.label)}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-200 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                    >
                      {link.label}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 text-gray-400 group-hover:text-green-400 ${
                          dropdownOpen === link.label ? 'rotate-180 text-green-400' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-1 w-64 rounded-2xl overflow-hidden shadow-2xl bg-[#0E1712] border border-white/10 p-2 z-50 backdrop-blur-2xl"
                        >
                          {link.children.map((child) => (
                            <NavLink
                              key={child.to}
                              to={child.to}
                              className={({ isActive }) =>
                                `block px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                                  isActive
                                    ? 'bg-green-500/20 text-[#22C55E]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                        isActive
                          ? 'text-[#22C55E] bg-green-950/40 shadow-sm border border-green-500/20'
                          : 'text-gray-200 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* ===== NÚT BÁO GIÁ & HOTLINE (DESKTOP) ===== */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:0901234567"
              className="flex items-center gap-2 text-xs font-bold text-gray-200 hover:text-green-400 transition-colors py-2 px-3 rounded-xl hover:bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <Phone size={14} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-normal">Hotline 24/7</div>
                <div className="text-white font-extrabold tracking-wide">0901 234 567</div>
              </div>
            </a>

            <Link
              to="/lien-he"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Báo giá ngay <ArrowRight size={14} />
            </Link>
          </div>

          {/* ===== NÚT HAMBURGER MOBILE ===== */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 text-white hover:text-green-400 transition-colors rounded-xl bg-white/5 border border-white/10"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ===== DRAWER MOBILE ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#080E0B] border-b border-white/10 px-6 py-6 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="border-b border-white/5 pb-2">
                  {link.children ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileExp((p) => ({ ...p, [link.label]: !p[link.label] }))
                        }
                        className="w-full flex items-center justify-between py-2.5 text-base font-bold text-gray-200"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${mobileExpanded[link.label] ? 'rotate-180 text-green-400' : 'text-gray-500'}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded[link.label] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-2 py-2"
                          >
                            {link.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                className="block py-2 text-sm text-gray-400 hover:text-green-400 font-medium"
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block py-2.5 text-base font-bold ${
                          isActive ? 'text-green-400' : 'text-gray-200'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 space-y-3">
              <a
                href="tel:0901234567"
                className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 text-sm"
              >
                <Phone size={16} className="text-green-400" />
                Hotline: 0901 234 567
              </a>
              <Link
                to="/lien-he"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-600/30"
              >
                Nhận Báo Giá Miễn Phí <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
