/**
 * components/home/HeroBanner.jsx
 * =====================================================
 * Hero Banner động chuẩn cao cấp – Đậm chất thể thao, không chồng lấn phần tử
 * =====================================================
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/api';
import useTypewriter from '../../hooks/useTypewriter';
import useCounter from '../../hooks/useCounter';

const FALLBACK_BANNERS = [
  {
    _id: '1',
    image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1920&q=80',
    title: 'Kiến tạo sân chơi',
    subtitle: 'Nâng tầm thể thao',
    ctaText: 'Nhận báo giá miễn phí',
    ctaLink: '/lien-he',
    ctaSecondaryText: 'Xem dự án',
    ctaSecondaryLink: '/du-an',
  },
  {
    _id: '2',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=80',
    title: 'Cỏ nhân tạo chuẩn FIFA',
    subtitle: 'Vật liệu Hàn Quốc chính hãng',
    ctaText: 'Tìm hiểu dịch vụ',
    ctaLink: '/dich-vu',
    ctaSecondaryText: 'Liên hệ ngay',
    ctaSecondaryLink: '/lien-he',
  },
  {
    _id: '3',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1920&q=80',
    title: 'Pickleball & Tennis',
    subtitle: 'Chuẩn thi đấu quốc tế',
    ctaText: 'Báo giá sân Pickleball',
    ctaLink: '/lien-he',
    ctaSecondaryText: 'Xem dự án',
    ctaSecondaryLink: '/du-an',
  },
  {
    _id: '4',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80',
    title: 'Thi công trọn gói',
    subtitle: 'Một đầu mối – An tâm tuyệt đối',
    ctaText: 'Tư vấn miễn phí',
    ctaLink: '/lien-he',
    ctaSecondaryText: 'Giới thiệu công ty',
    ctaSecondaryLink: '/gioi-thieu',
  },
];

const TYPEWRITER_TEXTS = [
  'Sân bóng đá cỏ nhân tạo chuẩn FIFA',
  'Cụm sân Pickleball ngoài trời & có mái',
  'Sân Tennis & Cầu lông tiêu chuẩn quốc tế',
  'Đường chạy điền kinh hạt EPDM đàn hồi',
  'Tư vấn – Thiết kế 3D – Thi công trọn gói',
];

const SLIDE_INTERVAL = 6000;

// SVG vạch kẻ sân bóng chìm nhẹ
const FieldLines = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
    viewBox="0 0 1200 700"
    preserveAspectRatio="xMidYMid slice"
  >
    <rect x="100" y="80" width="1000" height="540" fill="none" stroke="white" strokeWidth="2" className="field-line" />
    <line x1="600" y1="80" x2="600" y2="620" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '0.3s' }} />
    <circle cx="600" cy="350" r="90" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '0.6s' }} />
    <circle cx="600" cy="350" r="8" fill="white" opacity="0.6" />
    <rect x="100" y="230" width="150" height="240" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '0.9s' }} />
    <rect x="950" y="230" width="150" height="240" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '0.9s' }} />
  </svg>
);

// Item đếm số liệu
const CounterItem = ({ value, suffix = '', label, started }) => {
  const count = useCounter(value || 0, 2000, started);
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div
        className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <span className="text-white">{count}</span>
        <span className="text-[#22C55E] ml-0.5">{suffix}</span>
      </div>
      <div className="text-xs sm:text-sm text-gray-300 font-medium">{label}</div>
    </div>
  );
};

export default function HeroBanner() {
  const [current, setCurrent]           = useState(0);
  const [counterStarted, setCounter]   = useState(false);
  const intervalRef                     = useRef(null);

  const { data: bannersData } = useQuery({
    queryKey: ['banners'],
    queryFn: publicApi.getBanners,
    staleTime: 10 * 60 * 1000,
  });

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: publicApi.getSettings,
    staleTime: 10 * 60 * 1000,
  });

  const banners = bannersData?.data?.data?.length ? bannersData.data.data : FALLBACK_BANNERS;
  const stats = settingsData?.data?.data?.stats || { projects: 100, years: 10, clients: 50, warranty: 100 };

  useEffect(() => {
    const t = setTimeout(() => setCounter(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((p) => (p + 1) % banners.length);
  }, [banners.length]);

  const goPrev = useCallback(() => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [goNext]);

  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
  }, [goNext]);

  const handlePrev = () => { goPrev(); resetInterval(); };
  const handleNext = () => { goNext(); resetInterval(); };
  const handleDot  = (i) => { goTo(i); resetInterval(); };

  const typedText = useTypewriter(TYPEWRITER_TEXTS, 65, 30, 2000);
  const currentBanner = banners[current];

  return (
    <section className="relative w-full min-h-[100vh] lg:min-h-[900px] flex flex-col justify-between overflow-hidden bg-[#080E0B] pt-28 sm:pt-36 pb-12 sm:pb-16 text-white">

      {/* ======= NỀN SLIDER CHUYỂN ĐỘNG ======= */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentBanner?.image}
              alt={currentBanner?.title || 'Việt – Hàn'}
              className="w-full h-full object-cover kenburns"
            />
          </div>
          <div className="absolute inset-0 hero-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Vạch sân SVG */}
      <FieldLines />

      {/* ======= NỘI DUNG CHÍNH (GIỮA TRANG) ======= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="max-w-4xl">

          {/* Huy hiệu đỉnh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-green-400 text-xs sm:text-sm font-bold tracking-wide mb-6 shadow-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span>Tiêu Chuẩn Thi Công Hàn Quốc • Hạ Long, Quảng Ninh</span>
          </motion.div>

          {/* Tiêu đề chính */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.12] mb-6 tracking-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Kiến tạo sân chơi<br />
            <span className="gradient-text">Nâng tầm thể thao</span>
          </h1>

          {/* Typewriter text luân phiên */}
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-6 h-10 flex items-center">
            <span className="text-[#22C55E] pr-2">
              {typedText}
            </span>
            <span className="w-1 h-7 bg-[#22C55E] animate-pulse inline-block" />
          </div>

          {/* Mô tả phụ */}
          <p className="text-gray-200 text-base sm:text-lg max-w-2xl leading-relaxed mb-10 font-normal">
            Tổng thầu tư vấn, thiết kế và thi công sân thể thao trọn gói. Đảm bảo chất lượng vật liệu 100% nhập khẩu Hàn Quốc, bảo hành toàn diện 5 năm.
          </p>

          {/* 2 Nút CTA Hành Động */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to={currentBanner?.ctaLink || '/lien-he'}
              className="px-8 py-4 sm:py-4.5 rounded-2xl bg-gradient-green text-white font-extrabold text-base tracking-wide shadow-xl shadow-green-600/30 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2.5"
            >
              <span>{currentBanner?.ctaText || 'Nhận báo giá miễn phí'}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to={currentBanner?.ctaSecondaryLink || '/du-an'}
              className="px-8 py-4 sm:py-4.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-base backdrop-blur-md hover:scale-105 active:scale-95 transition-all text-center"
            >
              {currentBanner?.ctaSecondaryText || 'Xem dự án đã thi công'}
            </Link>
          </div>
        </div>
      </div>

      {/* ======= DẢI SỐ LIỆU COUNTER (NẰM DƯỚI RÕ RÀNG, KHÔNG BỊ CHỒNG LẤN) ======= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-16">
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <CounterItem value={stats.projects} suffix="+" label="Công trình hoàn thành" started={counterStarted} />
          <CounterItem value={stats.years}    suffix="+"  label="Năm kinh nghiệm"       started={counterStarted} />
          <CounterItem value={stats.clients}  suffix="+"  label="Khách hàng tin cậy"    started={counterStarted} />
          <CounterItem value={stats.warranty} suffix="%"  label="Cam kết bảo hành"      started={counterStarted} />
        </div>

        {/* Thanh chuyển slide & Dots bên dưới Counter */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
              style={{ width: i === current ? 48 : 12 }}
            >
              <div className="absolute inset-0 bg-white/30" />
              {i === current && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#22C55E]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
                  key={current}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Nút Prev / Next 2 bên mép màn hình */}
      <button
        onClick={handlePrev}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/10 hover:bg-[#16A34A] border border-white/15 flex items-center justify-center text-white transition-all hidden xl:flex backdrop-blur-md cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/10 hover:bg-[#16A34A] border border-white/15 flex items-center justify-center text-white transition-all hidden xl:flex backdrop-blur-md cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
