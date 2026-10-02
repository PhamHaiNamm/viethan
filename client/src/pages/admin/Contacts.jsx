/**
 * pages/admin/Contacts.jsx – Quản lý khách hàng liên hệ & yêu cầu báo giá
 * Bộ lọc trạng thái, xem chi tiết trong Modal, đổi trạng thái tức thì, xuất Excel/CSV
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { 
  Download, Trash2, Check, Eye, Phone, Mail, MapPin, 
  Calendar, X, MessageSquare, Clock, User 
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: '',           label: 'Tất cả trạng thái' },
  { value: 'new',        label: 'Mới nhận' },
  { value: 'contacted',  label: 'Đã liên hệ' },
  { value: 'consulting', label: 'Đang tư vấn' },
  { value: 'done',       label: 'Hoàn thành / Ký HĐ' },
  { value: 'cancelled',  label: 'Đã hủy' },
];

const STATUS_BADGE = {
  new:        'bg-red-100 text-red-700 border-red-200',
  contacted:  'bg-amber-100 text-amber-700 border-amber-200',
  consulting: 'bg-blue-100 text-blue-700 border-blue-200',
  done:       'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-gray-100 text-gray-500 border-gray-200',
};

const FIELD_LABEL = {
  'bong-da':    'Sân bóng đá cỏ',
  'bong-ro':    'Sân bóng rổ',
  'tennis':     'Sân tennis',
  'pickleball': 'Sân pickleball',
  'cau-long':   'Sân cầu lông',
  'duong-chay': 'Đường chạy',
  'tu-van':     'Tư vấn chung',
  'khac':       'Loại khác',
};

export default function AdminContacts() {
  const qc = useQueryClient();
  const [status, setStatus]   = useState('');
  const [page, setPage]       = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', status, page],
    queryFn: () => adminApi.getContacts({ status: status || undefined, page, limit: 15 }),
  });

  const contacts   = data?.data?.data?.contacts || [];
  const pagination = data?.data?.pagination;

  const updateMutation = useMutation({
    mutationFn: ({ id, data: payload }) => adminApi.updateContact(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['admin-contacts']);
      qc.invalidateQueries(['admin-dashboard']);
      toast.success('Cập nhật trạng thái thành công');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteContact,
    onSuccess: () => {
      qc.invalidateQueries(['admin-contacts']);
      qc.invalidateQueries(['admin-dashboard']);
      if (selectedContact) setSelectedContact(null);
      toast.success('Đã xóa yêu cầu liên hệ');
    },
  });

  const handleExport = async () => {
    try {
      const res = await adminApi.exportContactsCSV();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `danh_sach_khach_hang_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Đã xuất file CSV thành công!');
    } catch {
      toast.error('Lỗi khi xuất file CSV');
    }
  };

  const openDetail = (c) => {
    setSelectedContact(c);
    if (!c.isRead) {
      updateMutation.mutate({ id: c._id, data: { isRead: true } });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quản lý Yêu cầu Báo giá & Khách hàng
          </h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi danh sách khách hàng gửi yêu cầu tư vấn từ website</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-bold hover:bg-[#15803D] transition-all shadow self-start sm:self-auto"
        >
          <Download size={18} /> Xuất file CSV (Excel)
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setStatus(opt.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              status === opt.value
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Modal Chi Tiết Khách Hàng */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-100 text-[#16A34A] flex items-center justify-center font-bold">
                  <User size={18} />
                </span>
                <h3 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Chi tiết yêu cầu của khách hàng
                </h3>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Họ và tên:</span>
                  <span className="font-bold text-gray-900 text-base">{selectedContact.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Số điện thoại:</span>
                  <a href={`tel:${selectedContact.phone}`} className="font-black text-[#16A34A] text-base hover:underline">
                    {selectedContact.phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Email liên hệ:</span>
                  <span className="text-gray-800 font-medium">{selectedContact.email || '–'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Địa điểm thi công:</span>
                  <span className="text-gray-800 font-medium">{selectedContact.location || 'Hạ Long, Quảng Ninh'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Loại hình sân:</span>
                  <span className="font-bold text-gray-900">{FIELD_LABEL[selectedContact.fieldType] || selectedContact.fieldType}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Quy mô diện tích:</span>
                  <span className="font-bold text-gray-900">{selectedContact.area ? `${selectedContact.area} m²` : 'Chưa xác định'}</span>
                </div>
              </div>

              {/* Ghi chú chi tiết */}
              <div>
                <span className="text-xs text-gray-400 block mb-1">Nội dung ghi chú & yêu cầu:</span>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedContact.note || 'Không có ghi chú thêm.'}
                </div>
              </div>

              {/* Đổi trạng thái trong modal */}
              <div className="pt-2">
                <span className="text-xs text-gray-400 block mb-1.5 font-bold uppercase tracking-wider">
                  Trạng thái xử lý:
                </span>
                <select
                  value={selectedContact.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setSelectedContact((prev) => ({ ...prev, status: newStatus }));
                    updateMutation.mutate({ id: selectedContact._id, data: { status: newStatus } });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-sm focus:border-[#16A34A] focus:outline-none"
                >
                  {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Nút thao tác nhanh */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="flex-1 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Gọi Điện Ngay
                </a>
                <a
                  href={`https://zalo.me/${selectedContact.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#0068FF] hover:bg-blue-600 text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Nhắn Tin Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bảng danh sách liên hệ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Khách hàng</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Số điện thoại</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Loại sân</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Diện tích</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Trạng thái</th>
                <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Ngày gửi</th>
                <th className="text-right px-5 py-3.5 text-gray-500 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Đang tải danh sách liên hệ...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Không có yêu cầu liên hệ nào trong trạng thái này
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c._id}
                    className={`hover:bg-gray-50/80 transition-colors ${!c.isRead ? 'bg-green-50/30' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {!c.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" title="Chưa đọc" />
                        )}
                        <span className={`font-bold ${!c.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {c.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <a href={`tel:${c.phone}`} className="text-[#16A34A] font-semibold hover:underline">
                        {c.phone}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                      {FIELD_LABEL[c.fieldType] || c.fieldType}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      {c.area ? `${c.area} m²` : '–'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          updateMutation.mutate({ id: c._id, data: { status: e.target.value, isRead: true } })
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer ${
                          STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetail(c)}
                          className="p-1.5 text-gray-500 hover:text-[#16A34A] hover:bg-green-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa yêu cầu của khách hàng "${c.fullName}"?`)) {
                              deleteMutation.mutate(c._id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa yêu cầu"
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

        {/* Phân trang */}
        {pagination?.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-5 border-t border-gray-100">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  i + 1 === page
                    ? 'bg-[#16A34A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
