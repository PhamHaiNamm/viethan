/**
 * components/home/ContactFormSection.jsx
 * Form nhận báo giá nhanh trên trang chủ – Thiết kế cao cấp, thoáng đãng, inputs sang trọng
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Phone, Mail, MapPin, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { publicApi } from '../../services/api';
import { FIELD_TYPE_OPTIONS } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ContactFormSection() {
  const [form, setForm]         = useState({ fullName:'', phone:'', fieldType:'', area:'', note:'' });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên của bạn';
    if (!form.phone.trim())    errs.phone    = 'Vui lòng nhập số điện thoại liên hệ';
    else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.phone.replace(/\s/g,''))) errs.phone = 'Số điện thoại không đúng định dạng';
    if (!form.fieldType)       errs.fieldType = 'Vui lòng chọn loại hình sân';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await publicApi.createContact({ ...form, source: 'home-form' });
      setSuccess(true);
      setForm({ fullName:'', phone:'', fieldType:'', area:'', note:'' });
      toast.success('Gửi yêu cầu thành công! Kỹ sư sẽ liên hệ tư vấn trong 2 giờ.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
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
    <section id="contact-form" className="py-24 lg:py-36 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* CỘT TRÁI: THÔNG TIN (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5 shadow-sm">
              <Sparkles size={14} className="text-[#16A34A]" />
              Tư vấn & Khảo sát miễn phí
            </span>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Nhận báo giá <br />
              <span className="gradient-text">trong vòng 24 giờ</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
              Để lại thông tin kích thước và vị trí mảnh đất, các kỹ sư Việt – Hàn sẽ gửi dự toán chi tiết và bản vẽ phối cảnh sơ bộ hoàn toàn miễn phí.
            </p>

            {/* Thông tin liên hệ nhanh dạng thẻ trắng */}
            <div className="space-y-4">
              <a
                href="tel:0901234567"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-green-300 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-all shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Hotline kỹ sư trưởng (24/7)</div>
                  <div className="font-black text-gray-900 text-lg group-hover:text-[#16A34A] transition-colors">0901 234 567</div>
                </div>
              </a>

              <a
                href="mailto:info@viethansports.vn"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-green-300 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-all shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Email phòng dự án</div>
                  <div className="font-bold text-gray-900 text-base">info@viethansports.vn</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-150 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-[#16A34A] shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Địa chỉ trụ sở chính</div>
                  <div className="font-bold text-gray-900 text-sm leading-snug">123 Trần Quốc Nghiễn, P. Bãi Cháy, TP. Hạ Long</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CỘT PHẢI: FORM BÁO GIÁ (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            {success ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-150 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-[#16A34A] mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Gửi yêu cầu thành công!
                </h3>
                <p className="text-gray-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
                  Cảm ơn quý khách. Đội ngũ kỹ sư Việt – Hàn sẽ liên hệ lại trực tiếp qua số điện thoại để tư vấn chi tiết trong 2 giờ làm việc.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3.5 rounded-2xl bg-[#16A34A] text-white font-bold hover:bg-[#15803D] transition-all shadow-md"
                >
                  Gửi yêu cầu dự án khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-150 space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Yêu cầu báo giá thi công
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Điền thông tin bên dưới để nhận bảng dự toán bóc tách chi tiết</p>
                </div>

                {/* Họ tên & SĐT */}
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

                {/* Loại sân & Diện tích */}
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
                      <option value="">-- Chọn loại sân --</option>
                      {FIELD_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.fieldType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fieldType}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Diện tích dự kiến (m²)
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

                {/* Ghi chú */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Ghi chú thêm về hiện trạng đất / yêu cầu
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="VD: Vị trí đất tại Bãi Cháy, đất cát san lấp, cần làm cụm 2 sân..."
                    className={inputCls('note') + ' resize-none'}
                  />
                </div>

                {/* Nút gửi */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803D] hover:to-[#16A34A] text-white font-extrabold text-base tracking-wide hover:shadow-[0_10px_30px_rgba(22,163,74,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Gửi Yêu Cầu Nhận Báo Giá Miễn Phí
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] sm:text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-green-600" /> Bảo mật thông tin
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-green-600" /> Phản hồi trong 2 giờ
                  </span>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
