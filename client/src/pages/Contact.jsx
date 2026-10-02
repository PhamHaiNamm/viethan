/**
 * pages/Contact.jsx – Trang liên hệ đầy đủ với bản đồ
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '../services/api';
import { FIELD_TYPE_OPTIONS } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm]       = useState({ fullName:'', phone:'', email:'', fieldType:'', area:'', location:'', note:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});

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
      await publicApi.createContact({ ...form, source: 'contact-page' });
      setSuccess(true);
      toast.success('Gửi thành công! Chúng tôi sẽ liên hệ sớm.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const inp = (field) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-400' : 'border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all`;

  return (
    <>
      <Helmet>
        <title>Liên hệ & Báo giá miễn phí – VietHan Sports Hạ Long</title>
        <meta name="description" content="Liên hệ VietHan Sports để được tư vấn và nhận báo giá miễn phí thi công sân thể thao tại Hạ Long, Quảng Ninh." />
      </Helmet>
      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="bg-[#0B1410] py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Liên hệ & <span className="gradient-text">Báo giá</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Đội ngũ chuyên gia VietHan Sports sẵn sàng tư vấn và gửi báo giá miễn phí trong 24 giờ.
          </p>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

            {/* Info */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>Thông tin liên hệ</h2>
              <div className="space-y-5 mb-8">
                {[
                  { Icon: Phone,          label:'Hotline',     value:'0901 234 567',             href:'tel:0901234567' },
                  { Icon: MessageCircle,  label:'Zalo',        value:'0901 234 567',             href:'https://zalo.me/0901234567' },
                  { Icon: Mail,           label:'Email',       value:'info@viethansports.vn',    href:'mailto:info@viethansports.vn' },
                  { Icon: MapPin,         label:'Địa chỉ',     value:'123 Trần Quốc Nghiễn, P. Bãi Cháy, TP. Hạ Long, Quảng Ninh', href:null },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-[#16A34A]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="font-semibold text-gray-900 hover:text-[#16A34A] transition-colors">{value}</a>
                      ) : (
                        <span className="font-semibold text-gray-900 text-sm">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Maps */}
              <div className="rounded-3xl overflow-hidden shadow-lg h-72">
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

            {/* Form */}
            <div>
              {success ? (
                <div className="bg-white rounded-3xl p-10 shadow-lg text-center h-full flex flex-col items-center justify-center">
                  <CheckCircle size={56} className="text-[#16A34A] mb-5" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Gửi thành công!</h3>
                  <p className="text-gray-500 mb-6">Chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.</p>
                  <button onClick={() => setSuccess(false)} className="px-8 py-3 rounded-xl bg-[#16A34A] text-white font-bold">Gửi yêu cầu khác</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="bg-white rounded-3xl p-8 shadow-lg space-y-4">
                  <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Gửi yêu cầu báo giá</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ tên <span className="text-red-500">*</span></label>
                      <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" className={inp('fullName')} />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="0901 234 567" className={inp('phone')} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" className={inp('email')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại sân <span className="text-red-500">*</span></label>
                      <select name="fieldType" value={form.fieldType} onChange={handleChange} className={inp('fieldType') + ' cursor-pointer'}>
                        <option value="">-- Chọn loại --</option>
                        {FIELD_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      {errors.fieldType && <p className="text-red-500 text-xs mt-1">{errors.fieldType}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Diện tích (m²)</label>
                      <input type="number" name="area" value={form.area} onChange={handleChange} placeholder="VD: 1200" className={inp('area')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa điểm thi công</label>
                    <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="VD: Hạ Long, Quảng Ninh" className={inp('location')} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ghi chú thêm</label>
                    <textarea name="note" value={form.note} onChange={handleChange} rows={3} placeholder="Yêu cầu đặc biệt, thắc mắc..." className={inp('note') + ' resize-none'} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-60">
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> Gửi yêu cầu báo giá</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
