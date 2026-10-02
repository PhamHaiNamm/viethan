/**
 * utils/sendEmail.js
 * Gửi email thông báo khi có liên hệ mới bằng Nodemailer
 */
const nodemailer = require('nodemailer');

/**
 * Tạo transporter Nodemailer từ biến môi trường
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true nếu dùng port 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Bản đồ tên loại sân
 */
const fieldTypeMap = {
  'bong-da': 'Sân bóng đá cỏ nhân tạo',
  'bong-ro': 'Sân bóng rổ',
  tennis: 'Sân tennis',
  pickleball: 'Sân pickleball',
  'cau-long': 'Sân cầu lông',
  'duong-chay': 'Đường chạy điền kinh',
  khac: 'Loại khác',
  'tu-van': 'Tư vấn chung',
};

/**
 * Gửi email thông báo liên hệ mới đến admin
 * @param {Object} contactData - Dữ liệu liên hệ từ form
 */
const sendContactNotificationEmail = async (contactData) => {
  // Bỏ qua nếu chưa cấu hình email
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log('⚠️  Email chưa được cấu hình, bỏ qua gửi thông báo.');
    return;
  }

  try {
    const transporter = createTransporter();
    const fieldTypeName = fieldTypeMap[contactData.fieldType] || contactData.fieldType;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `🏟️ [VietHan Sports] Yêu cầu báo giá mới từ ${contactData.fullName}`,
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #16A34A, #0B1410); padding: 30px; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .header p { color: #22C55E; margin: 8px 0 0; }
            .body { padding: 30px; }
            .field { margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 16px; }
            .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-size: 16px; color: #333; font-weight: 600; }
            .badge { display: inline-block; background: #22C55E; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 13px; }
            .btn { display: inline-block; background: #16A34A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏟️ VietHan Sports</h1>
              <p>Yêu cầu báo giá mới</p>
            </div>
            <div class="body">
              <p style="color:#555; margin-top:0;">Bạn vừa nhận được một yêu cầu báo giá mới từ website. Chi tiết bên dưới:</p>
              
              <div class="field">
                <div class="label">Họ và tên</div>
                <div class="value">${contactData.fullName}</div>
              </div>
              
              <div class="field">
                <div class="label">Số điện thoại</div>
                <div class="value"><a href="tel:${contactData.phone}" style="color:#16A34A">${contactData.phone}</a></div>
              </div>
              
              ${contactData.email ? `
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${contactData.email}" style="color:#16A34A">${contactData.email}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Loại sân / Dịch vụ</div>
                <div class="value"><span class="badge">${fieldTypeName}</span></div>
              </div>
              
              ${contactData.area ? `
              <div class="field">
                <div class="label">Diện tích ước tính</div>
                <div class="value">${contactData.area} m²</div>
              </div>
              ` : ''}
              
              ${contactData.location ? `
              <div class="field">
                <div class="label">Địa điểm thi công</div>
                <div class="value">${contactData.location}</div>
              </div>
              ` : ''}
              
              ${contactData.note ? `
              <div class="field">
                <div class="label">Ghi chú thêm</div>
                <div class="value" style="font-weight:400; color:#555;">${contactData.note}</div>
              </div>
              ` : ''}
              
              <div class="field" style="border:none;">
                <div class="label">Thời gian gửi</div>
                <div class="value">${new Date().toLocaleString('vi-VN')}</div>
              </div>
              
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/contacts" class="btn">
                📋 Xem trong Admin
              </a>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} VietHan Sports | Hạ Long, Quảng Ninh
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Đã gửi email thông báo liên hệ mới đến ${process.env.EMAIL_TO}`);
  } catch (error) {
    // Không throw error - chỉ log, không ảnh hưởng response API
    console.error('❌ Lỗi gửi email thông báo:', error.message);
  }
};

/**
 * Gửi email xác nhận cho khách hàng (tùy chọn)
 * @param {Object} contactData - Dữ liệu liên hệ
 */
const sendContactConfirmEmail = async (contactData) => {
  if (!contactData.email) return;
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') return;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: `✅ VietHan Sports – Đã nhận yêu cầu báo giá của bạn`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;background:#f9f9f9;border-radius:12px;">
          <h2 style="color:#16A34A;">Kính gửi ${contactData.fullName},</h2>
          <p style="color:#555;line-height:1.8;">
            Cảm ơn bạn đã liên hệ với <strong>VietHan Sports</strong>!
            Chúng tôi đã nhận được yêu cầu báo giá của bạn và sẽ liên hệ lại trong vòng 
            <strong style="color:#16A34A;">24 giờ làm việc</strong>.
          </p>
          <p style="color:#555;">Nếu cần hỗ trợ khẩn cấp, vui lòng gọi trực tiếp:</p>
          <p style="font-size:20px;font-weight:bold;color:#16A34A;">📞 ${process.env.COMPANY_HOTLINE || '0901 234 567'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#888;font-size:13px;">Trân trọng,<br><strong>Đội ngũ VietHan Sports</strong><br>Hạ Long, Quảng Ninh</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('❌ Lỗi gửi email xác nhận:', error.message);
  }
};

module.exports = { sendContactNotificationEmail, sendContactConfirmEmail };
