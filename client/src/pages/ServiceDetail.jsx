/**
 * pages/ServiceDetail.jsx – Chi tiết từng dịch vụ chuyên sâu
 * Quy trình thi công chi tiết, thông số vật liệu, sidebar điều hướng & form tư vấn nhanh
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { 
  ArrowLeft, CheckCircle2, Phone, Mail, FileText, 
  ArrowRight, ShieldCheck, Clock, Award, ChevronRight 
} from 'lucide-react';

const FALLBACK_SERVICE_DETAILS = {
  'tu-van-khao-sat': {
    title: 'Tư Vấn & Khảo Sát Thực Địa',
    summary: 'Đội ngũ kỹ sư trực tiếp đo đạc trắc đạc, đánh giá địa chất nền móng và tư vấn phương án thiết kế tối ưu ngân sách.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    features: [
      'Khảo sát địa hình bằng máy thủy bình & trắc đạc laser chuyên dụng',
      'Đánh giá địa chất nền đất thịt, cát san lấp hoặc bùn ven biển Quảng Ninh',
      'Lập báo cáo hiện trạng và phương án xử lý thoát nước ngầm tối ưu',
      'Tư vấn mô hình kinh doanh & công suất khai thác hoàn vốn nhanh',
    ],
    process: [
      { step: '01', title: 'Tiếp nhận thông tin', desc: 'Ghi nhận tọa độ, diện tích ước lượng và nhu cầu loại sân của chủ đầu tư.' },
      { step: '02', title: 'Khảo sát hiện trường', desc: 'Kỹ sư có mặt trong 24h đo đạc cao độ tự nhiên và khả năng thoát nước xung quanh.' },
      { step: '03', title: 'Lập sơ đồ công năng', desc: 'Bố trí hướng sân tránh chói nắng (hướng Bắc - Nam), lối đi, nhà chờ, bãi đỗ xe.' },
      { step: '04', title: 'Dự toán sơ bộ', desc: 'Cung cấp bảng bóc tách khối lượng và ngân sách chi tiết từng hạng mục.' },
    ],
  },
  'thiet-ke-lap-ban-ve': {
    title: 'Thiết Kế & Lập Bản Vẽ 2D/3D',
    summary: 'Mô phỏng phối cảnh 3D trực quan, bản vẽ kỹ thuật chi tiết đạt tiêu chuẩn quốc tế FIFA, ITF, BWF.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    features: [
      'Bản vẽ mặt bằng tổng thể 2D tỷ lệ chuẩn xác 1:100',
      'Phối cảnh 3D ban ngày & ban đêm với hiệu ứng ánh sáng đèn LED',
      'Bản vẽ kết cấu móng bó vỉa, mương thoát nước, trụ hàng rào',
      'Sơ đồ tủ điện điều khiển và bố trí hệ thống tưới xả',
    ],
    process: [
      { step: '01', title: 'Lên layout 2D', desc: 'Quy hoạch phân khu sân, khán đài mini, căng tin dịch vụ hỗ trợ.' },
      { step: '02', title: 'Render 3D chi tiết', desc: 'Mô phỏng chất liệu cỏ, màu sơn sân, hệ thống rào chắn thực tế.' },
      { step: '03', title: 'Kiểm duyệt cùng khách hàng', desc: 'Chỉnh sửa tối đa 3 lần đến khi khách hàng hoàn toàn ưng ý.' },
      { step: '04', title: 'Xuất hồ sơ thi công', desc: 'Bàn giao trọn bộ file CAD, PDF phục vụ thi công và xin cấp phép.' },
    ],
  },
  'thi-cong-tron-goi': {
    title: 'Thi Công Trọn Gói Sân Thể Thao',
    summary: 'Thi công từ A đến Z: san lấp nền hạ, lu lèn đá base, trải cỏ nhân tạo / sơn sàn Acrylic, dựng rào và lắp đèn.',
    image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1200&q=80',
    features: [
      'Sử dụng máy lu rung 10-14 tấn bảo đảm độ chặt K95 - K98',
      'Vật liệu cỏ nhân tạo & sơn phủ nhập khẩu trực tiếp từ Hàn Quốc',
      'Máy rải cát & hạt cao su tự động tạo độ nảy chuẩn FIFA',
      'Hệ thống cột đèn ống kẽm nhúng nóng kháng muối biển',
    ],
    process: [
      { step: '01', title: 'Thi công nền hạ', desc: 'San gạt mặt bằng, lu lèn đá mạt, đá base và đúc bó vỉa bê tông bao quanh.' },
      { step: '02', title: 'Hệ thống thoát nước & rào', desc: 'Lắp đặt rãnh thoát nước xương cá và dựng cột đèn, cột rào.' },
      { step: '03', title: 'Hoàn thiện mặt sân', desc: 'Trải cỏ dán keo chuyên dụng, rải cát thạch anh hoặc sơn phủ Acrylic 6 lớp.' },
      { step: '04', title: 'Kiểm định & Nghiệm thu', desc: 'Đo độ nảy, kiểm tra chiếu sáng ban đêm, bàn giao hồ sơ hoàn công.' },
    ],
  },
  'bao-tri-sua-chua': {
    title: 'Bảo Trì & Phục Hồi Mặt Sân Định Kỳ',
    summary: 'Dịch vụ bảo dưỡng chuyên nghiệp: chải tơi ngọn cỏ, bổ sung hạt cao su, phục hồi màu sơn và thay thế lưới rách.',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    features: [
      'Máy đánh tơi ngọn cỏ chống bết dính sau thời gian dài sử dụng',
      'Bổ sung hạt cao su EPDM đều khắp mặt sân, khôi phục độ êm',
      'Dán vá các vết bong mép cỏ, đường line thi đấu',
      'Kiểm tra độ rò rỉ điện chiếu sáng và căng chỉnh lưới chắn bóng',
    ],
    process: [
      { step: '01', title: 'Đánh giá độ hao mòn', desc: 'Kiểm tra mật độ hạt cao su, độ mòn sợi cỏ hoặc vết nứt rạn mặt sơn.' },
      { step: '02', title: 'Vệ sinh hút bụi rác', desc: 'Làm sạch lá cây, bụi bẩn bám kẹt sâu trong gốc cỏ nhân tạo.' },
      { step: '03', title: 'Chải cỏ & Bổ sung hạt', desc: 'Máy chuyên dụng đánh ngọn cỏ đứng thẳng và phủ lớp hạt cao su đàn hồi mới.' },
      { step: '04', title: 'Bàn giao mặt sân mới', desc: 'Sân đạt lại 90-95% độ êm và thẩm mỹ như lúc mới thi công.' },
    ],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => publicApi.getServiceBySlug(slug),
  });

  const { data: allServicesData } = useQuery({
    queryKey: ['services'],
    queryFn: publicApi.getServices,
  });

  const apiService = data?.data?.data;
  const fallback = FALLBACK_SERVICE_DETAILS[slug] || FALLBACK_SERVICE_DETAILS['thi-cong-tron-goi'];
  const svc = apiService || fallback;
  const allServices = allServicesData?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>{svc.metaTitle || `${svc.title} – VietHan Sports`}</title>
        <meta name="description" content={svc.metaDescription || svc.summary} />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO ===== */}
        <section className="bg-[#0B1410] py-16 lg:py-24 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <Link
              to="/dich-vu"
              className="inline-flex items-center gap-2 text-green-400 mb-6 hover:text-green-300 text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Quay lại danh mục dịch vụ
            </Link>

            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 rounded-full bg-green-900/40 text-green-400 text-xs font-bold uppercase tracking-wider mb-4 border border-green-700/50">
                Dịch Vụ Chuyên Nghiệp
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {svc.title}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                {svc.summary}
              </p>
            </div>
          </div>
        </section>

        {/* ===== BODY CONTENT ===== */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* LEFT 2 COLUMNS: CONTENT */}
            <div className="lg:col-span-2 space-y-12">
              {/* Feature Banner Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[16/9] relative">
                <img
                  src={svc.image || fallback.image}
                  alt={svc.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rich Content or Overview */}
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Tổng quan dịch vụ
                </h2>
                {svc.content ? (
                  <div
                    className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: svc.content }}
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed text-base">
                    Với phương châm <em>"Kiến tạo sân chơi – Nâng tầm thể thao"</em>, dịch vụ <strong>{svc.title}</strong> của VietHan Sports được thực hiện dưới sự kiểm soát chặt chẽ của các kỹ sư Việt Nam và chuyên gia Hàn Quốc. Chúng tôi cam kết đem lại công trình có độ bền vượt trội, khả năng chống chịu điều kiện thời tiết khắc nghiệt tại Quảng Ninh và tối ưu chi phí đầu tư dài hạn.
                  </p>
                )}
              </div>

              {/* Điểm nổi bật & Cam kết */}
              {(svc.features || fallback.features)?.length > 0 && (
                <div className="bg-green-50/60 rounded-3xl p-8 border border-green-100">
                  <h3 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <ShieldCheck className="text-[#16A34A]" size={24} />
                    Tiêu chuẩn kỹ thuật cam kết
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(svc.features || fallback.features).map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quy trình thực hiện từng bước */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Quy trình triển khai 4 bước chuẩn hóa
                </h3>
                <div className="space-y-4">
                  {(fallback.process || []).map((step, si) => (
                    <div key={si} className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] text-white flex items-center justify-center font-black text-base shrink-0 shadow">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">{step.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY SIDEBAR */}
            <div className="space-y-8 sticky top-24">
              {/* Danh sách các dịch vụ khác */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-4 pb-3 border-b border-gray-100">
                  Các dịch vụ khác
                </h3>
                <div className="space-y-2">
                  {Object.entries(FALLBACK_SERVICE_DETAILS).map(([key, item]) => {
                    const isCurrent = key === slug;
                    return (
                      <Link
                        key={key}
                        to={`/dich-vu/${key}`}
                        className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                          isCurrent
                            ? 'bg-[#16A34A] text-white shadow'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#16A34A]'
                        }`}
                      >
                        <span className="truncate pr-2">{item.title}</span>
                        <ChevronRight size={16} className="shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Box hỗ trợ tư vấn 24/7 */}
              <div className="bg-[#0B1410] text-white rounded-3xl p-7 shadow-xl border border-green-500/20 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center mb-4">
                    <Phone size={22} className="text-white" />
                  </div>
                  <h3 className="font-black text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Cần tư vấn trực tiếp?
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-6">
                    Kỹ sư trưởng của chúng tôi trực máy 24/7 để giải đáp thắc mắc và hẹn lịch khảo sát thực địa miễn phí.
                  </p>

                  <a
                    href="tel:0901234567"
                    className="block text-center w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm rounded-xl transition-all shadow-lg mb-3"
                  >
                    Gọi Ngay: 0901 234 567
                  </a>

                  <Link
                    to="/lien-he"
                    className="block text-center w-full py-3.5 border border-white/20 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Gửi Yêu Cầu Báo Giá
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
