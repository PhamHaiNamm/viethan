/**
 * components/home/TestimonialsSection.jsx
 * Carousel cảm nhận khách hàng – tự chạy, có dot indicators
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { publicApi } from '../../services/api';

const FALLBACK = [
  { _id:'1', name:'Anh Nguyễn Văn Hùng',  role:'Chủ đầu tư – Trung tâm TT Hòa Bình',   rating:5, content:'VietHan Sports thi công đúng tiến độ, chất lượng cỏ rất tốt, sau 1 năm vẫn như mới. Đội thợ chuyên nghiệp, làm việc cẩn thận. Rất hài lòng!', avatar:'https://randomuser.me/api/portraits/men/32.jpg' },
  { _id:'2', name:'Chị Trần Thị Mai',      role:'Giám đốc – Bãi Cháy Marina Resort',     rating:5, content:'Cụm sân pickleball được khách rất ưa thích. Mặt sân đẹp, êm, không trượt. Công trình bàn giao trước hạn 3 ngày – điều rất hiếm thấy!', avatar:'https://randomuser.me/api/portraits/women/44.jpg' },
  { _id:'3', name:'Ông Phạm Đức Thanh',    role:'Phó Hiệu trưởng – THPT Hạ Long',        rating:5, content:'Tư vấn tận tâm, báo giá minh bạch không phát sinh. Sân hoàn thành dịp hè, kịp đưa vào sử dụng đầu năm học. Học sinh rất thích!', avatar:'https://randomuser.me/api/portraits/men/55.jpg' },
  { _id:'4', name:'Anh Lê Minh Quân',      role:'Ban Quản lý – Vinhomes Star Hạ Long',    rating:5, content:'Thái độ chuyên nghiệp, vật liệu chính hãng có kiểm định rõ ràng. Sân hoàn thành đúng thiết kế 3D đã duyệt. Rất đáng tiền!', avatar:'https://randomuser.me/api/portraits/men/67.jpg' },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
    ))}
  </div>
);

export default function TestimonialsSection() {
  const [idx, setIdx]   = useState(0);
  const intervalRef     = useRef(null);

  const { data } = useQuery({
    queryKey: ['testimonials'],
    queryFn: publicApi.getTestimonials,
    staleTime: 10 * 60 * 1000,
  });

  const items = data?.data?.data?.length ? data.data.data : FALLBACK;

  // Tự chạy
  useEffect(() => {
    intervalRef.current = setInterval(() => setIdx((p) => (p + 1) % items.length), 4500);
    return () => clearInterval(intervalRef.current);
  }, [items.length]);

  const go = (i) => {
    clearInterval(intervalRef.current);
    setIdx(i);
    intervalRef.current = setInterval(() => setIdx((p) => (p + 1) % items.length), 4500);
  };

  const current = items[idx];

  return (
    <section className="py-20 lg:py-28 bg-[#0B1410] relative overflow-hidden">
      {/* Trang trí */}
      <div className="absolute top-10 right-10 text-green-900/20 pointer-events-none">
        <Quote size={200} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-4 border border-green-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Khách hàng nói gì về chúng tôi?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Cảm nhận từ <span className="gradient-text">khách hàng</span>
          </h2>
        </motion.div>

        {/* Card */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45 }}
              className="glass-dark rounded-3xl p-8 sm:p-10"
            >
              <Quote size={36} className="text-[#22C55E]/30 mb-4" />
              <p className="text-gray-200 text-lg sm:text-xl leading-relaxed mb-8 italic">
                "{current?.content}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={current?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(current?.name)}&background=16a34a&color=fff`}
                  alt={current?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#22C55E]/40"
                  loading="lazy"
                />
                <div>
                  <div className="font-bold text-white text-sm">{current?.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{current?.role}</div>
                  <StarRating rating={current?.rating ?? 5} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => go((idx - 1 + items.length) % items.length)} className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-[#22C55E]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                aria-label={`Cảm nhận ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={() => go((idx + 1) % items.length)} className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
