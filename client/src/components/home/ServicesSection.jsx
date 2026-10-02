/**
 * components/home/ServicesSection.jsx
 * Section dịch vụ với card glassmorphism + Framer Motion whileInView
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Wrench, PenTool, HardHat, Settings as SettingsIcon } from 'lucide-react';
import { publicApi } from '../../services/api';

// Map tên icon sang component
const ICON_MAP = {
  MessageSquare: ({ size }) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  PenTool: ({ size }) => <PenTool size={size} />,
  HardHat: ({ size }) => <HardHat size={size} />,
  Settings: ({ size }) => <SettingsIcon size={size} />,
  Wrench: ({ size }) => <Wrench size={size} />,
};

const FALLBACK_SERVICES = [
  { _id:'1', title:'Tư vấn & Khảo sát',    icon:'MessageSquare', summary:'Đội ngũ chuyên gia khảo sát thực địa, tư vấn phương án tối ưu cho từng dự án.', slug:'tu-van-khao-sat' },
  { _id:'2', title:'Thiết kế & Lập bản vẽ', icon:'PenTool',       summary:'Thiết kế 2D/3D chuyên nghiệp, đạt tiêu chuẩn kỹ thuật quốc tế FIFA, ITF, BWF.', slug:'thiet-ke-lap-ban-ve' },
  { _id:'3', title:'Thi công trọn gói',      icon:'HardHat',       summary:'Thi công từ A–Z: nền móng, mặt sân, hàng rào, chiếu sáng – bàn giao đúng hẹn.', slug:'thi-cong-tron-goi' },
  { _id:'4', title:'Bảo trì & Sửa chữa',    icon:'Settings',      summary:'Bảo trì định kỳ, sửa chữa kịp thời, bảo hành 5 năm toàn diện cho mặt sân.', slug:'bao-tri-sua-chua' },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ServicesSection() {
  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: publicApi.getServices,
    staleTime: 10 * 60 * 1000,
  });

  const services = data?.data?.data?.length ? data.data.data : FALLBACK_SERVICES;

  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Dịch vụ của chúng tôi
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Giải pháp thi công{' '}
            <span className="gradient-text">toàn diện</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Từ bước tư vấn đầu tiên đến lúc bàn giao và bảo trì – VietHan Sports đồng hành cùng bạn ở mọi giai đoạn.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service, i) => {
            const IconComp = ICON_MAP[service.icon] || ICON_MAP.Wrench;
            return (
              <motion.div
                key={service._id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group relative bg-white rounded-3xl p-7 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 hover:border-green-200 hover:shadow-[0_12px_40px_rgba(22,163,74,0.12)] transition-all cursor-pointer"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:from-[#16A34A] group-hover:to-[#22C55E] flex items-center justify-center text-[#16A34A] group-hover:text-white transition-all mb-5 shadow-sm">
                  <IconComp size={26} />
                </div>

                {/* Số thứ tự */}
                <div className="absolute top-5 right-6 text-4xl font-black text-gray-100 group-hover:text-green-50 transition-colors select-none">
                  0{i + 1}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 pr-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.summary}</p>

                <Link
                  to={`/dich-vu/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] hover:gap-3 transition-all"
                >
                  Xem chi tiết <ArrowRight size={15} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/dich-vu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-[#16A34A] text-[#16A34A] font-bold hover:bg-[#16A34A] hover:text-white transition-all"
          >
            Xem tất cả dịch vụ <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
