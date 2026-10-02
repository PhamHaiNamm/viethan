/**
 * pages/admin/Posts.jsx – Quản lý bài viết blog & cẩm nang tin tức
 * Đầy đủ CRUD: Thêm mới, Sửa bài viết, Xóa bài viết, Phân loại Tags, Trạng thái Đã đăng/Nháp
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Plus, Pencil, Trash2, Search, Eye, Tag, X, FileText, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_POST = {
  title: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  tags: '',
  authorName: 'VietHan Sports',
  isPublished: true,
};

export default function AdminPosts() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData]   = useState(EMPTY_POST);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: adminApi.getPosts,
  });

  const posts = data?.data?.data || [];

  // Tạo bài viết mới
  const createMut = useMutation({
    mutationFn: (payload) => adminApi.createPost(payload),
    onSuccess: () => {
      qc.invalidateQueries(['admin-posts']);
      setShowModal(false);
      toast.success('Đã xuất bản bài viết mới thành công!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo bài viết');
    },
  });

  // Cập nhật bài viết
  const updateMut = useMutation({
    mutationFn: ({ id, data: payload }) => adminApi.updatePost(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['admin-posts']);
      setShowModal(false);
      setEditingId(null);
      toast.success('Cập nhật bài viết thành công!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật bài viết');
    },
  });

  // Xóa bài viết
  const deleteMut = useMutation({
    mutationFn: adminApi.deletePost,
    onSuccess: () => {
      qc.invalidateQueries(['admin-posts']);
      toast.success('Đã xóa bài viết thành công!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Lỗi xóa bài viết');
    },
  });

  const openCreate = () => {
    setFormData(EMPTY_POST);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (post) => {
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      thumbnail: post.thumbnail || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      authorName: post.authorName || 'VietHan Sports',
      isPublished: post.isPublished ?? true,
    });
    setEditingId(post._id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    // Xử lý tags từ string sang array
    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tags: tagsArray,
    };

    if (editingId) {
      updateMut.mutate({ id: editingId, data: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  // Lọc bài viết
  const filteredPosts = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-[#16A34A] transition-all';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quản lý Bài viết & Tin tức
          </h1>
          <p className="text-xs text-gray-500 mt-1">Cập nhật cẩm nang kiến thức, hướng dẫn thi công và kinh nghiệm ngành</p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-bold hover:bg-[#15803D] transition-all shadow-md self-start sm:self-auto"
        >
          <Plus size={18} /> Viết bài mới
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm bài viết theo tiêu đề hoặc trích dẫn tóm tắt..."
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-xs px-2">
            Xóa
          </button>
        )}
      </div>

      {/* Modal Soạn thảo / Chỉnh sửa */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {editingId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
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
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cẩm nang bảo dưỡng sân bóng cỏ nhân tạo 5G sau mùa mưa bão"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Tóm tắt ngắn (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả súc tích xuất hiện ở danh sách bài viết..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                  className={inp + ' resize-none'}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    URL Ảnh đại diện
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData((p) => ({ ...p, thumbnail: e.target.value }))}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    placeholder="VietHan Sports"
                    value={formData.authorName}
                    onChange={(e) => setFormData((p) => ({ ...p, authorName: e.target.value }))}
                    className={inp}
                  />
                </div>
              </div>

              {formData.thumbnail && (
                <div className="aspect-[16/9] max-h-48 rounded-xl overflow-hidden border border-gray-200">
                  <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Nội dung chi tiết (Hỗ trợ HTML) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="<p>Nhập nội dung bài viết vào đây...</p>"
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  className={inp + ' font-mono text-xs leading-relaxed'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Tags phân loại (Phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Cỏ nhân tạo, Sân bóng đá, Bảo dưỡng, Hạ Long"
                  value={formData.tags}
                  onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                  className={inp}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span>Xuất bản công khai bài viết ngay</span>
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
                    ? 'Cập nhật bài viết'
                    : 'Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bảng danh sách bài viết */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Bài viết</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Ngày đăng</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Lượt xem</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Trạng thái</th>
                <th className="text-right px-5 py-3.5 text-gray-500 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Đang tải dữ liệu bài viết...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Không có bài viết nào được tìm thấy
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 max-w-lg">
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-14 h-10 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{post.title}</div>
                          <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{post.excerpt || '–'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <Eye size={13} className="text-gray-400" /> {post.viewCount || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa bài viết"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}"?`)) {
                              deleteMut.mutate(post._id);
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa bài viết"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
