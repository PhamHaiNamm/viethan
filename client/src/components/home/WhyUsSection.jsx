/**
 * components/home/WhyUsSection.jsx
 * Section "Tại sao chọn Việt – Hàn" – 6 lợi thế vượt trội trên nền tối sang trọng
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Award, Users, Wrench, Leaf, Sparkles } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: Award,
    title: 'Chuẩn Công Nghệ Hàn Quốc',
    desc: 'Vật liệu sợi cỏ 5G nguyên sinh và sơn phủ nhập khẩu trực tiếp từ Hàn Quốc, đạt chứng nhận FIFA, ITF, BWF quốc tế.',
    color: 'from-amber-500 to-yellow-400',
    iconColor: 'text-amber-300',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo Hành Toàn Diện 5 Năm',
    desc: 'Cam kết bảo hành kết cấu nền móng và mặt cỏ nhân tạo 5 năm, bảo trì kiểm tra định kỳ 6 tháng/lần miễn phí.',
    color: 'from-green-500 to-emerald-400',
    iconColor: 'text-green-300',
  },
  {
    icon: Clock,
    title: 'Bàn Giao Đúng Hạn 100%',
    desc: 'Ký kết hợp đồng tiến độ minh bạch. Cam kết phạt đền bù theo hợp đồng nếu chậm bàn giao ngày nào.',
    color: 'from-blue-500 to-cyan-400',
    iconColor: 'text-blue-300',
  },
  {
    icon: Users,
    title: 'Kỹ Sư Hàn – Việt Dày Dặn',
    desc: 'Đội ngũ chuyên gia kỹ thuật có hơn 10 năm kinh nghiệm thi công trên 100 công trình khắp Quảng Ninh & miền Bắc.',
    color: 'from-purple-500 to-indigo-400',
    iconColor: 'text-purple-300',
  },
  {
    icon: Wrench,
    title: 'Dự Toán Minh Bạch – Không Phát Sinh',
    desc: 'Bóc tách chi tiết từng hạng mục vật tư, báo giá trọn gói một lần duy nhất, thanh toán theo 4 đợt nghiệm thu.',
    color: 'from-rose-500 to-pink-400',
    iconColor: 'text-rose-300',
  },
  {
    icon: Leaf,
    title: 'Vật Liệu Xanh – Thân Thiện',
    desc: 'Cỏ nhân tạo không mùi hóa chất độc hại, thân thiện với môi trường và giảm thiểu tối đa chấn thương cho người chơi.',
    color: 'from-teal-500 to-green-400',
    iconColor: 'text-teal-300',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-28 lg:py-36 bg-[#080E0B] relative overflow-hidden text-white">
      {/* Hiệu ứng hào quang nền */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-green-500 blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-600 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-green-700/50 shadow-sm">
            <Sparkles size={14} />
            Tại sao chọn VIỆT - HÀN?
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Sự khác biệt{' '}
            <span className="gradient-text">tạo nên giá trị</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Hơn 10 năm kinh nghiệm và 100+ công trình hoàn thành – chúng tôi tự hào mang lại sự an tâm tuyệt đối cho các chủ đầu tư.
          </p>
        </motion.div>

        {/* Lưới 6 thẻ lợi thế */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {ADVANTAGES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl p-8 lg:p-9 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-green-400/40 shadow-2xl backdrop-blur-xl transition-all"
              >
                {/* Icon box */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}>
                  <Icon size={26} className="text-white" />
                </div>

                <h3
                  className="text-xl font-black text-white mb-3 group-hover:text-green-400 transition-colors leading-snug"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {item.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
