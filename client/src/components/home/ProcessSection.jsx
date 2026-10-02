/**
 * components/home/ProcessSection.jsx
 * Quy trình 5 bước – timeline ngang trên desktop, dọc trên mobile
 */
import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { num: '01', title: 'Tiếp nhận yêu cầu', desc: 'Khách hàng liên hệ qua hotline, Zalo hoặc form trực tuyến. Chúng tôi phản hồi trong vòng 2 giờ.' },
  { num: '02', title: 'Khảo sát thực địa', desc: 'Kỹ sư đến tận nơi khảo sát địa hình, đo đạc diện tích và đánh giá điều kiện thi công.' },
  { num: '03', title: 'Thiết kế & Báo giá', desc: 'Lập bản vẽ kỹ thuật 2D/3D, báo giá chi tiết từng hạng mục, minh bạch và không phát sinh.' },
  { num: '04', title: 'Ký hợp đồng & Thi công', desc: 'Ký kết hợp đồng rõ ràng, triển khai thi công theo đúng tiến độ đã cam kết.' },
  { num: '05', title: 'Bàn giao & Bảo hành', desc: 'Nghiệm thu, bàn giao hồ sơ hoàn công. Bảo hành 5 năm và hỗ trợ bảo trì dài hạn.' },
];

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Quy trình làm việc
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            5 bước đến <span className="gradient-text">công trình hoàn hảo</span>
          </h2>
        </motion.div>

        {/* Timeline Desktop */}
        <div className="hidden lg:block relative">
          {/* Đường kẻ ngang */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] origin-left"
          />

          <div className="grid grid-cols-5 gap-4 relative">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.55 }}
                className="flex flex-col items-center text-center"
              >
                {/* Vòng tròn số */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-white border-4 border-[#22C55E] flex flex-col items-center justify-center shadow-[0_0_0_6px_rgba(34,197,94,0.1)] mb-6 group hover:bg-[#16A34A] transition-colors">
                  <span className="text-xs font-bold text-[#16A34A] group-hover:text-green-100">{step.num}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Mobile (dọc) */}
        <div className="lg:hidden relative pl-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#16A34A] to-[#22C55E]" />
          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-8 top-1 w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {i + 1}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
