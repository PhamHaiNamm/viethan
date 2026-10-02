/**
 * pages/admin/Banners.jsx – Quản lý banner hero slider
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title:'', subtitle:'', image:'', ctaText:'Nhận báo giá miễn phí', ctaLink:'/lien-he', ctaSecondaryText:'Xem dự án', ctaSecondaryLink:'/du-an', order:0, isActive:true };

export default function AdminBanners() {
  const qc = useQueryClient();
  const [showForm, setForm]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setData]   = useState(EMPTY);

  const { data, isLoading } = useQuery({ queryKey:['admin-banners'], queryFn: adminApi.getBanners });
  const banners = data?.data?.data || [];

  const createMut = useMutation({
    mutationFn: adminApi.createBanner,
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); setForm(false); toast.success('Đã tạo banner'); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateBanner(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); setForm(false); setEditing(null); toast.success('Đã cập nhật'); },
  });
  const deleteMut = useMutation({
    mutationFn: adminApi.deleteBanner,
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); toast.success('Đã xóa banner'); },
  });

  const openEdit   = (b) => { setData({...b}); setEditing(b._id); setForm(true); };
  const openCreate = () => { setData(EMPTY); setEditing(null); setForm(true); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing, data: formData });
    else createMut.mutate(formData);
  };

  const inp = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-[#16A34A] transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quản lý Banner Hero</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors">
          <Plus size={16} /> Thêm banner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setForm(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black text-gray-900 mb-5">{editing ? 'Sửa banner' : 'Thêm banner mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề *</label>
                <input className={inp} value={formData.title} onChange={e => setData(p=>({...p,title:e.target.value}))} required />
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Phụ đề</label>
                <input className={inp} value={formData.subtitle} onChange={e => setData(p=>({...p,subtitle:e.target.value}))} />
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">URL ảnh nền *</label>
                <input className={inp} value={formData.image} onChange={e => setData(p=>({...p,image:e.target.value}))} placeholder="https://images.unsplash.com/..." required />
              </div>
              {formData.image && <img src={formData.image} alt="preview" className="w-full h-32 object-cover rounded-xl" />}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Text CTA chính</label>
                  <input className={inp} value={formData.ctaText} onChange={e => setData(p=>({...p,ctaText:e.target.value}))} />
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Link CTA chính</label>
                  <input className={inp} value={formData.ctaLink} onChange={e => setData(p=>({...p,ctaLink:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Thứ tự</label>
                  <input className={inp} type="number" value={formData.order} onChange={e => setData(p=>({...p,order:Number(e.target.value)}))} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setData(p=>({...p,isActive:e.target.checked}))} className="accent-green-600" />
                    Hiển thị
                  </label>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D]">
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? [1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />) : banners.map((b) => (
          <div key={b._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                <div>
                  <p className="text-white font-bold text-sm">{b.title}</p>
                  <p className="text-gray-300 text-xs">{b.subtitle}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${b.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {b.isActive ? 'Hiển thị' : 'Ẩn'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-black/50 text-white">#{b.order}</span>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">{b.ctaText}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="text-gray-400 hover:text-blue-500"><Pencil size={15} /></button>
                <button onClick={() => { if (confirm('Xóa banner này?')) deleteMut.mutate(b._id); }} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
