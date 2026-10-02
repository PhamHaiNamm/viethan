/**
 * components/home/HeroBanner.jsx
 * =====================================================
 * Hero Banner động 100vh – Trái tim của trang chủ
 *
 * Tính năng:
 *  • Slider nền 4 ảnh, fade + Ken Burns tự động
 *  • Thanh tiến trình slider + nút prev/next
 *  • Text reveal từng từ bằng Framer Motion
 *  • Gradient text xanh–vàng
 *  • Typewriter luân phiên các loại sân
 *  • 2 nút CTA: glow pulse + outline
 *  • SVG vạch kẻ sân bóng tự vẽ (line-drawing)
 *  • Hạt nổi nhẹ với parallax theo chuột
 *  • Counter số liệu đếm tăng dần từ API
 *  • Mũi tên cuộn xuống nhấp nháy
 * =====================================================
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/api';
import useTypewriter from '../../hooks/useTypewriter';
import useCounter from '../../hooks/useCounter';

// -------------------------------------------------------
// Fallback banners nếu API chưa có dữ liệu
// -------------------------------------------------------
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
  'Sân bóng đá cỏ nhân tạo',
  'Sân Bóng rổ & Tennis',
  'Sân Pickleball chuyên nghiệp',
  'Sân Cầu lông tiêu chuẩn',
  'Tư vấn – Thiết kế – Thi công trọn gói',
];

const SLIDE_INTERVAL = 5500; // ms

// -------------------------------------------------------
// Sub-component: SVG vạch kẻ sân bóng
// -------------------------------------------------------
const FieldLines = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
    viewBox="0 0 1200 700"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Đường biên ngoài */}
    <rect x="100" y="80" width="1000" height="540" fill="none" stroke="white" strokeWidth="2" className="field-line" />
    {/* Đường giữa sân */}
    <line x1="600" y1="80" x2="600" y2="620" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '0.3s' }} />
    {/* Vòng tròn giữa */}
    <circle cx="600" cy="350" r="90" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '0.6s' }} />
    <circle cx="600" cy="350" r="8" fill="white" opacity="0.5" />
    {/* Khung thành trái */}
    <rect x="100" y="268" width="100" height="164" fill="none" stroke="white" strokeWidth="1.5" className="field-line" style={{ animationDelay: '0.9s' }} />
    <rect x="100" y="300" width="55" height="100" fill="none" stroke="white" strokeWidth="1.5" className="field-line" style={{ animationDelay: '1.1s' }} />
    {/* Khung thành phải */}
    <rect x="1000" y="268" width="100" height="164" fill="none" stroke="white" strokeWidth="1.5" className="field-line" style={{ animationDelay: '0.9s' }} />
    <rect x="1045" y="300" width="55" height="100" fill="none" stroke="white" strokeWidth="1.5" className="field-line" style={{ animationDelay: '1.1s' }} />
    {/* Chấm phạt đền */}
    <circle cx="220" cy="350" r="5" fill="white" opacity="0.5" />
    <circle cx="980" cy="350" r="5" fill="white" opacity="0.5" />
    {/* Góc sân */}
    <path d="M100,80 Q120,80 120,100" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '1.3s' }} />
    <path d="M1100,80 Q1080,80 1080,100" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '1.3s' }} />
    <path d="M100,620 Q120,620 120,600" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '1.3s' }} />
    <path d="M1100,620 Q1080,620 1080,600" fill="none" stroke="white" strokeWidth="2" className="field-line" style={{ animationDelay: '1.3s' }} />
  </svg>
);

