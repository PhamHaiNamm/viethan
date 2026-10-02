/**
 * pages/admin/Contacts.jsx – Quản lý liên hệ
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Download, Trash2, Check } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value:'', label:'Tất cả' }, { value:'new', label:'Mới' }, { value:'contacted', label:'Đã liên hệ' },
  { value:'consulting', label:'Đang tư vấn' }, { value:'done', label:'Hoàn thành' }, { value:'cancelled', label:'Đã hủy' },
];
const STATUS_BADGE  = { new:'bg-red-100 text-red-700', contacted:'bg-yellow-100 text-yellow-700', consulting:'bg-blue-100 text-blue-700', done:'bg-green-100 text-green-700', cancelled:'bg-gray-100 text-gray-500' };
const FIELD_LABEL   = { 'bong-da':'Bóng đá','bong-ro':'Bóng rổ',tennis:'Tennis',pickleball:'Pickleball','cau-long':'Cầu lông','duong-chay':'Đường chạy','tu-van':'Tư vấn',khac:'Khác' };

export default function AdminContacts() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [page, setPage]     = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', status, page],
    queryFn: () => adminApi.getContacts({ status: status || undefined, page, limit: 20 }),
  });

  const contacts    = data?.data?.data?.contacts || [];
  const pagination  = data?.data?.pagination;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateContact(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-contacts']); toast.success('Đã cập nhật'); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteContact,
    onSuccess: () => { qc.invalidateQueries(['admin-contacts']); toast.success('Đã xóa liên hệ'); },
  });

  const handleExport = async () => {
    try {
      const res = await adminApi.exportContactsCSV();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url;
      a.download = `contacts_${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Lỗi xuất CSV'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quản lý liên hệ</h1>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors">
          <Download size={16} /> Xuất CSV
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => { setStatus(opt.value); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${status === opt.value ? 'bg-[#16A34A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Họ tên</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">SĐT</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Email</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Loại sân</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Diện tích</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Trạng thái</th>
                <th className="text-left px-5 py-3 text-gray-500 font-semibold">Ngày</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Đang tải...</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Không có liên hệ nào</td></tr>
              ) : contacts.map((c) => (
                <tr key={c._id} className={`hover:bg-gray-50 transition-colors ${!c.isRead ? 'bg-green-50/30' : ''}`}>
                  <td className={`px-5 py-3 ${!c.isRead ? 'font-bold' : 'font-medium'} text-gray-900`}>
                    {c.fullName}
                    {!c.isRead && <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block" />}
                  </td>
                  <td className="px-5 py-3"><a href={`tel:${c.phone}`} className="text-[#16A34A] hover:underline">{c.phone}</a></td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{c.email || '–'}</td>
                  <td className="px-5 py-3 text-gray-700">{FIELD_LABEL[c.fieldType] || c.fieldType}</td>
                  <td className="px-5 py-3 text-gray-500">{c.area ? `${c.area} m²` : '–'}</td>
                  <td className="px-5 py-3">
                    <select
                      value={c.status}
                      onChange={(e) => updateMutation.mutate({ id: c._id, data: { status: e.target.value, isRead: true } })}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${STATUS_BADGE[c.status] || 'bg-gray-100'}`}
                    >
                      {STATUS_OPTIONS.filter(o => o.value).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {!c.isRead && (
                        <button onClick={() => updateMutation.mutate({ id: c._id, data: { isRead: true } })}
                          className="text-green-600 hover:text-green-800" title="Đánh dấu đã đọc">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={() => { if (confirm('Xóa liên hệ này?')) deleteMutation.mutate(c._id); }}
                        className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-5 border-t border-gray-100">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold ${i + 1 === page ? 'bg-[#16A34A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
