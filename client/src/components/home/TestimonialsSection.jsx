/**
 * components/home/TestimonialsSection.jsx
 * Carousel cảm nhận khách hàng – Card kính nổi trên nền tối, khoảng cách rộng rãi
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { publicApi } from '../../services/api';

const FALLBACK = [
  { _id:'1', name:'Anh Nguyễn Văn Hùng',  role:'Chủ đầu tư – Trung tâm TT Hòa Bình',   rating:5, content:'Việt – Hàn thi công đúng tiến độ cam kết. Mặt cỏ 5G Hàn Quốc sau 1 mùa mưa bão tại Quảng Ninh vẫn đứng thẳng và êm ái như mới. Đội ngũ kỹ sư trực tiếp giám sát rất cẩn thận!', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { _id:'2', name:'Chị Trần Thị Mai',      role:'Giám đốc Điều hành – Bãi Cháy Marina',  rating:5, content:'Cụm 4 sân pickleball ngoài trời đưa vào khai thác rất đông khách. Mặt sân bám giày, không trơn trượt sau mưa. Đặc biệt công trình bàn giao trước thời hạn 3 ngày!', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
  { _id:'3', name:'Ông Phạm Đức Thanh',    role:'Hiệu phó – Trường THPT Hạ Long',       rating:5, content:'Báo giá và hợp đồng minh bạch 100%, không phát sinh bất kỳ khoản nào. Sân bóng hoàn thiện dịp hè kịp cho các em học sinh bước vào năm học mới. Rất hài lòng về sự uy tín!', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { _id:'4', name:'Anh Lê Minh Quân',      role:'Ban Quản lý – KĐT Vinhomes Hạ Long',    rating:5, content:'Hệ thống chiếu sáng đèn LED thấu kính chống chói hoạt động rất tốt, không làm lóa mắt cư dân khi chơi ban đêm. Bảo hành hỗ trợ bảo dưỡng định kỳ rất chu đáo.', avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80' },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={18} className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
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

  useEffect(() => {
    intervalRef.current = setInterval(() => setIdx((p) => (p + 1) % items.length), 5500);
    return () => clearInterval(intervalRef.current);
  }, [items.length]);

  const go = (i) => {
    clearInterval(intervalRef.current);
    setIdx(i);
    intervalRef.current = setInterval(() => setIdx((p) => (p + 1) % items.length), 5500);
  };

  const handlePrev = () => go((idx - 1 + items.length) % items.length);
  const handleNext = () => go((idx + 1) % items.length);

  const current = items[idx];

  return (
    <section className="py-28 lg:py-36 bg-[#080E0B] relative overflow-hidden text-white">
      {/* Biểu tượng quote chìm nghệ thuật */}
      <div className="absolute top-12 right-12 text-white/[0.03] pointer-events-none">
        <Quote size={280} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-green-700/50 shadow-sm">
            <Sparkles size={14} />
            Đánh giá từ khách hàng
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Chủ đầu tư nói gì về <span className="gradient-text">VIỆT - HÀN</span>
          </h2>
        </motion.div>

        {/* Carousel Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-2xl relative"
            >
              <div className="mb-6">
                <StarRating rating={current?.rating || 5} />
              </div>

              <blockquote className="text-lg sm:text-2xl text-gray-200 leading-relaxed font-normal italic mb-10">
                "{current?.content}"
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <img
                  src={current?.avatar}
                  alt={current?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-green-500 shadow-md shrink-0"
                />
                <div>
                  <div className="font-black text-white text-base sm:text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {current?.name}
                  </div>
                  <div className="text-xs sm:text-sm text-green-400 font-semibold mt-0.5">
                    {current?.role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nút Prev / Next */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === idx ? 'w-10 bg-green-500 shadow-md shadow-green-500/50' : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#16A34A] text-white flex items-center justify-center transition-all shadow-sm"
                aria-label="Trước"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#16A34A] text-white flex items-center justify-center transition-all shadow-sm"
                aria-label="Tiếp"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
