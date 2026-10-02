/**
 * pages/admin/Dashboard.jsx – Tổng quan thống kê
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { FolderOpen, MessageSquare, FileText, Bell } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const FIELD_TYPE_LABEL = {
  'bong-da':'Sân bóng đá','bong-ro':'Sân bóng rổ','tennis':'Tennis',
  'pickleball':'Pickleball','cau-long':'Cầu lông','duong-chay':'Đường chạy',
  'tu-van':'Tư vấn','khac':'Khác',
};
const STATUS_BADGE = {
  new:        'bg-red-100 text-red-700',
  contacted:  'bg-yellow-100 text-yellow-700',
  consulting: 'bg-blue-100 text-blue-700',
  done:       'bg-green-100 text-green-700',
  cancelled:  'bg-gray-100 text-gray-500',
};
const STATUS_LABEL = { new:'Mới', contacted:'Đã liên hệ', consulting:'Tư vấn', done:'Xong', cancelled:'Hủy' };

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.getDashboard });
  const stats = data?.data?.data;

  const cards = [
    { label:'Tổng dự án',      value: stats?.projects?.total,    sub:`${stats?.projects?.published} đã đăng`, icon: FolderOpen,    color:'bg-blue-50 text-blue-600' },
    { label:'Liên hệ mới',     value: stats?.contacts?.new,      sub:`${stats?.contacts?.unread} chưa đọc`,  icon: Bell,          color:'bg-red-50 text-red-600' },
    { label:'Tổng liên hệ',    value: stats?.contacts?.total,    sub:'Tất cả',                               icon: MessageSquare, color:'bg-green-50 text-green-600' },
    { label:'Bài viết',        value: stats?.posts?.total,       sub:`${stats?.posts?.published} đã đăng`,   icon: FileText,      color:'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-0.5">{isLoading ? '–' : (c.value ?? 0)}</div>
              <div className="font-semibold text-gray-700 text-sm">{c.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{c.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Recent contacts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900">Liên hệ gần đây</h2>
          <a href="/admin/contacts" className="text-sm text-[#16A34A] font-semibold hover:underline">Xem tất cả</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Họ tên</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">SĐT</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Loại sân</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Trạng thái</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Ngày gửi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Đang tải...</td></tr>
              ) : stats?.recentContacts?.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Chưa có liên hệ nào</td></tr>
              ) : stats?.recentContacts?.map((c) => (
                <tr key={c._id} className={`hover:bg-gray-50 ${!c.isRead ? 'font-semibold' : ''}`}>
                  <td className="px-5 py-3 text-gray-900">{c.fullName}</td>
                  <td className="px-5 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-5 py-3 text-gray-600">{FIELD_TYPE_LABEL[c.fieldType] || c.fieldType}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
