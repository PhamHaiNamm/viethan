/**
 * controllers/contactController.js
 * Xử lý form liên hệ / báo giá và quản lý liên hệ trong Admin
 */
const Contact = require('../models/Contact');
const { sendContactNotificationEmail, sendContactConfirmEmail } = require('../utils/sendEmail');
const { successResponse, errorResponse, paginatedResponse, getPagination } = require('../utils/apiResponse');

/**
 * @desc    Gửi form liên hệ / báo giá (public)
 * @route   POST /api/contacts
 * @access  Public (có rate limit)
 */
const createContact = async (req, res) => {
  try {
    const { fullName, phone, email, fieldType, area, location, note, source } = req.body;

    // Validation cơ bản
    if (!fullName || !phone || !fieldType) {
      return errorResponse(res, 'Vui lòng điền đầy đủ: họ tên, số điện thoại và loại dịch vụ', 400);
    }

    // Validate số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return errorResponse(res, 'Số điện thoại không hợp lệ', 400);
    }

    // Tạo liên hệ mới
    const contact = await Contact.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      fieldType,
      area: area ? Number(area) : undefined,
      location: location?.trim(),
      note: note?.trim(),
      source: source || 'other',
    });

    // Gửi email thông báo cho admin (không block response)
    sendContactNotificationEmail(contact).catch((err) =>
      console.error('Gửi email thất bại:', err.message)
    );

    // Gửi email xác nhận cho khách hàng (nếu có email)
    if (contact.email) {
      sendContactConfirmEmail(contact).catch((err) =>
        console.error('Gửi email xác nhận thất bại:', err.message)
      );
    }

    return successResponse(
      res,
      { _id: contact._id },
      'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      201
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    console.error('Create contact error:', error);
    return errorResponse(res, 'Lỗi server khi gửi liên hệ', 500);
  }
};

/**
 * @desc    Lấy danh sách liên hệ (Admin)
 * @route   GET /api/admin/contacts
 * @access  Private/Admin
 */
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, isRead } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const pagination = getPagination(page, limit, total);

    // Đếm số liên hệ chưa đọc
    const unreadCount = await Contact.countDocuments({ isRead: false });

    return paginatedResponse(
      res,
      { contacts, unreadCount },
      pagination,
      'Lấy danh sách liên hệ thành công'
    );
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi lấy danh sách liên hệ', 500);
  }
};

/**
 * @desc    Cập nhật trạng thái liên hệ (Admin)
 * @route   PUT /api/admin/contacts/:id
 * @access  Private/Admin
 */
const updateContact = async (req, res) => {
  try {
    const { status, adminNote, isRead } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, isRead },
      { new: true }
    );

    if (!contact) {
      return errorResponse(res, 'Không tìm thấy liên hệ', 404);
    }

    return successResponse(res, contact, 'Cập nhật liên hệ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi cập nhật liên hệ', 500);
  }
};

/**
 * @desc    Xóa liên hệ (Admin)
 * @route   DELETE /api/admin/contacts/:id
 * @access  Private/Admin
 */
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return errorResponse(res, 'Không tìm thấy liên hệ', 404);
    }
    return successResponse(res, null, 'Xóa liên hệ thành công');
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi xóa liên hệ', 500);
  }
};

/**
 * @desc    Xuất danh sách liên hệ CSV (Admin)
 * @route   GET /api/admin/contacts/export
 * @access  Private/Admin
 */
const exportContactsCSV = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');

    const fieldTypeMap = {
      'bong-da': 'Sân bóng đá',
      'bong-ro': 'Sân bóng rổ',
      tennis: 'Sân tennis',
      pickleball: 'Sân pickleball',
      'cau-long': 'Sân cầu lông',
      'duong-chay': 'Đường chạy',
      khac: 'Khác',
      'tu-van': 'Tư vấn',
    };

    const statusMap = {
      new: 'Mới',
      contacted: 'Đã liên hệ',
      consulting: 'Đang tư vấn',
      done: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };

    // Tạo nội dung CSV
    const headers = ['Họ tên', 'SĐT', 'Email', 'Loại sân', 'Diện tích (m²)', 'Địa điểm', 'Ghi chú', 'Trạng thái', 'Ngày gửi'];
    const rows = contacts.map((c) => [
      `"${c.fullName}"`,
      c.phone,
      c.email || '',
      fieldTypeMap[c.fieldType] || c.fieldType,
      c.area || '',
      `"${c.location || ''}"`,
      `"${c.note || ''}"`,
      statusMap[c.status] || c.status,
      new Date(c.createdAt).toLocaleDateString('vi-VN'),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // BOM cho Excel đọc đúng UTF-8
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="contacts_${Date.now()}.csv"`);
    return res.send('\uFEFF' + csv);
  } catch (error) {
    return errorResponse(res, 'Lỗi server khi xuất CSV', 500);
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  exportContactsCSV,
};
