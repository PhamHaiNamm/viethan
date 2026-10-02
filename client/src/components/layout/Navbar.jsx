/**
 * components/layout/Navbar.jsx
 * Navbar trong suốt → chuyển blur khi cuộn, menu hamburger mobile
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

// Danh sách menu
const NAV_LINKS = [
  { label: 'Trang chủ',  to: '/' },
  { label: 'Giới thiệu', to: '/gioi-thieu' },
  {
    label: 'Dịch vụ',
    to: '/dich-vu',
    children: [
      { label: 'Tư vấn & Khảo sát',    to: '/dich-vu/tu-van-khao-sat' },
      { label: 'Thiết kế & Lập bản vẽ', to: '/dich-vu/thiet-ke-lap-ban-ve' },
      { label: 'Thi công trọn gói',     to: '/dich-vu/thi-cong-tron-goi' },
      { label: 'Bảo trì & Sửa chữa',   to: '/dich-vu/bao-tri-sua-chua' },
    ],
  },
  { label: 'Dự án',   to: '/du-an' },
  { label: 'Tin tức', to: '/tin-tuc' },
  { label: 'Liên hệ', to: '/lien-he' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdown] = useState(null);
  const location = useLocation();

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
  }, [location]);

  // Theo dõi scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Đóng menu khi bấm ngoài
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleDropdown = useCallback((label) => {
    setDropdown((prev) => (prev === label ? null : label));
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0B1410]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-lg leading-none">V</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-white text-lg leading-none" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                VietHan<span className="text-[#22C55E]">Sports</span>
              </div>
              <div className="text-[10px] text-gray-400 leading-none mt-0.5">Việt – Hàn • Chuẩn FIFA</div>
            </div>
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to} className="relative group">
                {link.children ? (
                  // Menu có dropdown
                  <>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-200 hover:text-[#22C55E] transition-colors rounded-lg"
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${dropdownOpen === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Dropdown */}
                    <AnimatePresence>
                      {dropdownOpen === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl glass-dark border border-green-900/30"
                        >
                          {link.children.map((child) => (
                            <NavLink
                              key={child.to}
                              to={child.to}
                              className={({ isActive }) =>
                                `block px-4 py-3 text-sm font-medium transition-colors ${
                                  isActive
                                    ? 'bg-green-900/40 text-[#22C55E]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-[#22C55E]'
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
                      `block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'text-[#22C55E] bg-green-900/20'
                          : 'text-gray-200 hover:text-[#22C55E]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* ===== CTA BUTTON (Desktop) ===== */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:0901234567"
              className="flex items-center gap-2 text-sm font-semibold text-[#22C55E] hover:text-white transition-colors"
            >
              <Phone size={16} />
              <span>0901 234 567</span>
            </a>
            <Link
              to="/lien-he"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105"
            >
              Báo giá ngay
            </Link>
          </div>

          {/* ===== HAMBURGER (Mobile) ===== */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-[#0B1410]/98 backdrop-blur-xl border-t border-green-900/20"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <div key={link.to}>
                  {link.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-200 font-medium hover:bg-white/5"
                      >
                        {link.label}
                        <ChevronDown size={16} className={`transition-transform ${dropdownOpen === link.label ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {dropdownOpen === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 pl-4 border-l border-green-800/40 space-y-1 mt-1"
                          >
                            {link.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                className={({ isActive }) =>
                                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive ? 'text-[#22C55E]' : 'text-gray-400 hover:text-[#22C55E]'
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
                        `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-[#22C55E] bg-green-900/20'
                            : 'text-gray-200 hover:bg-white/5 hover:text-[#22C55E]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </div>
              ))}
              {/* Mobile CTA */}
              <div className="pt-4 pb-2 border-t border-green-900/20 space-y-3">
                <a
                  href="tel:0901234567"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#22C55E]/40 text-[#22C55E] font-semibold"
                >
                  <Phone size={18} /> 0901 234 567
                </a>
                <Link
                  to="/lien-he"
                  className="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold"
                >
                  Nhận báo giá miễn phí
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
