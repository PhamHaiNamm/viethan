/**
 * pages/admin/Login.jsx – Trang đăng nhập Admin
 */
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login, user } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShow]   = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Đăng nhập thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1410] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white flex items-center justify-center p-1 mx-auto mb-4 shadow-xl border border-white/20">
            <img src="/logo.jpg" alt="Việt – Hàn" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            VIỆT – <span className="text-[#22C55E]">HÀN</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Trang quản trị nội dung</p>
        </div>

        {/* Form */}
        <div className="glass-dark rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@viethan.vn"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#22C55E]/50 focus:bg-white/8 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#22C55E]/50 transition-all"
                />
                <button type="button" onClick={() => setShow(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold text-base hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all disabled:opacity-60 mt-2"
            >
              {loading ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Đăng nhập'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">© {new Date().getFullYear()} Công ty Việt – Hàn</p>
      </motion.div>
    </div>
  );
}
