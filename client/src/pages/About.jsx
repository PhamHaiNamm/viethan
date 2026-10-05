/**
 * pages/About.jsx – Trang giới thiệu công ty hoàn chỉnh
 * Chuẩn phong cách Việt – Hàn, chuyên nghiệp, hiện đại, uy tín
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Award, Users, CheckCircle2, ArrowRight, 
  Sparkles, Hammer, Cpu, Layers, HeartHandshake
} from 'lucide-react';

const LEADERSHIP_TEAM = [
  {
    name: 'Mr. Park Min-woo',
    role: 'Cố vấn Cấp cao & Chuyên gia Kỹ thuật (Hàn Quốc)',
    exp: '18 năm kinh nghiệm',
    desc: 'Nguyên kỹ sư trưởng tại Seoul Sports Facilities Corp, chuyên gia giám sát tiêu chuẩn FIFA Quality Pro tại Châu Á.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'KTS. Nguyễn Văn Thành',
    role: 'Giám đốc Điều hành & Kỹ sư Trưởng (Việt Nam)',
    exp: '14 năm kinh nghiệm',
    desc: 'Tốt nghiệp ĐH Xây dựng, chỉ đạo trực tiếp hơn 100 dự án sân cỏ nhân tạo và tổ hợp thể thao tại Quảng Ninh & miền Bắc.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
  {
    name: 'Mr. Kim Tae-sung',
    role: 'Chuyên gia Công nghệ Vật liệu Mặt sân',
    exp: '12 năm kinh nghiệm',
    desc: 'Phụ trách chuyển giao công nghệ sợi cỏ 5G không hạt cao su và sơn phủ acrylic đàn hồi chuẩn quốc tế ITF.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
  },
  {
    name: 'KS. Lê Hoàng Long',
    role: 'Chỉ huy trưởng Công trường Vùng Đông Bắc',
    exp: '10 năm kinh nghiệm',
    desc: 'Chuyên gia xử lý nền móng địa chất phức tạp tại vùng duyên hải ven biển Hạ Long, Cẩm Phả, Vân Đồn.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
];

const CERTIFICATIONS = [
  { code: 'FIFA Quality', desc: 'Mặt cỏ bóng đá nhân tạo đạt chuẩn thi đấu liên đoàn', icon: Award },
  { code: 'ITF Accredited', desc: 'Mặt sân tennis & pickleball tiêu chuẩn quốc tế', icon: ShieldCheck },
  { code: 'BWF Standard', desc: 'Mặt thảm vinyl sân cầu lông đàn hồi chống trượt', icon: Layers },
  { code: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng thi công nghiêm ngặt', icon: Cpu },
  { code: 'Eco-5G Turf', desc: 'Vật liệu không mùi độc hại, an toàn sức khỏe', icon: Sparkles },
];

const MACHINERY = [
  {
    title: 'Máy rải & chải cỏ tự động nhập khẩu Hàn Quốc',
    desc: 'Giúp ngọn cỏ đứng thẳng đều 100%, phân bổ cát thạch anh chuẩn xác đến từng milimet.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
  },
  {
    title: 'Hệ thống trắc đạc Laser cân bằng cao độ',
    desc: 'Đảm bảo độ dốc thoát nước tiêu chuẩn 0.4% - 0.6%, không bao giờ đọng vũng sau mưa lớn.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  },
  {
    title: 'Thiết bị đo độ đàn hồi mặt sân điện tử',
    desc: 'Kiểm tra độ nảy bóng, độ giảm chấn khớp gối theo đúng chỉ số thi đấu chuyên nghiệp.',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80',
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi – VIỆT - HÀN | Chuẩn Thi Công Hàn Quốc</title>
        <meta 
          name="description" 
          content="Tìm hiểu Công ty VIỆT - HÀN – Đơn vị tiên phong thi công sân thể thao chuẩn Hàn Quốc tại Hạ Long, Quảng Ninh. Đội ngũ chuyên gia Hàn-Việt, bảo hành 5 năm." 
        />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO SECTION ===== */}
        <section className="bg-[#0B1410] py-20 lg:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-yellow-500 rounded-full blur-[140px]" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-6 border border-green-700/50"
            >
              <Sparkles size={16} />
              Về Chúng Tôi – Công Ty VIỆT - HÀN
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Kiến tạo sân chơi chất lượng cao<br />
              <span className="gradient-text">Nâng tầm thể thao Việt</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Sự kết hợp tinh hoa giữa công nghệ, vật liệu bền bỉ chuẩn Hàn Quốc và kinh nghiệm thi công địa chất chuyên sâu tại Hạ Long, Quảng Ninh.
            </motion.p>
          </div>
        </section>

        {/* ===== STORY SECTION ===== */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest block mb-2">Hành trình phát triển</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-snug" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Từ khát vọng mang chuẩn thể thao quốc tế về Việt Nam
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-base">
                <p>
                  Được thành lập từ mối quan hệ hợp tác chiến lược giữa các chuyên gia cơ sở vật chất thể thao Seoul (Hàn Quốc) và đội ngũ kỹ sư xây dựng dày dặn kinh nghiệm tại Quảng Ninh, <strong className="text-gray-900">Công ty Việt – Hàn</strong> ra đời nhằm giải quyết bài toán nhức nhối: <em className="text-[#16A34A]">sân thể thao xuống cấp nhanh sau 1-2 mùa mưa bão miền biển.</em>
                </p>
                <p>
                  Chúng tôi nhận thấy khí hậu nhiệt đới ẩm gió mùa, độ mặn cao gần biển tại Hạ Long và Quảng Ninh đòi hỏi quy chuẩn thoát nước nền hạ và độ kháng tia cực tím (UV) của sợi cỏ nhân tạo, sơn sân Acrylic phải cao gấp 2 lần bình thường.
                </p>
                <p>
                  Bằng việc trực tiếp nhập khẩu vật liệu nguyên sinh từ các nhà máy danh tiếng tại Hàn Quốc cùng dây chuyền lu rung, máy trắc đạc laser chuyên dụng, chúng tôi tự tin bảo hành các công trình của mình lên đến <strong className="text-[#16A34A] font-bold">5 năm</strong>.
                </p>
              </div>

              {/* 3 cam kết nhanh */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="text-2xl font-black text-[#16A34A]">100+</div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Công trình bền đẹp</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-2xl">
                  <div className="text-2xl font-black text-amber-600">5 Năm</div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Bảo hành an tâm</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="text-2xl font-black text-blue-600">100%</div>
                  <div className="text-xs text-gray-600 font-medium mt-1">Đúng hẹn bàn giao</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80"
                  alt="Dự án sân thể thao Việt – Hàn"
                  className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Badge nổi bật */}
              <div className="absolute -bottom-6 -left-6 bg-[#0B1410] text-white p-6 rounded-3xl shadow-xl border border-green-500/30 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🇰🇷 🤝 🇻🇳</span>
                  <span className="font-bold text-sm">Tiêu Chuẩn Đồng Bộ</span>
                </div>
                <p className="text-xs text-gray-400">
                  Chuyển giao công nghệ trực tiếp từ Seoul, quản lý thi công tận tâm theo phong cách người Việt.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== TẦM NHÌN - SỨ MỆNH - GIÁ TRỊ CỐT LÕI ===== */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">Triết lý hoạt động</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Định hướng phát triển bền vững
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Tầm Nhìn',
                  icon: Award,
                  color: 'from-green-500 to-emerald-600',
                  desc: 'Trở thành tập đoàn thiết kế và thi công hạ tầng thể thao tiêu chuẩn hàng đầu Đông Bắc Bộ vào năm 2030, mở rộng thương hiệu trên toàn quốc.'
                },
                {
                  title: 'Sứ Mệnh',
                  icon: HeartHandshake,
                  color: 'from-amber-500 to-yellow-600',
                  desc: 'Cung cấp giải pháp trọn gói an tâm nhất cho các chủ đầu tư thể thao, mang lại không gian rèn luyện an toàn cho thế hệ trẻ và cộng đồng.'
                },
                {
                  title: 'Giá Trị Cốt Lõi',
                  icon: ShieldCheck,
                  color: 'from-blue-500 to-indigo-600',
                  desc: 'Kỷ luật thi công Hàn Quốc – Am hiểu địa chất Việt Nam – Minh bạch tài chính – Đồng hành bảo trì trọn đời dự án.'
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center group"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== ĐỘI NGŨ CHUYÊN GIA ===== */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">Nhân sự chất lượng cao</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Đội ngũ chuyên gia Việt – Hàn
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Mỗi mét vuông sân đều được tính toán và giám sát trực tiếp bởi các kỹ sư có thâm niên trong ngành.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all group"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {member.exp}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {member.name}
                  </h3>
                  <div className="text-xs text-[#16A34A] font-semibold mt-0.5 mb-2">
                    {member.role}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {member.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== THIẾT BỊ MÁY MÓC & CÔNG NGHỆ ===== */}
        <section className="py-20 bg-[#0B1410] text-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Năng lực thi công</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Hệ thống trang thiết bị hiện đại
              </h2>
              <p className="text-gray-400 mt-3 text-sm">
                Chúng tôi không thuê máy móc cũ kỹ – 100% trang thiết bị thi công được đầu tư đồng bộ và bảo dưỡng định kỳ.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {MACHINERY.map((item, i) => (
                <div key={i} className="glass-dark rounded-3xl overflow-hidden p-6 flex flex-col">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-5">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Tiêu chuẩn chứng nhận */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="text-center text-xs text-gray-400 uppercase tracking-widest mb-8">
                Tiêu chuẩn kỹ thuật cam kết tuân thủ
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {CERTIFICATIONS.map((cert, i) => {
                  const Icon = cert.icon;
                  return (
                    <div key={i} className="glass rounded-2xl p-4 flex flex-col items-center text-center">
                      <Icon size={24} className="text-[#22C55E] mb-2" />
                      <div className="font-black text-white text-sm">{cert.code}</div>
                      <div className="text-[11px] text-gray-400 mt-1 leading-tight">{cert.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Footer will render the floating CTA banner seamlessly */}
      </main>
    </>
  );
}
