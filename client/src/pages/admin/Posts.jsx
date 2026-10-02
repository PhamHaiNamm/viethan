/**
 * pages/admin/Posts.jsx – Quản lý bài viết (stub)
 */
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminPosts() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey:['admin-posts'], queryFn: adminApi.getPosts });
  const posts = data?.data?.data || [];

  const deleteMut = useMutation({
    mutationFn: adminApi.deletePost,
    onSuccess: () => { qc.invalidateQueries(['admin-posts']); toast.success('Đã xóa bài viết'); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quản lý bài viết</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors opacity-60 cursor-not-allowed" title="Tính năng đang phát triển">
          <Plus size={16} /> Thêm bài viết
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Tiêu đề</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Ngày đăng</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Lượt xem</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Trạng thái</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? <tr><td colSpan={5} className="text-center py-10 text-gray-400">Đang tải...</td></tr>
              : posts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{p.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.excerpt}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(p.publishedAt || p.createdAt)}</td>
                  <td className="px-5 py-3 text-gray-500">{p.viewCount || 0}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isPublished ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => { if (confirm('Xóa bài viết này?')) deleteMut.mutate(p._id); }} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
