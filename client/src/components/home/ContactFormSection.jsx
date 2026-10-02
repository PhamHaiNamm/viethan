/**
 * components/home/ContactFormSection.jsx
 * Form báo giá nhanh trên trang chủ
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
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
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên';
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
      await publicApi.createContact({ ...form, source: 'home-form' });
      setSuccess(true);
      setForm({ fullName:'', phone:'', fieldType:'', area:'', note:'' });
      toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm.');
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
    `w-full px-4 py-3.5 rounded-xl border ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'} text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all`;

  return (
    <section id="contact-form" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT – Thông tin */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Liên hệ ngay
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Nhận báo giá{' '}
              <span className="gradient-text">miễn phí</span>
              <br />trong 24 giờ
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Để lại thông tin, đội ngũ chuyên gia VietHan Sports sẽ liên hệ tư vấn và gửi báo giá chi tiết theo đúng yêu cầu của bạn.
            </p>

            {/* Thông tin liên hệ nhanh */}
            <div className="space-y-4">
              <a href="tel:0901234567" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-[#16A34A] transition-colors">
                  <Phone size={20} className="text-[#16A34A] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Hotline</div>
                  <div className="font-bold text-gray-900">0901 234 567</div>
                </div>
              </a>
              <a href="mailto:info@viethansports.vn" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-[#16A34A] transition-colors">
                  <Mail size={20} className="text-[#16A34A] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-bold text-gray-900">info@viethansports.vn</div>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">
                  <MapPin size={20} className="text-[#16A34A]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Địa chỉ</div>
                  <div className="font-semibold text-gray-900 text-sm">Bãi Cháy, TP. Hạ Long, Quảng Ninh</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT – Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {success ? (
              <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
                <CheckCircle size={56} className="text-[#16A34A] mx-auto mb-5" />
                <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Gửi thành công!
                </h3>
                <p className="text-gray-500 mb-6">Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ làm việc.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 rounded-xl bg-[#16A34A] text-white font-bold hover:bg-[#15803D] transition-colors"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_8px_50px_rgba(0,0,0,0.08)] space-y-4"
              >
                <h3 className="text-xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Yêu cầu báo giá
                </h3>

                {/* Họ tên */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* SĐT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Loại sân */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Loại sân / Dịch vụ <span className="text-red-500">*</span>
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
                  {errors.fieldType && <p className="text-red-500 text-xs mt-1">{errors.fieldType}</p>}
                </div>

                {/* Diện tích */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Diện tích ước tính (m²)</label>
                  <input
                    type="number"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="VD: 1200"
                    min="0"
                    className={inputCls('area')}
                  />
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ghi chú thêm</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Địa điểm thi công, yêu cầu đặc biệt..."
                    className={inputCls('note') + ' resize-none'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold text-base hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Gửi yêu cầu báo giá
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Thông tin của bạn được bảo mật tuyệt đối. Chúng tôi không spam.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
