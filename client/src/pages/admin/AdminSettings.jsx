/**
 * pages/admin/AdminSettings.jsx – Cài đặt chung công ty
 */
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, publicApi } from '../../services/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey:['settings'], queryFn: publicApi.getSettings });
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data?.data?.data) setForm(data.data.data);
  }, [data]);

  const updateMut = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => { qc.invalidateQueries(['settings']); toast.success('Đã lưu cài đặt'); },
    onError: () => toast.error('Lỗi khi lưu cài đặt'),
  });

  if (isLoading || !form) return <div className="text-gray-400 text-center py-20">Đang tải...</div>;

  const inp = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-[#16A34A] transition-all';
  const handleSubmit = (e) => { e.preventDefault(); updateMut.mutate(form); };
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));
  const setStat = (key) => (e) => setForm(p => ({ ...p, stats: { ...p.stats, [key]: Number(e.target.value) } }));
  const setSocial = (key) => (e) => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Cài đặt chung</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Thông tin công ty */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Thông tin công ty</h2>
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Tên công ty</label>
              <input className={inp} value={form.companyName || ''} onChange={set('companyName')} />
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Slogan</label>
              <input className={inp} value={form.slogan || ''} onChange={set('slogan')} />
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ</label>
              <input className={inp} value={form.address || ''} onChange={set('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Hotline</label>
                <input className={inp} value={form.hotline || ''} onChange={set('hotline')} />
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Zalo</label>
                <input className={inp} value={form.zalo || ''} onChange={set('zalo')} />
              </div>
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input className={inp} type="email" value={form.email || ''} onChange={set('email')} />
            </div>
          </div>
        </div>

        {/* Số liệu thống kê */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Số liệu thống kê (counter trên trang chủ)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Công trình hoàn thành</label>
              <input className={inp} type="number" value={form.stats?.projects || 0} onChange={setStat('projects')} />
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Năm kinh nghiệm</label>
              <input className={inp} type="number" value={form.stats?.years || 0} onChange={setStat('years')} />
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Khách hàng tin tưởng</label>
              <input className={inp} type="number" value={form.stats?.clients || 0} onChange={setStat('clients')} />
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">% Bảo hành</label>
              <input className={inp} type="number" value={form.stats?.warranty || 100} onChange={setStat('warranty')} />
            </div>
          </div>
        </div>

        {/* Mạng xã hội */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Mạng xã hội</h2>
          <div className="space-y-3">
            {['facebook','youtube','zalo','tiktok'].map(key => (
              <div key={key}><label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">{key}</label>
                <input className={inp} value={form.socialLinks?.[key] || ''} onChange={setSocial(key)} placeholder={`https://${key}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={updateMut.isPending}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold hover:scale-105 transition-all disabled:opacity-60">
          <Save size={18} /> {updateMut.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </form>
    </div>
  );
}
