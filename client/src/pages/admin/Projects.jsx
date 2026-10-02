/**
 * pages/admin/Projects.jsx – Quản lý danh mục dự án thi công
 * Hỗ trợ Thêm/Sửa/Xóa, tìm kiếm dự án, upload URL thư viện ảnh (Gallery), đánh dấu nổi bật
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Plus, Pencil, Trash2, Search, X, ImagePlus, Eye, Layers } from 'lucide-react';
import { CATEGORY_MAP } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_PROJECT = {
  title: '',
  category: 'bong-da',
  location: 'Hạ Long, Quảng Ninh',
  area: '',
  year: new Date().getFullYear(),
  client: '',
  description: '',
  content: '',
  thumbnail: '',
  imagesText: '', // URL ảnh cách nhau bởi dòng mới
  featured: false,
  isPublished: true,
};

export default function AdminProjects() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData]   = useState(EMPTY_PROJECT);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: adminApi.getProjects,
  });

  const projects = data?.data?.data || [];

  const createMut = useMutation({
    mutationFn: (payload) => adminApi.createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries(['admin-projects']);
      qc.invalidateQueries(['admin-dashboard']);
      setShowModal(false);
      toast.success('Đã thêm dự án mới thành công!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo dự án');
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data: payload }) => adminApi.updateProject(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['admin-projects']);
      qc.invalidateQueries(['admin-dashboard']);
      setShowModal(false);
      setEditingId(null);
      toast.success('Cập nhật dự án thành công!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật dự án');
    },
  });

  const deleteMut = useMutation({
    mutationFn: adminApi.deleteProject,
    onSuccess: () => {
      qc.invalidateQueries(['admin-projects']);
      qc.invalidateQueries(['admin-dashboard']);
      toast.success('Đã xóa dự án!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Lỗi xóa dự án');
    },
  });

  const openCreate = () => {
    setFormData(EMPTY_PROJECT);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    const imagesStr = Array.isArray(p.images)
      ? p.images.map((img) => img.url).join('\n')
      : '';

    setFormData({
      title: p.title || '',
      category: p.category || 'bong-da',
      location: p.location || 'Hạ Long, Quảng Ninh',
      area: p.area || '',
      year: p.year || new Date().getFullYear(),
      client: p.client || '',
      description: p.description || '',
      content: p.content || '',
      thumbnail: p.thumbnail || '',
      imagesText: imagesStr,
      featured: p.featured ?? false,
      isPublished: p.isPublished ?? true,
    });
    setEditingId(p._id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tên công trình');
      return;
    }

    // Biến đổi danh sách ảnh từ textarea
    const imagesArray = formData.imagesText
      ? formData.imagesText
          .split('\n')
          .map((url) => url.trim())
          .filter(Boolean)
          .map((url) => ({ url, caption: formData.title }))
      : [];

    const payload = {
      ...formData,
      area: formData.area ? Number(formData.area) : undefined,
      year: formData.year ? Number(formData.year) : undefined,
      images: imagesArray.length > 0 ? imagesArray : [{ url: formData.thumbnail, caption: formData.title }],
    };

    if (editingId) {
      updateMut.mutate({ id: editingId, data: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-[#16A34A] transition-all';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quản lý Công trình & Dự án
          </h1>
          <p className="text-xs text-gray-500 mt-1">Cập nhật danh sách các công trình thể thao đã thi công thực tế</p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-bold hover:bg-[#15803D] transition-all shadow-md self-start sm:self-auto"
        >
          <Plus size={18} /> Thêm dự án mới
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm dự án theo tên hoặc khu vực thi công..."
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-xs px-2">
            Xóa
          </button>
        )}
      </div>

      {/* Modal Thêm / Sửa dự án */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {editingId ? 'Chỉnh sửa thông tin dự án' : 'Thêm công trình dự án mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Tên công trình dự án <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cụm sân Pickleball & Bóng đá Hòa Bình Sport"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className={inp}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Loại hình sân <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className={inp + ' cursor-pointer'}
                  >
                    {Object.entries(CATEGORY_MAP).map(([val, { label }]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Năm hoàn thành
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                    className={inp}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Địa điểm thi công
                  </label>
                  <input
                    type="text"
                    placeholder="Bãi Cháy, TP. Hạ Long, Quảng Ninh"
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Diện tích quy mô (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="1500"
                    value={formData.area}
                    onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))}
                    className={inp}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Chủ đầu tư / Khách hàng
                </label>
                <input
                  type="text"
                  placeholder="Tập đoàn / Cá nhân / Ban quản lý..."
                  value={formData.client}
                  onChange={(e) => setFormData((p) => ({ ...p, client: e.target.value }))}
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  URL Ảnh đại diện Thumbnail (Hiển thị ngoài danh sách)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData((p) => ({ ...p, thumbnail: e.target.value }))}
                  className={inp}
                />
              </div>

              {formData.thumbnail && (
                <div className="aspect-[16/9] max-h-44 rounded-xl overflow-hidden border border-gray-200">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Thư viện ảnh chi tiết (Mỗi URL ảnh 1 dòng)
                </label>
                <textarea
                  rows={3}
                  placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                  value={formData.imagesText}
                  onChange={(e) => setFormData((p) => ({ ...p, imagesText: e.target.value }))}
                  className={inp + ' font-mono text-xs resize-none'}
                />
                <span className="text-[11px] text-gray-400">Các ảnh này sẽ hiển thị trong Lightbox phóng to chi tiết.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Mô tả ngắn dự án
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt đặc điểm công trình..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className={inp + ' resize-none'}
                />
              </div>

              <div className="flex gap-8 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Đặt làm công trình tiêu biểu (Trang chủ)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span>Hiển thị công khai</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createMut.isPending || updateMut.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-bold hover:bg-[#15803D] shadow-md disabled:opacity-60"
                >
                  {createMut.isPending || updateMut.isPending
                    ? 'Đang lưu...'
                    : editingId
                    ? 'Cập nhật công trình'
                    : 'Lưu công trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bảng danh sách dự án */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Tên công trình</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Loại hình</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Quy mô</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Năm</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Trạng thái</th>
                <th className="text-right px-5 py-3.5 text-gray-500 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Đang tải dữ liệu công trình...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Không có công trình nào được tìm thấy
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const cat = CATEGORY_MAP[p.category] || CATEGORY_MAP.khac;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.thumbnail && (
                            <img
                              src={p.thumbnail}
                              alt={p.title}
                              className="w-12 h-10 rounded-lg object-cover shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">{p.title}</div>
                            <div className="text-gray-400 text-xs mt-0.5">{p.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cat.color}`}>
                          {cat.icon} {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {p.area ? `${p.area.toLocaleString('vi-VN')} m²` : '–'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {p.year || '–'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {p.isPublished ? 'Hiển thị' : 'Ẩn'}
                          </span>
                          {p.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                              Tiêu biểu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa dự án"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa dự án "${p.title}"?`)) {
                                deleteMut.mutate(p._id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa dự án"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
