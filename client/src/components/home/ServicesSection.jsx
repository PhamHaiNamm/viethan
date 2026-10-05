/**
 * components/home/ServicesSection.jsx
 * Section Dịch vụ thi công – Khoảng cách thoáng đãng, card nổi bật chuẩn cao cấp
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Wrench, PenTool, HardHat, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { publicApi } from '../../services/api';

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
  { _id:'1', title:'Tư vấn & Khảo sát',    icon:'MessageSquare', summary:'Kỹ sư trưởng trực tiếp đo đạc địa chất, trắc đạc laser và tư vấn phương án tối ưu chi phí.', slug:'tu-van-khao-sat' },
  { _id:'2', title:'Thiết kế & Lập bản vẽ', icon:'PenTool',       summary:'Lên phối cảnh 3D trực quan, bản vẽ kỹ thuật chi tiết đạt chuẩn thi đấu FIFA, ITF, BWF.', slug:'thiet-ke-lap-ban-ve' },
  { _id:'3', title:'Thi công trọn gói',      icon:'HardHat',       summary:'Thi công từ A đến Z: nền móng lu rung, mặt cỏ 5G Hàn Quốc, hệ thống rào và đèn LED chống chói.', slug:'thi-cong-tron-goi' },
  { _id:'4', title:'Bảo trì & Sửa chữa',    icon:'Settings',      summary:'Đánh tơi sợi cỏ, bổ sung hạt cao su, phục hồi sơn sàn và bảo hành toàn diện 5 năm.', slug:'bao-tri-sua-chua' },
];

export default function ServicesSection() {
  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: publicApi.getServices,
    staleTime: 10 * 60 * 1000,
  });

  const services = data?.data?.data?.length ? data.data.data : FALLBACK_SERVICES;

  return (
    <section id="services" className="py-24 lg:py-36 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 shadow-sm">
            <Sparkles size={14} className="text-[#16A34A]" />
            Dịch vụ của chúng tôi
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Giải pháp thi công{' '}
            <span className="gradient-text">toàn diện</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Từ bước tư vấn đầu tiên đến lúc bàn giao và bảo trì – Công ty Việt – Hàn luôn đồng hành cùng quý khách ở mọi giai đoạn với kỷ luật thi công cao nhất.
          </p>
        </motion.div>

        {/* Danh sách 4 thẻ Dịch vụ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8">
          {services.slice(0, 4).map((service, i) => {
            const IconComp = ICON_MAP[service.icon] || ICON_MAP.Wrench;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl p-8 lg:p-9 border border-gray-150 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(22,163,74,0.12)] hover:border-green-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Số thứ tự */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:from-[#16A34A] group-hover:to-[#22C55E] flex items-center justify-center text-[#16A34A] group-hover:text-white transition-all shadow-sm">
                      <IconComp size={26} />
                    </div>

                    <span
                      className="text-3xl font-black text-gray-200 group-hover:text-green-500/30 transition-colors select-none"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-black text-gray-900 mb-3 group-hover:text-[#16A34A] transition-colors leading-snug"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {service.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {service.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to={`/dich-vu/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#16A34A] group-hover:gap-3 transition-all"
                  >
                    Xem chi tiết <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nút Xem tất cả dịch vụ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16 lg:mt-20"
        >
          <Link
            to="/dich-vu"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-white border-2 border-[#16A34A] text-[#16A34A] font-bold text-sm sm:text-base hover:bg-[#16A34A] hover:text-white shadow-md hover:shadow-lg transition-all"
          >
            Xem tất cả dịch vụ & Bảng giá <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
