/**
 * pages/Contact.jsx – Trang liên hệ & Đăng ký báo giá thi công
 * Thông tin trụ sở Hạ Long, Bản đồ Google Maps tương tác và Form báo giá gửi trực tiếp về hệ thống
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, 
  Sparkles, ShieldCheck, Clock 
} from 'lucide-react';
import { publicApi } from '../services/api';
import { FIELD_TYPE_OPTIONS } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm]       = useState({ fullName:'', phone:'', email:'', fieldType:'bong-da', area:'', location:'', note:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên của bạn';
    if (!form.phone.trim())    errs.phone    = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.phone.replace(/\s/g,''))) errs.phone = 'Số điện thoại không hợp lệ';
    if (!form.fieldType)       errs.fieldType = 'Vui lòng chọn loại dịch vụ sân';
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
      toast.success('Gửi yêu cầu báo giá thành công! Kỹ sư sẽ liên hệ với bạn trong vòng 2 giờ.');
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

  const inputCls = (field) =>
    `w-full px-5 py-4 rounded-2xl border ${
      errors[field] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-gray-50/70 focus:bg-white'
    } text-gray-900 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-[#16A34A] transition-all`;

  return (
    <>
      <Helmet>
        <title>Liên Hệ & Báo Giá Thi Công – VIỆT - HÀN Hạ Long</title>
        <meta
          name="description"
          content="Liên hệ tư vấn, khảo sát thực địa miễn phí và nhận báo giá thi công sân bóng đá cỏ nhân tạo, pickleball, tennis của Công ty VIỆT - HÀN tại Hạ Long, Quảng Ninh. Hotline 24/7."
        />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO ===== */}
        <section className="bg-[#080E0B] py-24 lg:py-32 px-4 text-center relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500 rounded-full blur-[160px]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-green-700/50 shadow-sm">
              <Sparkles size={14} /> Tư Vấn Kỹ Thuật & Khảo Sát Miễn Phí
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Liên Hệ & <span className="gradient-text">Báo Giá Thi Công</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Đội ngũ chuyên gia Việt – Hàn sẵn sàng có mặt khảo sát thực địa tại Hạ Long, Cẩm Phả, Uông Bí và toàn tỉnh Quảng Ninh trong 24 giờ.
            </p>
          </div>
        </section>

        {/* ===== THÔNG TIN LIÊN HỆ & FORM BÁO GIÁ ===== */}
        <section id="quote-form-section" className="py-24 lg:py-36 px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* CỘT TRÁI: THÔNG TIN VĂN PHÒNG & BẢN ĐỒ (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest block mb-2">Trụ sở chính</span>
                <h2 className="text-3xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Công ty VIỆT - HÀN tại Hạ Long, Quảng Ninh
                </h2>

                <div className="space-y-4">
                  {[
                    { Icon: MapPin, label: 'Địa chỉ trụ sở', value: '123 Đường Trần Quốc Nghiễn, P. Bãi Cháy, TP. Hạ Long, Quảng Ninh' },
                    { Icon: Phone, label: 'Hotline tư vấn kỹ thuật (24/7)', value: '0901 234 567', href: 'tel:0901234567' },
                    { Icon: MessageCircle, label: 'Zalo kỹ sư trưởng', value: '0901 234 567 (Chat trực tiếp)', href: 'https://zalo.me/0901234567' },
                    { Icon: Mail, label: 'Email phòng dự án', value: 'info@viethansports.vn', href: 'mailto:info@viethansports.vn' },
                  ].map(({ Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-green-300 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-[#16A34A]">
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
                        {href ? (
                          <a href={href} className="font-bold text-gray-900 hover:text-[#16A34A] text-base transition-colors">
                            {value}
                          </a>
                        ) : (
                          <span className="font-bold text-gray-900 text-sm leading-snug">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhúng Google Maps Hạ Long */}
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-80 relative">
                <iframe
                  title="Công ty Việt – Hàn – Hạ Long, Quảng Ninh"
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

            {/* CỘT PHẢI: FORM GỬI YÊU CẦU BÁO GIÁ (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-150">
              {success ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-[#16A34A] mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Yêu cầu đã được tiếp nhận!
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                    Kỹ sư trưởng Việt – Hàn sẽ gọi lại trong 2 giờ để tư vấn chi tiết và gửi bản vẽ phối cảnh sơ bộ.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3.5 bg-[#16A34A] text-white font-bold rounded-2xl hover:bg-[#15803D] transition-all shadow-md"
                  >
                    Gửi yêu cầu dự án khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Đăng ký khảo sát & Nhận báo giá
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Kỹ sư sẽ trực tiếp tới đo đạc thực địa và lập bảng bóc tách khối lượng chi tiết
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
                        className={inputCls('fullName')}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
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
                        className={inputCls('phone')}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
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
                      className={inputCls('email')}
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
                        className={inputCls('fieldType') + ' cursor-pointer'}
                      >
                        {FIELD_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.fieldType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fieldType}</p>}
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
                        min="0"
                        className={inputCls('area')}
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
                      className={inputCls('location')}
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
                      className={inputCls('note') + ' resize-none'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803D] hover:to-[#16A34A] text-white font-extrabold text-base tracking-wide hover:shadow-[0_10px_30px_rgba(22,163,74,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-green-600/30"
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

                  <div className="flex items-center justify-center gap-6 pt-2 text-[11px] sm:text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-green-600" /> Cam kết bảo mật thông tin
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-green-600" /> Phản hồi trong 2 giờ
                    </span>
                  </div>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
