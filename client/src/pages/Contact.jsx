/**
 * pages/Contact.jsx – Trang liên hệ & Công cụ tính toán chi phí sơ bộ (Cost Estimator)
 * Bản đồ trụ sở Hạ Long, Form báo giá tự động kết nối API & gửi email
 */
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, 
  Calculator, Sparkles, Clock, ShieldCheck, ArrowRight 
} from 'lucide-react';
import { publicApi } from '../services/api';
import { FIELD_TYPE_OPTIONS, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

const ESTIMATOR_RATES = {
  'bong-da':    { basePricePerM2: 320000, name: 'Sân bóng đá cỏ nhân tạo', defaultArea: 1500 },
  'pickleball': { basePricePerM2: 360000, name: 'Sân Pickleball',          defaultArea: 400 },
  'tennis':     { basePricePerM2: 390000, name: 'Sân Tennis',              defaultArea: 650 },
  'bong-ro':    { basePricePerM2: 340000, name: 'Sân Bóng rổ',             defaultArea: 420 },
  'cau-long':   { basePricePerM2: 290000, name: 'Sân Cầu lông thảm Vinyl', defaultArea: 250 },
  'duong-chay': { basePricePerM2: 550000, name: 'Đường chạy hạt EPDM',     defaultArea: 1200 },
  'khac':       { basePricePerM2: 300000, name: 'Tổ hợp thể thao',         defaultArea: 800 },
};

export default function Contact() {
  // Form báo giá chính
  const [form, setForm]       = useState({ fullName:'', phone:'', email:'', fieldType:'bong-da', area:'', location:'', note:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});

  // Trạng thái cho công cụ tính toán dự toán sơ bộ (Estimator)
  const [calcType, setCalcType]     = useState('bong-da');
  const [calcArea, setCalcArea]     = useState(1500);
  const [addonLighting, setAddonLight] = useState(true);
  const [addonFence, setAddonFence]   = useState(true);
  const [addonDrain, setAddonDrain]   = useState(true);

  // Tính toán ngân sách ước tính
  const estimatedCost = useMemo(() => {
    const rate = ESTIMATOR_RATES[calcType] || ESTIMATOR_RATES['bong-da'];
    const base = Number(calcArea || 0) * rate.basePricePerM2;
    const lightCost = addonLighting ? 45000000 : 0;
    const fenceCost = addonFence ? 55000000 : 0;
    const drainCost = addonDrain ? 35000000 : 0;
    return base + lightCost + fenceCost + drainCost;
  }, [calcType, calcArea, addonLighting, addonFence, addonDrain]);

  // Nút đưa kết quả dự toán vào Form
  const applyEstimateToForm = () => {
    setForm((prev) => ({
      ...prev,
      fieldType: calcType,
      area: calcArea.toString(),
      note: `Dự toán ước tính: khoảng ${formatNumber(estimatedCost)} VNĐ (Bao gồm: ${addonLighting ? 'Đèn chiếu sáng, ' : ''}${addonFence ? 'Hàng rào, ' : ''}${addonDrain ? 'Rãnh thoát nước' : ''})`,
    }));
    toast.success('Đã nạp thông số tính toán vào form bên dưới!');
    document.getElementById('quote-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên của bạn';
    if (!form.phone.trim())    errs.phone    = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.phone.replace(/\s/g,''))) errs.phone = 'Số điện thoại không hợp lệ';
    if (!form.fieldType)       errs.fieldType = 'Vui lòng chọn loại dịch vụ';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await publicApi.createContact({ ...form, source: 'contact-page' });
      setSuccess(true);
      toast.success('Gửi yêu cầu báo giá thành công! Kỹ sư sẽ liên hệ với bạn trong 2 giờ.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi gửi yêu cầu, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const inp = (field) =>
    `w-full px-4 py-3.5 rounded-xl border ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all`;

  return (
    <>
      <Helmet>
        <title>Liên Hệ & Dự Toán Báo Giá – VietHan Sports Hạ Long</title>
        <meta
          name="description"
          content="Liên hệ tư vấn và sử dụng công cụ tính toán chi phí thi công sân thể thao sơ bộ của VietHan Sports tại Hạ Long, Quảng Ninh. Hotline 24/7."
        />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO ===== */}
        <section className="bg-[#0B1410] py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-[140px]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-6 border border-green-700/50">
              <Sparkles size={16} /> Tư Vấn Kỹ Thuật & Khảo Sát Miễn Phí
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Liên Hệ & <span className="gradient-text">Dự Toán Chi Phí</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Bạn có thể tự ước lượng chi phí sân thể thao của mình bên dưới hoặc gửi yêu cầu để nhận dự toán chi tiết kèm bản vẽ 3D từ các kỹ sư Việt – Hàn.
            </p>
          </div>
        </section>

        {/* ===== CÔNG CỤ TÍNH TOÁN CHI PHÍ SƠ BỘ (COST ESTIMATOR) ===== */}
        <section className="py-16 px-4 bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-[#16A34A]">
                  <Calculator size={22} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Công cụ ước lượng ngân sách thi công
                  </h2>
                  <p className="text-xs text-gray-500">Kéo chọn diện tích và loại sân để biết ngay chi phí dự kiến</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Các tùy chọn */}
                <div className="space-y-5">
                  {/* Chọn loại sân */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      1. Chọn loại công trình sân:
                    </label>
                    <select
                      value={calcType}
                      onChange={(e) => {
                        setCalcType(e.target.value);
                        setCalcArea(ESTIMATOR_RATES[e.target.value]?.defaultArea || 1000);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-800 text-sm focus:border-[#16A34A] focus:outline-none"
                    >
                      {Object.entries(ESTIMATOR_RATES).map(([key, item]) => (
                        <option key={key} value={key}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Diện tích slider + input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        2. Quy mô diện tích (m²):
                      </label>
                      <span className="text-base font-black text-[#16A34A]">{calcArea} m²</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="50"
                      value={calcArea}
                      onChange={(e) => setCalcArea(Number(e.target.value))}
                      className="w-full accent-green-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>100 m²</span>
                      <span>Sân 7 (1.500 m²)</span>
                      <span>10.000 m²</span>
                    </div>
                  </div>

                  {/* Các hạng mục phụ trợ đi kèm */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      3. Các hạng mục phụ trợ bao gồm:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={addonLighting}
                          onChange={(e) => setAddonLight(e.target.checked)}
                          className="w-4 h-4 accent-green-600 rounded"
                        />
                        <span className="text-xs font-medium text-gray-700">Hệ thống cột & Đèn LED thể thao chuyên dụng (+45tr)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={addonFence}
                          onChange={(e) => setAddonFence(e.target.checked)}
                          className="w-4 h-4 accent-green-600 rounded"
                        />
                        <span className="text-xs font-medium text-gray-700">Hàng rào kẽm nhúng nóng & Lưới cước PE chắn bóng (+55tr)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={addonDrain}
                          onChange={(e) => setAddonDrain(e.target.checked)}
                          className="w-4 h-4 accent-green-600 rounded"
                        />
                        <span className="text-xs font-medium text-gray-700">Mương & Ống thoát nước xương cá ngầm (+35tr)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Kết quả tính toán & Nút áp dụng */}
                <div className="bg-[#0B1410] text-white rounded-2xl p-7 flex flex-col justify-between h-full border border-green-500/20">
                  <div>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-wider block mb-1">
                      Tổng ngân sách dự toán sơ bộ
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      ~ {formatNumber(estimatedCost)} <span className="text-lg text-green-400">VNĐ</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">
                      * Đơn giá đã bao gồm vật liệu tiêu chuẩn Hàn Quốc, lu lèn nền móng và công thi công hoàn thiện trọn gói. Đơn giá thực tế có thể thay đổi sau khi khảo sát nền đất cụ thể.
                    </p>

                    <div className="space-y-2 py-4 border-y border-white/10 text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#22C55E]" />
                        <span>Bảo hành toàn diện 5 năm mặt sân & nền hạ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#22C55E]" />
                        <span>Thời gian hoàn thành ước tính: 20 - 28 ngày</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={applyEstimateToForm}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold text-sm rounded-xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    Dùng số liệu này để gửi báo giá <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== THÔNG TIN LIÊN HỆ & FORM GỬI YÊU CẦU ===== */}
        <section id="quote-form-section" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* THÔNG TIN VĂN PHÒNG & BẢN ĐỒ */}
            <div>
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest block mb-2">Trụ sở chính</span>
              <h2 className="text-3xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                VietHan Sports tại Hạ Long, Quảng Ninh
              </h2>

              <div className="space-y-4 mb-8">
                {[
                  { Icon: MapPin, label: 'Địa chỉ trụ sở', value: '123 Đường Trần Quốc Nghiễn, P. Bãi Cháy, TP. Hạ Long, Quảng Ninh' },
                  { Icon: Phone, label: 'Hotline tư vấn 24/7', value: '0901 234 567', href: 'tel:0901234567' },
                  { Icon: MessageCircle, label: 'Zalo kỹ sư trưởng', value: '0901 234 567 (Tư vấn kỹ thuật)', href: 'https://zalo.me/0901234567' },
                  { Icon: Mail, label: 'Email phòng dự án', value: 'info@viethansports.vn', href: 'mailto:info@viethansports.vn' },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-[#16A34A]">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{label}</div>
                      {href ? (
                        <a href={href} className="font-bold text-gray-900 hover:text-[#16A34A] text-base transition-colors">
                          {value}
                        </a>
                      ) : (
                        <span className="font-semibold text-gray-900 text-sm leading-relaxed">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Nhúng Google Maps Hạ Long */}
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-80 relative">
                <iframe
                  title="VietHan Sports – Hạ Long, Quảng Ninh"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59597.41!2d107.04!3d20.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5816c31f1e99%3A0xd03d2e0a764a65d0!2zSOG6oSBMb25n!5e0!3m2!1svi!2svn!4v1234567890!5m2!1svi!2svn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* FORM GỬI YÊU CẦU BÁO GIÁ */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
              {success ? (
                <div className="py-12 text-center">
                  <CheckCircle size={64} className="text-[#16A34A] mx-auto mb-5 animate-bounce" />
                  <h3 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Yêu cầu đã được tiếp nhận!
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                    Kỹ sư trưởng VietHan Sports sẽ gọi lại trong 2 giờ để tư vấn chi tiết và gửi bản vẽ phối cảnh sơ bộ.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3.5 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-[#15803D] transition-all"
                  >
                    Gửi yêu cầu dự án khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Đăng ký khảo sát & Báo giá
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Kỹ sư sẽ trực tiếp tới đo đạc thực địa và tư vấn hướng sân miễn phí.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className={inp('fullName')}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0901 234 567"
                        className={inp('phone')}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Địa chỉ Email (Nhận file dự toán & bản vẽ)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className={inp('email')}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Loại sân cần thi công <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="fieldType"
                        value={form.fieldType}
                        onChange={handleChange}
                        className={inp('fieldType') + ' cursor-pointer'}
                      >
                        {FIELD_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.fieldType && <p className="text-red-500 text-xs mt-1">{errors.fieldType}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Diện tích ước tính (m²)
                      </label>
                      <input
                        type="number"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        placeholder="VD: 1500"
                        className={inp('area')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Địa điểm dự kiến thi công
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="VD: Phường Bãi Cháy, TP. Hạ Long"
                      className={inp('location')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Ghi chú / Yêu cầu cụ thể
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows={3}
                      placeholder="VD: Đất thịt chưa san lấp, cần hoàn thành trước ngày 30..."
                      className={inp('note') + ' resize-none'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold text-base hover:scale-[1.02] active:scale-[0.99] transition-all shadow-lg shadow-green-600/30 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Gửi Yêu Cầu Báo Giá & Khảo Sát
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-gray-400 mt-2">
                    🔒 Cam kết bảo mật 100% số điện thoại của quý khách. Không spam cuộc gọi.
                  </p>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
