/**
 * components/home/WhyUsSection.jsx
 * Section "Vì sao chọn chúng tôi" – 6 lợi thế trên nền tối
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Users, Wrench, Leaf } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: Award,
    title: 'Chuẩn Hàn Quốc',
    desc: 'Vật liệu và quy trình thi công nhập khẩu từ Hàn Quốc, đạt chứng nhận FIFA, ITF, BWF quốc tế.',
    color: 'from-yellow-500 to-orange-400',
  },
  {
    icon: Shield,
    title: 'Bảo hành 5 năm',
    desc: 'Cam kết bảo hành toàn diện 5 năm cho mặt cỏ, 2 năm cho hệ thống chiếu sáng và hàng rào.',
    color: 'from-green-500 to-emerald-400',
  },
  {
    icon: Clock,
    title: 'Đúng tiến độ',
    desc: 'Ký kết hợp đồng tiến độ rõ ràng. Bồi thường theo hợp đồng nếu chậm tiến độ – không có ngoại lệ.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Users,
    title: 'Đội ngũ chuyên nghiệp',
    desc: 'Kỹ sư và thợ lành nghề được đào tạo bài bản, có kinh nghiệm thi công hơn 100 công trình.',
    color: 'from-purple-500 to-violet-400',
  },
  {
    icon: Wrench,
    title: 'Giá minh bạch',
    desc: 'Báo giá chi tiết từng hạng mục, không phát sinh chi phí ngoài hợp đồng. Thanh toán theo tiến độ.',
    color: 'from-rose-500 to-pink-400',
  },
  {
    icon: Leaf,
    title: 'Thân thiện môi trường',
    desc: 'Vật liệu cỏ nhân tạo thế hệ 5G không cần hạt cao su, thân thiện với người dùng và môi trường.',
    color: 'from-teal-500 to-green-400',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B1410] relative overflow-hidden">
      {/* Trang trí nền */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-green-500 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-green-600 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-4 border border-green-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Tại sao chọn VietHan Sports?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Sự khác biệt{' '}
            <span className="gradient-text">tạo nên giá trị</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            10 năm kinh nghiệm, 100+ công trình hoàn thành – chúng tôi biết cách làm hài lòng khách hàng khó tính nhất.
          </p>
        </motion.div>

        {/* Grid 6 lợi thế */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVANTAGES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark rounded-3xl p-7 group cursor-default"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
