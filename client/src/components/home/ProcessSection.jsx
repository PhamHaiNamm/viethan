/**
 * components/home/ProcessSection.jsx
 * Quy trình 5 bước thi công chuẩn hóa – Bố cục thoáng, timeline kết nối mạch lạc
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Tiếp nhận & Tư vấn', desc: 'Lắng nghe nhu cầu, vị trí đất và mục đích kinh doanh. Đưa ra tư vấn sơ bộ trong vòng 2 giờ.' },
  { num: '02', title: 'Khảo sát thực địa', desc: 'Kỹ sư đo đạc cao độ tự nhiên bằng máy laser, kiểm tra cốt nền và khả năng thoát nước xung quanh.' },
  { num: '03', title: 'Thiết kế 3D & Báo giá', desc: 'Dựng phối cảnh 3D trực quan, lập bảng bóc tách khối lượng dự toán minh bạch 100%.' },
  { num: '04', title: 'Thi công nghiệm thu', desc: 'Lu lèn nền đá K95-K98, trải mặt cỏ/sơn sàn tiêu chuẩn Hàn Quốc, dựng rào và đèn LED.' },
  { num: '05', title: 'Bàn giao & Bảo hành', desc: 'Bàn giao hồ sơ hoàn công, hướng dẫn bảo dưỡng định kỳ và bảo hành toàn diện 5 năm.' },
];

export default function ProcessSection() {
  return (
    <section className="py-24 lg:py-36 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 lg:mb-28"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={14} className="text-[#16A34A]" />
            Quy trình làm việc chuẩn hóa
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            5 bước đến <span className="gradient-text">công trình hoàn hảo</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Quy trình khép kín, minh bạch và chặt chẽ giúp bảo đảm chất lượng mặt sân và tiến độ bàn giao đúng hạn.
          </p>
        </motion.div>

        {/* Timeline Desktop */}
        <div className="hidden lg:block relative mb-12">
          {/* Đường kết nối ngang */}
          <div className="absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-green-500 via-[#16A34A] to-emerald-400 rounded-full opacity-30" />

          <div className="grid grid-cols-5 gap-6 relative">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Vòng tròn số thứ tự */}
                <div className="relative z-10 w-24 h-24 rounded-3xl bg-white border-2 border-green-500 flex flex-col items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#16A34A] transition-all mb-6 cursor-default">
                  <span
                    className="text-2xl font-black text-[#16A34A] group-hover:text-white transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {step.num}
                  </span>
                  <span className="text-[10px] text-gray-400 group-hover:text-green-100 font-bold uppercase tracking-wider">
                    Bước
                  </span>
                </div>

                <h3
                  className="text-lg font-black text-gray-900 mb-2.5 group-hover:text-[#16A34A] transition-colors leading-snug"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {step.title}
                </h3>

                <p className="text-gray-500 text-xs leading-relaxed px-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Mobile / Tablet (Dọc) */}
        <div className="lg:hidden space-y-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-150"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                <span className="font-black text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.num}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
