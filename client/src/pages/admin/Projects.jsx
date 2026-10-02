/**
 * pages/admin/Projects.jsx – Quản lý dự án
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { CATEGORY_MAP } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY = { title:'', category:'bong-da', location:'Hạ Long, Quảng Ninh', area:'', year: new Date().getFullYear(), client:'', description:'', thumbnail:'', featured:false, isPublished:true };

export default function AdminProjects() {
  const qc = useQueryClient();
  const [showForm, setForm]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setData]   = useState(EMPTY);

  const { data, isLoading } = useQuery({ queryKey:['admin-projects'], queryFn: adminApi.getProjects });
  const projects = data?.data?.data || [];

  const createMut = useMutation({
    mutationFn: adminApi.createProject,
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); setForm(false); toast.success('Đã tạo dự án'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi tạo dự án'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateProject(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); setForm(false); setEditing(null); toast.success('Đã cập nhật'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi cập nhật'),
  });
  const deleteMut = useMutation({
    mutationFn: adminApi.deleteProject,
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); toast.success('Đã xóa dự án'); },
  });

  const openCreate = () => { setData(EMPTY); setEditing(null); setForm(true); };
  const openEdit   = (p) => { setData({ ...p }); setEditing(p._id); setForm(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing, data: formData });
    else createMut.mutate(formData);
  };

  const inp = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-[#16A34A] transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quản lý dự án</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors">
          <Plus size={16} /> Thêm dự án
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setForm(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black text-gray-900 mb-5">{editing ? 'Sửa dự án' : 'Thêm dự án mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Tên dự án *</label>
                <input className={inp} value={formData.title} onChange={e => setData(p => ({...p, title: e.target.value}))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Loại sân *</label>
                  <select className={inp} value={formData.category} onChange={e => setData(p => ({...p, category: e.target.value}))}>
                    {Object.entries(CATEGORY_MAP).map(([val, {label}]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Năm</label>
                  <input className={inp} type="number" value={formData.year} onChange={e => setData(p => ({...p, year: e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Địa điểm</label>
                  <input className={inp} value={formData.location} onChange={e => setData(p => ({...p, location: e.target.value}))} />
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Diện tích (m²)</label>
                  <input className={inp} type="number" value={formData.area} onChange={e => setData(p => ({...p, area: e.target.value}))} />
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Khách hàng</label>
                <input className={inp} value={formData.client} onChange={e => setData(p => ({...p, client: e.target.value}))} />
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">URL ảnh đại diện</label>
                <input className={inp} value={formData.thumbnail} onChange={e => setData(p => ({...p, thumbnail: e.target.value}))} placeholder="https://..." />
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả ngắn</label>
                <textarea className={inp + ' resize-none'} rows={3} value={formData.description} onChange={e => setData(p => ({...p, description: e.target.value}))} />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={formData.featured} onChange={e => setData(p => ({...p, featured: e.target.checked}))} className="accent-green-600" />
                  Nổi bật
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={formData.isPublished} onChange={e => setData(p => ({...p, isPublished: e.target.checked}))} className="accent-green-600" />
                  Hiển thị
                </label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D]" disabled={createMut.isPending || updateMut.isPending}>
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Dự án</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Loại sân</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Diện tích</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Năm</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Trạng thái</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">Đang tải...</td></tr>
              : projects.map((p) => {
                const cat = CATEGORY_MAP[p.category] || CATEGORY_MAP.khac;
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{p.title}</div>
                          <div className="text-gray-400 text-xs">{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cat.color}`}>{cat.icon} {cat.label}</span></td>
                    <td className="px-5 py-3 text-gray-600">{p.area ? `${p.area.toLocaleString('vi-VN')} m²` : '–'}</td>
                    <td className="px-5 py-3 text-gray-600">{p.year || '–'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isPublished ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-500 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => { if (confirm('Xóa dự án này?')) deleteMut.mutate(p._id); }} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
