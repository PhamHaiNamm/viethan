/**
 * pages/Services.jsx – Trang dịch vụ tổng thể & giải pháp thi công sân thể thao
 * Bảng so sánh công nghệ độc quyền, báo giá tham khảo, FAQ accordion
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowRight, Check, X, ChevronDown, Sparkles, 
  HelpCircle, ShieldCheck, Zap, Ruler, Clock
} from 'lucide-react';
import { publicApi } from '../services/api';

const COMPARISON_DATA = [
  {
    criteria: 'Sợi cỏ nhân tạo',
    viethan: 'Sợi Kim Cương 5G nguyên sinh Hàn Quốc, kháng tia UV 8.000h, chống chẻ ngọn',
    standard: 'Sợi dẹt tái chế thông thường, nhanh gãy vụn sau 1-2 năm nắng gắt',
  },
  {
    criteria: 'Công nghệ lớp đế',
    viethan: 'Đế 3 lớp dệt Polyurethane chịu ngập nước, lỗ thoát nước 10cm/lỗ',
    standard: 'Đế 2 lớp bôi keo Latex mỏng, dễ bở mục khi ẩm thấp kéo dài',
  },
  {
    criteria: 'San ủi & Độ phẳng nền',
    viethan: 'Trắc đạc Laser tự động, độ dốc thoát nước chuẩn 0.5%, không đọng vũng',
    standard: 'Căn dây thủ công bằng mắt, dễ trũng đọng nước sau mưa',
  },
  {
    criteria: 'Hệ thống chiếu sáng',
    viethan: 'Đèn LED thể thao thấu kính chống chói 200W-400W, phủ quang đều mặt sân',
    standard: 'Đèn Metal Halide hoặc pha halogen thông thường, gây lóa mắt cầu thủ',
  },
  {
    criteria: 'Hệ thống hàng rào & Lưới',
    viethan: 'Trụ ống kẽm nhúng nóng chống rỉ muối biển, lưới cước nguyên sinh chống tia cực tím',
    standard: 'Sắt sơn chống gỉ thường, rỉ sét sau 1 năm ở vùng ven biển Quảng Ninh',
  },
  {
    criteria: 'Thời hạn bảo hành',
    viethan: '5 năm toàn diện cho mặt cỏ & nền móng, bảo trì định kỳ 6 tháng/lần',
    standard: '1-2 năm, chỉ bảo hành sợi cỏ bung rụng, không bảo hành sụt lún nền',
  },
];

const FAQS = [
  {
    q: 'Chi phí thi công trọn gói 1 sân bóng đá cỏ nhân tạo 7 người tại Hạ Long là bao nhiêu?',
    a: 'Chi phí trọn gói sân bóng 7 người (kích thước tiêu chuẩn khoảng 30m x 50m = 1.500m²) thường dao động từ 400 triệu đến 550 triệu VNĐ, tùy thuộc vào hiện trạng mặt bằng đất thịt hay cát san lấp, loại cỏ lựa chọn (sợi gân đơn hay sợi kim cương 5G) và hệ thống chiếu sáng.',
  },
  {
    q: 'Thời gian thi công một cụm sân thể thao hoàn chỉnh mất bao lâu?',
    a: 'Đối với sân bóng đá hoặc cụm 2-4 sân pickleball, thời gian từ lúc khởi công xử lý nền móng đến khi bàn giao đưa vào khai thác thường từ 20 đến 30 ngày (nếu thời tiết thuận lợi). Việt – Hàn có điều khoản bồi thường nếu chậm tiến độ cam kết.',
  },
  {
    q: 'Đất ven biển Hạ Long có làm sân thể thao được không?',
    a: 'Hoàn toàn được. Khu vực Bãi Cháy, Hòn Gai, Tuần Châu thường có nền cát san lấp hoặc bùn ven biển. Kỹ sư của Việt – Hàn sử dụng công nghệ trải vải địa kỹ thuật gia cường 2 lớp kết hợp lu lèn đá base phân tầng, giúp triệt tiêu nguy cơ sụt lún nứt gãy mặt sân.',
  },
  {
    q: 'Sân Pickleball và Tennis ngoài trời có cần bảo dưỡng thường xuyên không?',
    a: 'Sân pickleball và tennis ngoài trời dùng sơn phủ Acrylic đàn hồi cần quét dọn bụi cát hàng tuần và vệ sinh bề mặt định kỳ. Việt – Hàn hỗ trợ kiểm tra định kỳ miễn phí 6 tháng/lần trong suốt thời hạn bảo hành 5 năm.',
  },
  {
    q: 'Chính sách thanh toán khi ký hợp đồng thi công như thế nào?',
    a: 'Chúng tôi chia làm 4 đợt thanh toán minh bạch theo đúng tiến độ nghiệm thu thực tế: Đợt 1 tạm ứng 30% khi ký hợp đồng và tập kết máy móc; Đợt 2: 30% sau khi hoàn thành nền hạ lu lèn; Đợt 3: 30% sau khi trải cỏ/sơn mặt sân; Đợt 4: 10% thanh toán sau khi bàn giao nghiệm thu hoàn tất.',
  },
];

const SERVICES_PACKAGES = [
  {
    title: 'Sân Bóng Đá Cỏ Nhân Tạo',
    tag: 'Chuyên nghiệp – Chuẩn FIFA',
    types: 'Sân 5 người (20x40m), Sân 7 người (30x50m), Sân 11 người',
    price: 'Từ 280.000 đ/m²',
    features: ['Cỏ 5G nguyên sinh Hàn Quốc', 'Nền đá lu rung K95-K98', 'Đèn LED chống chói 200W', 'Lưới chắn bóng PE nguyên sinh'],
    link: '/du-an?category=bong-da',
    img: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=600&q=80',
  },
  {
    title: 'Cụm Sân Pickleball Thể Thao',
    tag: 'Xu hướng mới – Lợi nhuận cao',
    types: 'Sân đơn (6.1x13.4m), Cụm 2 - 8 sân trong nhà & ngoài trời',
    price: 'Từ 350.000 đ/m²',
    features: ['Mặt sơn Acrylic 6 lớp đàn hồi', 'Độ bám chống trượt công nghệ cao', 'Trụ lưới hợp kim tiêu chuẩn USAPA', 'Hàng rào bọc nhựa thẩm mỹ'],
    link: '/du-an?category=pickleball',
    img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
  },
  {
    title: 'Sân Tennis Chuẩn Thi Đấu',
    tag: 'Tiêu chuẩn ITF quốc tế',
    types: 'Sân đơn 10.97x23.77m, Sân giải đấu câu lạc bộ',
    price: 'Từ 380.000 đ/m²',
    features: ['Đệm giảm chấn cao su lót nền', 'Sơn phủ thể thao Decoturf kháng UV', 'Độ nảy bóng đồng nhất 100%', 'Chiếu sáng 500-750 Lux'],
    link: '/du-an?category=tennis',
    img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80',
  },
  {
    title: 'Sân Bóng Rổ & Cầu Lông',
    tag: 'Trường học & Trung tâm thể thao',
    types: 'Sân bóng rổ 15x28m, Sân cầu lông thảm Vinyl',
    price: 'Từ 320.000 đ/m²',
    features: ['Thảm Vinyl dập nổi chống trượt', 'Sơn sàn Epoxy/PU không độc hại', 'Trụ bóng rổ kính cường lực 12mm', 'Kẻ vạch thi đấu sắc nét'],
    link: '/du-an?category=bong-ro',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
  },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(0);

  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: publicApi.getServices,
  });

  const dbServices = servicesData?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Dịch Vụ Thi Công Sân Thể Thao – Việt – Hàn | Chuẩn Hàn Quốc</title>
        <meta 
          name="description" 
          content="Trọn gói tư vấn, thiết kế và thi công sân bóng đá cỏ nhân tạo, sân pickleball, tennis, bóng rổ tại Hạ Long, Quảng Ninh. Bảng giá minh bạch, bảo hành 5 năm." 
        />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO ===== */}
        <section className="bg-[#0B1410] py-20 lg:py-28 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-1/3 w-80 h-80 bg-green-500 rounded-full blur-[130px]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-6 border border-green-700/50">
              <Sparkles size={16} />
              Dịch Vụ & Giải Pháp Trọn Gói
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Giải pháp thi công sân thể thao<br />
              <span className="gradient-text">Chuẩn Công Nghệ Hàn Quốc</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Chúng tôi thực hiện từ khảo sát, thiết kế bản vẽ 3D, thi công hạ tầng đến bàn giao chìa khóa trao tay và đồng hành bảo trì trọn đời.
            </p>
          </div>
        </section>

        {/* ===== 4 GÓI DỊCH VỤ THI CÔNG NỔI BẬT ===== */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">Danh mục thi công</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Các loại sân thể thao thế mạnh
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Vật liệu nhập khẩu chính ngạch, quy chuẩn kỹ thuật đạt chuẩn quốc tế FIFA, ITF, BWF.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES_PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden relative">
                  <img
                    src={pkg.img}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#16A34A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                    {pkg.tag}
                  </div>
                </div>

                <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">{pkg.types}</p>

                    <div className="space-y-2 mb-6">
                      {pkg.features.map((feat, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check size={14} className="text-[#16A34A] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Đơn giá tham khảo</span>
                      <span className="font-bold text-[#16A34A] text-sm">{pkg.price}</span>
                    </div>
                    <Link
                      to="/lien-he"
                      className="px-4 py-2 bg-green-50 text-[#16A34A] font-bold text-xs rounded-xl hover:bg-[#16A34A] hover:text-white transition-all flex items-center gap-1.5"
                    >
                      Báo giá chi tiết <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== BẢNG SO SÁNH CÔNG NGHỆ ĐỘC QUYỀN ===== */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">Chất lượng tạo khác biệt</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                So sánh công nghệ Việt – Hàn vs Thi công thông thường
              </h2>
              <p className="text-gray-500 mt-3 text-sm sm:text-base">
                Tại sao các chủ sân bóng và resort hàng đầu Quảng Ninh luôn tin chọn Việt – Hàn?
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="p-5 font-bold text-gray-700 text-sm w-1/4">Hạng mục tiêu chuẩn</th>
                      <th className="p-5 font-black text-[#16A34A] text-base w-2/5 bg-green-50/60 border-x border-green-100">
                        <span className="flex items-center gap-2">
                          <ShieldCheck size={20} /> Việt – Hàn (Chuẩn Hàn Quốc)
                        </span>
                      </th>
                      <th className="p-5 font-bold text-gray-500 text-sm w-1/3">Thi công giá rẻ thông thường</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {COMPARISON_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-5 font-bold text-gray-800">{row.criteria}</td>
                        <td className="p-5 text-gray-900 font-medium bg-green-50/30 border-x border-green-100">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">✓</span>
                            <span>{row.viethan}</span>
                          </div>
                        </td>
                        <td className="p-5 text-gray-500">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 mt-0.5 text-xs">✕</span>
                            <span>{row.standard}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION (CÂU HỎI THƯỜNG GẶP) ===== */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">Giải đáp thắc mắc</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Câu hỏi thường gặp từ các chủ đầu tư
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-[#16A34A] bg-green-50/20 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900"
                  >
                    <span className="flex items-center gap-3 text-base">
                      <HelpCircle size={18} className={isOpen ? 'text-[#16A34A]' : 'text-gray-400'} />
                      {faq.q}
                    </span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#16A34A]' : 'text-gray-400'}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="py-16 px-4 bg-[#0B1410] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cần bản vẽ thiết kế 2D/3D & dự toán chi tiết?
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Để lại thông tin kích thước mảnh đất, đội ngũ kỹ sư sẽ gửi bản vẽ phối cảnh và bảng bóc tách khối lượng trong 24 giờ.
            </p>
            <Link
              to="/lien-he"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              Yêu Cầu Thiết Kế & Báo Giá Miễn Phí <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
