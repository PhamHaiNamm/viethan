/**
 * pages/admin/Dashboard.jsx – Trang tổng quan Admin Dashboard
 * Thống kê thời gian thực, Phím tắt tác vụ nhanh, Danh sách khách hàng mới nhất & Trạng thái hệ thống
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  FolderOpen, MessageSquare, FileText, Bell, Plus, 
  ArrowRight, Sparkles, ShieldCheck, CheckCircle2, 
  ExternalLink, Layers, Settings 
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const FIELD_TYPE_LABEL = {
  'bong-da':    'Sân bóng đá cỏ',
  'bong-ro':    'Sân bóng rổ',
  'tennis':     'Sân tennis',
  'pickleball': 'Sân pickleball',
  'cau-long':   'Sân cầu lông',
  'duong-chay': 'Đường chạy',
  'tu-van':     'Tư vấn chung',
  'khac':       'Loại khác',
};

const STATUS_BADGE = {
  new:        'bg-red-100 text-red-700',
  contacted:  'bg-amber-100 text-amber-700',
  consulting: 'bg-blue-100 text-blue-700',
  done:       'bg-green-100 text-green-700',
  cancelled:  'bg-gray-100 text-gray-500',
};

const STATUS_LABEL = {
  new:        'Mới nhận',
  contacted:  'Đã liên hệ',
  consulting: 'Đang tư vấn',
  done:       'Hoàn thành',
  cancelled:  'Đã hủy',
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30000, // Tự động làm mới mỗi 30s
  });

  const stats = data?.data?.data;

  const statCards = [
    {
      label: 'Tổng công trình dự án',
      value: stats?.projects?.total ?? 0,
      sub: `${stats?.projects?.published ?? 0} dự án đang hiển thị`,
      icon: FolderOpen,
      color: 'bg-blue-50 text-blue-600',
      to: '/admin/projects',
    },
    {
      label: 'Yêu cầu liên hệ mới',
      value: stats?.contacts?.new ?? 0,
      sub: `${stats?.contacts?.unread ?? 0} tin chưa xem`,
      icon: Bell,
      color: 'bg-red-50 text-red-600',
      to: '/admin/contacts',
    },
    {
      label: 'Tổng số khách liên hệ',
      value: stats?.contacts?.total ?? 0,
      sub: 'Tất cả dữ liệu từ form',
      icon: MessageSquare,
      color: 'bg-green-50 text-green-600',
      to: '/admin/contacts',
    },
    {
      label: 'Bài viết tin tức',
      value: stats?.posts?.total ?? 0,
      sub: `${stats?.posts?.published ?? 0} bài đã xuất bản`,
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      to: '/admin/posts',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner chào mừng & Phím tắt */}
      <div className="bg-[#0B1410] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-green-500/20 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/40 text-green-400 text-xs font-bold mb-3 border border-green-700/50">
            <Sparkles size={14} /> Hệ Thống Quản Trị VietHan Sports
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Bảng điều khiển quản trị
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
            Theo dõi lượng khách hàng tiềm năng, cập nhật hình ảnh công trình và thông tin doanh nghiệp trong thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus size={16} /> Thêm công trình
          </Link>
          <Link
            to="/admin/posts"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
          >
            <Plus size={16} /> Viết tin mới
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            Xem Website <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* 4 Thẻ Thống kê chính */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.to}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center font-bold`}>
                  <Icon size={24} />
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#16A34A] group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {isLoading ? '–' : card.value}
              </div>
              <div className="font-bold text-gray-800 text-sm">{card.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{card.sub}</div>
            </Link>
          );
        })}
      </div>

      {/* Bảng liên hệ mới nhất */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Yêu cầu báo giá mới gửi gần đây
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Khách hàng cần được gọi điện phản hồi tư vấn sớm nhất</p>
          </div>
          <Link
            to="/admin/contacts"
            className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
          >
            Xem tất cả khách hàng <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3.5 text-gray-500 font-semibold">Khách hàng</th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-semibold">Số điện thoại</th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-semibold">Hạng mục sân</th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-semibold">Trạng thái</th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-semibold">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : stats?.recentContacts?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Chưa có liên hệ mới nào
                  </td>
                </tr>
              ) : (
                stats?.recentContacts?.map((c) => (
                  <tr key={c._id} className={`hover:bg-gray-50 transition-colors ${!c.isRead ? 'bg-green-50/20' : ''}`}>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        {!c.isRead && <span className="w-2 h-2 rounded-full bg-green-500" />}
                        <span>{c.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`tel:${c.phone}`} className="font-semibold text-[#16A34A] hover:underline">
                        {c.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {FIELD_TYPE_LABEL[c.fieldType] || c.fieldType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {formatDate(c.createdAt)}
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
