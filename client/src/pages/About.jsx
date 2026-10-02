/**
 * pages/About.jsx – Trang giới thiệu công ty
 * (Nội dung đầy đủ sẽ được bổ sung ở Phần 3)
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <>
      <Helmet>
        <title>Giới thiệu – VietHan Sports</title>
        <meta name="description" content="Câu chuyện, tầm nhìn sứ mệnh và thế mạnh Việt–Hàn của VietHan Sports." />
      </Helmet>
      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="bg-[#0B1410] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-4 border border-green-800/50"
            >
              Về chúng tôi
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-white mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Đối tác tin cậy trong{' '}
              <span className="gradient-text">thi công sân thể thao</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-gray-400 text-lg leading-relaxed"
            >
              VietHan Sports là công ty Việt–Hàn chuyên tư vấn, thiết kế và thi công sân thể thao
              theo tiêu chuẩn Hàn Quốc tại Hạ Long, Quảng Ninh và các tỉnh lân cận.
            </motion.p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Được thành lập bởi đội ngũ kỹ sư Việt Nam và chuyên gia Hàn Quốc với hơn 10 năm kinh nghiệm trong ngành thi công sân thể thao, VietHan Sports ra đời với sứ mệnh mang đến những công trình thể thao chất lượng cao, bền vững cho cộng đồng Hạ Long và Quảng Ninh.
              </p>
              <p className="text-gray-500 leading-relaxed mb-4">
                Chúng tôi tự hào là đơn vị đầu tiên tại Quảng Ninh áp dụng công nghệ thi công cỏ nhân tạo thế hệ 5G của Hàn Quốc – thân thiện môi trường, bền hơn và an toàn hơn cho người chơi.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Với hơn <strong className="text-[#16A34A]">100 công trình</strong> đã hoàn thành, từ sân bóng đá cỏ nhân tạo, sân pickleball, tennis đến đường chạy điền kinh, chúng tôi đã nhận được sự tin tưởng của nhiều khách hàng cá nhân, doanh nghiệp và cơ quan nhà nước.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1624880357913-a8539238245b?w=700&q=80"
                alt="VietHan Sports – Thi công sân bóng đá"
                className="w-full h-72 md:h-96 object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { title:'Tầm nhìn', icon:'🎯', desc:'Trở thành đơn vị thi công sân thể thao hàng đầu khu vực Đông Bắc Việt Nam, được biết đến với chất lượng chuẩn Hàn Quốc và dịch vụ khách hàng xuất sắc.' },
              { title:'Sứ mệnh', icon:'🏟️', desc:'Kiến tạo những không gian thể thao xanh, an toàn và bền vững – góp phần nâng cao sức khỏe cộng đồng và phát triển phong trào thể dục thể thao tại địa phương.' },
              { title:'Giá trị cốt lõi', icon:'⭐', desc:'Chất lượng – Uy tín – Minh bạch – Đồng hành. Bốn giá trị này định hướng mọi quyết định và hành động của đội ngũ VietHan Sports.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-black text-gray-900 text-xl mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Thế mạnh Việt-Hàn */}
        <section className="py-16 px-4 bg-[#0B1410]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Thế mạnh <span className="gradient-text">Việt – Hàn</span>
            </motion.h2>
            <p className="text-gray-400 mb-10">Sự kết hợp hoàn hảo giữa công nghệ Hàn Quốc và am hiểu thị trường Việt Nam</p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {[
                { flag:'🇰🇷', title:'Công nghệ Hàn Quốc', desc:'Vật liệu cỏ nhân tạo thế hệ 5G, quy trình thi công chuẩn FIFA, chứng nhận quốc tế, kiểm định chất lượng nghiêm ngặt.' },
                { flag:'🇻🇳', title:'Hiểu thị trường Việt', desc:'Am hiểu khí hậu nhiệt đới, thổ nhưỡng địa phương, quy chuẩn xây dựng Việt Nam và nhu cầu đặc thù của khách hàng trong nước.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}
                  className="glass-dark rounded-2xl p-6"
                >
                  <div className="text-3xl mb-3">{item.flag}</div>
                  <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