// -------------------------------------------------------
// Sub-component: Hạt nổi (parallax theo chuột)
// -------------------------------------------------------
const FloatingParticles = ({ mouseX, mouseY }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size   = 6 + (i % 4) * 4;
        const depth  = 0.02 + (i % 5) * 0.01;   // parallax depth
        const initX  = 10 + (i * 67) % 80;
        const initY  = 5  + (i * 43) % 90;
        const delay  = i * 0.4;
        const dur    = 4 + (i % 4);

        return (
          <motion.div
            key={i}
            className="absolute rounded-full border border-green-400/30"
            style={{
              width: size,
              height: size,
              left: `${initX}%`,
              top: `${initY}%`,
              x: mouseX.get() * depth * 60,
              y: mouseY.get() * depth * 60,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
      {/* Vài hình cầu lớn hơn */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ball-${i}`}
          className="absolute rounded-full bg-green-500/5 border border-green-400/10"
          style={{
            width: 80 + i * 60,
            height: 80 + i * 60,
            left: `${20 + i * 30}%`,
            top: `${15 + i * 25}%`,
          }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear', delay: i * 3 }}
        />
      ))}
    </div>
  );
};

// -------------------------------------------------------
// Sub-component: Counter item
// -------------------------------------------------------
const CounterItem = ({ value, suffix, label, started }) => {
  const count = useCounter(value, 2200, started);
  return (
    <div className="text-center px-4">
      <div className="counter-number text-3xl md:text-4xl font-black">
        {count}{suffix}
      </div>
      <div className="text-gray-300 text-xs md:text-sm mt-1 font-medium">{label}</div>
    </div>
  );
};

// -------------------------------------------------------
// COMPONENT CHÍNH
// -------------------------------------------------------
export default function HeroBanner() {
  const [current, setCurrent]           = useState(0);
  const [prevIdx, setPrevIdx]           = useState(null);
  const [counterStarted, setCounter]    = useState(false);
  const intervalRef                     = useRef(null);

  // Parallax mouse
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    rawX.set((clientX - left - width  / 2) / (width  / 2));
    rawY.set((clientY - top  - height / 2) / (height / 2));
  }, [rawX, rawY]);

  // API data
  const { data: bannersData } = useQuery({
    queryKey: ['banners'],
    queryFn:  () => publicApi.getBanners(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn:  () => publicApi.getStats(),
    staleTime: 10 * 60 * 1000,
    onSuccess: () => setCounter(true),
  });

  const banners = bannersData?.data?.data?.length ? bannersData.data.data : FALLBACK_BANNERS;
  const stats   = statsData?.data?.data ?? { projects: 100, years: 10, clients: 50, warranty: 100 };

  // Kích hoạt counter sau 1.5s dù API chưa về
  useEffect(() => {
    const t = setTimeout(() => setCounter(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Auto slide
  const goNext = useCallback(() => {
    setPrevIdx(current);
    setCurrent((p) => (p + 1) % banners.length);
  }, [current, banners.length]);

  const goPrev = useCallback(() => {
    setPrevIdx(current);
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [current, banners.length]);

  const goTo = useCallback((idx) => {
    setPrevIdx(current);
    setCurrent(idx);
  }, [current]);

  useEffect(() => {
    intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [goNext]);

  // Reset interval khi bấm nút
  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
  }, [goNext]);

  const handlePrev = () => { goPrev(); resetInterval(); };
  const handleNext = () => { goNext(); resetInterval(); };
  const handleDot  = (i) => { goTo(i); resetInterval(); };

  const typedText = useTypewriter(TYPEWRITER_TEXTS, 70, 35, 1800);
  const currentBanner = banners[current];

  // Phân tách title thành words để reveal từng từ
  const titleWords = 'Kiến tạo sân chơi'.split(' ');

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#0B1410]"
      onMouseMove={handleMouseMove}
      aria-label="Hero Banner"
    >
      {/* ======= NỀN SLIDER ======= */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Ảnh nền + Ken Burns */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentBanner?.image}
              alt={currentBanner?.title || 'VietHan Sports'}
              className="w-full h-full object-cover kenburns"
              loading={current === 0 ? 'eager' : 'lazy'}
            />
          </div>
          {/* Lớp phủ gradient tối */}
          <div className="absolute inset-0 hero-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* ======= VẠCH KẺ SÂN SVG ======= */}
      <FieldLines />

      {/* ======= HẠT NỔI PARALLAX ======= */}
      <FloatingParticles mouseX={mouseX} mouseY={mouseY} />

      {/* ======= NỘI DUNG CHÍNH ======= */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl pt-16">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 text-green-400 text-sm font-semibold mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Công ty Việt – Hàn • Chuẩn thi công Hàn Quốc
          </motion.div>

          {/* Tiêu đề – text reveal từng từ */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-3 text-white"
                initial={{ opacity: 0, y: 50, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            {/* Gradient word */}
            <motion.span
              className="gradient-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              Nâng tầm thể thao
            </motion.span>
          </h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-200 font-medium mb-8 h-8 flex items-center"
          >
            <span className="text-[#22C55E] font-semibold">
              {typedText}
            </span>
            <span className="typewriter-cursor" aria-hidden="true" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
          >
            Tư vấn, thiết kế và thi công sân thể thao từ A–Z với vật liệu nhập khẩu Hàn Quốc.
            Bảo hành 5 năm – Tiến độ đảm bảo – Giá minh bạch.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to={currentBanner?.ctaLink || '/lien-he'}
              className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              {currentBanner?.ctaText || 'Nhận báo giá miễn phí'}
              <ArrowRight size={20} />
            </Link>
            <Link
              to={currentBanner?.ctaSecondaryLink || '/du-an'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 hover:border-white/70 transition-all backdrop-blur-sm"
            >
              {currentBanner?.ctaSecondaryText || 'Xem dự án'}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ======= COUNTER DẢI SỐ LIỆU ======= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="absolute bottom-20 left-0 right-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <CounterItem value={stats.projects} suffix="+" label="Công trình hoàn thành" started={counterStarted} />
            <CounterItem value={stats.years}    suffix="+"  label="Năm kinh nghiệm"       started={counterStarted} />
            <CounterItem value={stats.clients}  suffix="+"  label="Khách hàng tin tưởng"  started={counterStarted} />
            <CounterItem value={stats.warranty} suffix="%"  label="Cam kết bảo hành"      started={counterStarted} />
          </div>
        </div>
      </motion.div>

      {/* ======= CONTROLS SLIDER ======= */}

      {/* Thanh tiến trình + dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === current ? 40 : 12 }}
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

      {/* Nút Prev / Next */}
      <button
        onClick={handlePrev}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors hidden sm:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors hidden sm:flex"
      >
        <ChevronRight size={22} />
      </button>

      {/* ======= MŨI TÊN CUỘN XUỐNG ======= */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="scroll-arrow flex flex-col items-center gap-1 text-white/50 cursor-pointer hover:text-white/80 transition-colors"
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs tracking-widest">CUỘN XUỐNG</span>
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
}
