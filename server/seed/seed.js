/**
 * seed/seed.js
 * Tạo dữ liệu mẫu cho database VietHan Sports
 * Chạy bằng: npm run seed
 * 
 * Dữ liệu bao gồm:
 * - 1 admin mặc định
 * - 4 banners hero
 * - 4 dịch vụ
 * - 6 dự án (đủ loại sân)
 * - 4 cảm nhận khách hàng
 * - 3 bài viết kiến thức
 * - 1 setting công ty
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const slugify = require('slugify');

// Import models
const User = require('../models/User');
const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Post = require('../models/Post');
const Setting = require('../models/Setting');

// Hàm tạo slug tiếng Việt (copy từ Project model)
const vietnameseSlug = (text) => {
  const map = {
    à:'a',á:'a',ả:'a',ã:'a',ạ:'a',ă:'a',ắ:'a',ằ:'a',ẵ:'a',ặ:'a',ẳ:'a',
    â:'a',ấ:'a',ầ:'a',ẩ:'a',ẫ:'a',ậ:'a',è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',
    ê:'e',ề:'e',ế:'e',ể:'e',ễ:'e',ệ:'e',ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
    ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',ô:'o',ố:'o',ồ:'o',ổ:'o',ỗ:'o',ộ:'o',
    ơ:'o',ớ:'o',ờ:'o',ở:'o',ỡ:'o',ợ:'o',ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',
    ư:'u',ứ:'u',ừ:'u',ử:'u',ữ:'u',ự:'u',ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',đ:'d',
    À:'A',Á:'A',Ả:'A',Ã:'A',Ạ:'A',Ă:'A',Ắ:'A',Ằ:'A',Ẵ:'A',Ặ:'A',Ẳ:'A',
    Â:'A',Ấ:'A',Ầ:'A',Ẩ:'A',Ẫ:'A',Ậ:'A',È:'E',É:'E',Ẻ:'E',Ẽ:'E',Ẹ:'E',
    Ê:'E',Ề:'E',Ế:'E',Ể:'E',Ễ:'E',Ệ:'E',Ì:'I',Í:'I',Ỉ:'I',Ĩ:'I',Ị:'I',
    Ò:'O',Ó:'O',Ỏ:'O',Õ:'O',Ọ:'O',Ô:'O',Ố:'O',Ồ:'O',Ổ:'O',Ỗ:'O',Ộ:'O',
    Ơ:'O',Ớ:'O',Ờ:'O',Ở:'O',Ỡ:'O',Ợ:'O',Ù:'U',Ú:'U',Ủ:'U',Ũ:'U',Ụ:'U',
    Ư:'U',Ứ:'U',Ừ:'U',Ử:'U',Ữ:'U',Ự:'U',Ỳ:'Y',Ý:'Y',Ỷ:'Y',Ỹ:'Y',Ỵ:'Y',Đ:'D',
  };
  return text.split('').map(c => map[c] || c).join('');
};

const makeSlug = (text) => slugify(vietnameseSlug(text), { lower: true, strict: true });

// ========================================================
// DỮ LIỆU MẪU
// ========================================================

const bannerData = [
  {
    title: 'Kiến tạo sân chơi – Nâng tầm thể thao',
    subtitle: 'Chuyên gia thi công sân thể thao chuẩn Hàn Quốc tại Hạ Long, Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1920&q=80',
    ctaText: 'Nhận báo giá miễn phí',
    ctaLink: '/lien-he',
    ctaSecondaryText: 'Xem dự án',
    ctaSecondaryLink: '/du-an',
    order: 0,
    isActive: true,
  },
  {
    title: 'Sân cỏ nhân tạo tiêu chuẩn FIFA',
    subtitle: 'Vật liệu nhập khẩu Hàn Quốc, bền bỉ theo thời gian, bảo hành 5 năm',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=80',
    ctaText: 'Tìm hiểu dịch vụ',
    ctaLink: '/dich-vu',
    ctaSecondaryText: 'Liên hệ ngay',
    ctaSecondaryLink: '/lien-he',
    order: 1,
    isActive: true,
  },
  {
    title: 'Sân Pickleball & Tennis Chuyên Nghiệp',
    subtitle: 'Thiết kế hiện đại, mặt sân chuẩn thi đấu quốc tế, thi công nhanh chóng',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1920&q=80',
    ctaText: 'Báo giá sân Pickleball',
    ctaLink: '/lien-he?type=pickleball',
    ctaSecondaryText: 'Xem dự án',
    ctaSecondaryLink: '/du-an?category=pickleball',
    order: 2,
    isActive: true,
  },
  {
    title: 'Giải Pháp Thi Công Trọn Gói',
    subtitle: 'Từ tư vấn, thiết kế đến thi công và bảo trì – Một đầu mối, an tâm tuyệt đối',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80',
    ctaText: 'Tư vấn miễn phí',
    ctaLink: '/lien-he',
    ctaSecondaryText: 'Giới thiệu công ty',
    ctaSecondaryLink: '/gioi-thieu',
    order: 3,
    isActive: true,
  },
];

const serviceData = [
  {
    title: 'Tư vấn & Khảo sát',
    slug: 'tu-van-khao-sat',
    summary:
      'Đội ngũ chuyên gia giàu kinh nghiệm sẽ khảo sát thực địa, tư vấn phương án phù hợp với địa hình và ngân sách của bạn.',
    content: `
      <h2>Dịch vụ Tư vấn & Khảo sát chuyên nghiệp</h2>
      <p>VietHan Sports cung cấp dịch vụ tư vấn miễn phí, giúp bạn lựa chọn được giải pháp thi công sân thể thao tối ưu nhất.</p>
      <h3>Quy trình tư vấn</h3>
      <ul>
        <li>Tiếp nhận yêu cầu và thông tin dự án từ khách hàng</li>
        <li>Khảo sát thực địa, đo đạc diện tích và đánh giá địa chất</li>
        <li>Phân tích nhu cầu sử dụng và ngân sách đầu tư</li>
        <li>Đề xuất phương án và loại vật liệu phù hợp</li>
        <li>Lập báo giá chi tiết, minh bạch</li>
      </ul>
      <p>Chúng tôi cam kết tư vấn trung thực, không tư vấn dịch vụ không cần thiết.</p>
    `,
    icon: 'MessageSquare',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    features: [
      'Tư vấn miễn phí 100%',
      'Khảo sát thực địa tận nơi',
      'Báo giá chi tiết, minh bạch',
      'Không phát sinh chi phí ngoài hợp đồng',
    ],
    order: 0,
    isPublished: true,
  },
  {
    title: 'Thiết kế & Lập bản vẽ',
    slug: 'thiet-ke-lap-ban-ve',
    summary:
      'Thiết kế 2D/3D chuyên nghiệp, đáp ứng mọi tiêu chuẩn kỹ thuật quốc tế và phù hợp với không gian thực tế.',
    content: `
      <h2>Dịch vụ Thiết kế chuyên nghiệp</h2>
      <p>Với đội ngũ kiến trúc sư và kỹ sư được đào tạo tại Hàn Quốc, VietHan Sports mang đến những thiết kế sân thể thao vừa đẹp về thẩm mỹ vừa đảm bảo tiêu chuẩn kỹ thuật.</p>
      <h3>Dịch vụ bao gồm</h3>
      <ul>
        <li>Thiết kế mặt bằng sân theo kích thước tiêu chuẩn</li>
        <li>Bản vẽ kỹ thuật hệ thống thoát nước, chiếu sáng, hàng rào</li>
        <li>Mô hình 3D trực quan để khách hàng hình dung</li>
        <li>Tư vấn chọn màu sắc, logo, phân khu chức năng</li>
        <li>Hồ sơ thiết kế đầy đủ để xin phép xây dựng</li>
      </ul>
    `,
    icon: 'PenTool',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    features: [
      'Thiết kế 2D & 3D chi tiết',
      'Đạt chuẩn FIFA, BWF, ITF',
      'Tư vấn màu sắc & thương hiệu',
      'Hồ sơ xin phép xây dựng',
    ],
    order: 1,
    isPublished: true,
  },
  {
    title: 'Thi công trọn gói',
    slug: 'thi-cong-tron-goi',
    summary:
      'Thi công từ A–Z: nền móng, hệ thống thoát nước, lắp đặt cỏ nhân tạo/sàn PU, hàng rào, đèn chiếu sáng và hoàn thiện.',
    content: `
      <h2>Dịch vụ Thi công trọn gói</h2>
      <p>VietHan Sports cung cấp giải pháp thi công sân thể thao hoàn chỉnh, từ san lấp mặt bằng đến lúc bàn giao và sẵn sàng đưa vào sử dụng.</p>
      <h3>Các hạng mục thi công</h3>
      <ul>
        <li><strong>Nền móng:</strong> San lấp, be bờ, đổ bê tông nền đúng chuẩn</li>
        <li><strong>Hệ thống thoát nước:</strong> Lắp đặt hệ thống rãnh, ống thoát nước mặt</li>
        <li><strong>Mặt sân:</strong> Trải cỏ nhân tạo/sàn PU/cao su theo tiêu chuẩn</li>
        <li><strong>Kẻ vạch:</strong> Kẻ vạch sân bằng sơn epoxy chuyên dụng</li>
        <li><strong>Hàng rào lưới:</strong> Lắp đặt hàng rào bảo vệ xung quanh sân</li>
        <li><strong>Chiếu sáng:</strong> Hệ thống đèn LED chuyên dụng cho sân thể thao</li>
        <li><strong>Khung cầu môn & phụ kiện:</strong> Lắp đặt đầy đủ thiết bị thi đấu</li>
      </ul>
      <p>Thời gian thi công: 15–45 ngày tùy quy mô dự án. Cam kết tiến độ theo hợp đồng.</p>
    `,
    icon: 'HardHat',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    features: [
      'Thi công đúng tiến độ cam kết',
      'Vật liệu Hàn Quốc chính hãng',
      'Đội thợ lành nghề, kinh nghiệm',
      'Giám sát kỹ thuật 24/7',
    ],
    order: 2,
    isPublished: true,
  },
  {
    title: 'Bảo trì & Sửa chữa',
    slug: 'bao-tri-sua-chua',
    summary:
      'Dịch vụ bảo trì định kỳ, vệ sinh, sửa chữa, nâng cấp sân thể thao giúp sân luôn trong tình trạng tốt nhất.',
    content: `
      <h2>Dịch vụ Bảo trì & Sửa chữa</h2>
      <p>Sau khi bàn giao, VietHan Sports tiếp tục đồng hành cùng khách hàng trong suốt vòng đời của công trình.</p>
      <h3>Dịch vụ bảo trì bao gồm</h3>
      <ul>
        <li>Vệ sinh sân định kỳ, loại bỏ bụi bẩn và rêu mốc</li>
        <li>Kiểm tra và bổ sung hạt cao su/cát lấp đầy mặt cỏ</li>
        <li>Sửa chữa vá lại các đoạn cỏ hư hỏng, bong tróc</li>
        <li>Vệ sinh và bảo dưỡng hệ thống thoát nước</li>
        <li>Kiểm tra, thay thế bóng đèn chiếu sáng</li>
        <li>Sơn lại vạch kẻ sân khi bị mờ</li>
      </ul>
      <p><strong>Bảo hành công trình:</strong> 5 năm cho mặt cỏ, 2 năm cho hàng rào và chiếu sáng.</p>
    `,
    icon: 'Settings',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
    features: [
      'Bảo hành 5 năm mặt cỏ',
      'Bảo trì định kỳ theo gói',
      'Phản hồi trong 24h',
      'Đội kỹ thuật trực tuyến',
    ],
    order: 3,
    isPublished: true,
  },
];

const projectData = [
  {
    title: 'Sân bóng đá cỏ nhân tạo Hòa Bình Sport',
    slug: 'san-bong-da-co-nhan-tao-hoa-binh-sport',
    category: 'bong-da',
    location: 'Hòa Bình, TP. Hạ Long, Quảng Ninh',
    area: 1200,
    year: 2024,
    client: 'Trung tâm Thể thao Hòa Bình',
    description:
      'Sân bóng đá 7 người với cỏ nhân tạo 5 thế hệ nhập khẩu từ Hàn Quốc (Sungrass), hệ thống đèn LED đủ tiêu chuẩn thi đấu ban đêm, hàng rào lưới B40 sơn tĩnh điện. Hoàn thành trong 30 ngày.',
    content: `<p>Dự án sân bóng đá Hòa Bình Sport được thi công trên diện tích 1.200m², sử dụng cỏ nhân tạo thế hệ thứ 5 nhập khẩu từ thương hiệu Sungrass (Hàn Quốc) với sợi cỏ cao 50mm, mật độ dày, độ bền cao...</p>`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1200&q=80',
        alt: 'Sân bóng đá cỏ nhân tạo Hòa Bình Sport - Toàn cảnh',
        caption: 'Toàn cảnh sân sau khi hoàn thành',
      },
      {
        url: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=1200&q=80',
        alt: 'Chi tiết mặt cỏ nhân tạo',
        caption: 'Cỏ nhân tạo 5 thế hệ - Sungrass Hàn Quốc',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80',
    featured: true,
    isPublished: true,
  },
  {
    title: 'Cụm sân Pickleball Bãi Cháy Marina',
    slug: 'cum-san-pickleball-bai-chay-marina',
    category: 'pickleball',
    location: 'Bãi Cháy, TP. Hạ Long, Quảng Ninh',
    area: 960,
    year: 2024,
    client: 'Khu du lịch Bãi Cháy Marina',
    description:
      'Cụm 4 sân pickleball ngoài trời với mặt sân sơn PU đàn hồi Hàn Quốc, lưới chuẩn thi đấu, kẻ vạch rõ ràng, mái che lưới chống nắng. Phục vụ khách du lịch và cư dân khu vực.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
        alt: 'Cụm sân Pickleball Bãi Cháy Marina',
        caption: 'Cụm 4 sân Pickleball hoàn chỉnh',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    featured: true,
    isPublished: true,
  },
  {
    title: 'Sân tennis & cầu lông Công đoàn Quảng Ninh',
    slug: 'san-tennis-cau-long-cong-doan-quang-ninh',
    category: 'tennis',
    location: 'Uông Bí, Quảng Ninh',
    area: 2800,
    year: 2023,
    client: 'Liên đoàn Lao động tỉnh Quảng Ninh',
    description:
      'Phức hợp 2 sân tennis mặt sân acrylic và 6 sân cầu lông sàn gỗ bồ đề trong nhà tại Cung Thể thao Công đoàn Quảng Ninh. Đạt chuẩn thi đấu phong trào cấp tỉnh.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200&q=80',
        alt: 'Sân tennis Công đoàn Quảng Ninh',
        caption: 'Sân tennis mặt acrylic tiêu chuẩn',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    featured: true,
    isPublished: true,
  },
  {
    title: 'Sân bóng rổ trường THPT Hạ Long',
    slug: 'san-bong-ro-truong-thpt-ha-long',
    category: 'bong-ro',
    location: 'Hồng Gai, TP. Hạ Long, Quảng Ninh',
    area: 420,
    year: 2023,
    client: 'Trường THPT Hạ Long',
    description:
      'Sân bóng rổ ngoài trời với mặt sân đổ nhựa đường + sơn acrylic màu xanh đỏ, vòng rổ chuẩn NBA, kẻ vạch 3D chuyên nghiệp, phục vụ học sinh và hoạt động ngoại khóa.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546519638405-a9b08d4e2a8c?w=1200&q=80',
        alt: 'Sân bóng rổ THPT Hạ Long',
        caption: 'Sân bóng rổ với mặt sơn acrylic 2 màu',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1546519638405-a9b08d4e2a8c?w=800&q=80',
    featured: false,
    isPublished: true,
  },
  {
    title: 'Sân bóng đá mini Khu đô thị Vinhomes Star',
    slug: 'san-bong-da-mini-khu-do-thi-vinhomes-star',
    category: 'bong-da',
    location: 'Hạ Long, Quảng Ninh',
    area: 650,
    year: 2024,
    client: 'Ban Quản lý Vinhomes Star',
    description:
      'Sân bóng đá 5 người tại khu đô thị Vinhomes Star, cỏ nhân tạo Oryzon thế hệ mới, hàng rào kính cường lực an toàn, đèn LED tiết kiệm điện. Thiết kế sang trọng phù hợp với không gian đô thị cao cấp.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80',
        alt: 'Sân bóng đá mini Vinhomes Star',
        caption: 'Sân bóng đá 5 người tại Vinhomes',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    featured: true,
    isPublished: true,
  },
  {
    title: 'Đường chạy điền kinh TDTT Cẩm Phả',
    slug: 'duong-chay-dien-kinh-tdtt-cam-pha',
    category: 'duong-chay',
    location: 'Cẩm Phả, Quảng Ninh',
    area: 3200,
    year: 2022,
    client: 'Trung tâm TDTT TP. Cẩm Phả',
    description:
      'Đường chạy điền kinh 400m 8 làn chuẩn IAAF, mặt sân cao su EPDM nhập khẩu Hàn Quốc, kẻ vạch đạt tiêu chuẩn thi đấu quốc gia. Kết hợp sân bóng đá cỏ nhân tạo ở trung tâm.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=1200&q=80',
        alt: 'Đường chạy điền kinh Cẩm Phả',
        caption: 'Đường chạy 8 làn chuẩn IAAF',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=800&q=80',
    featured: false,
    isPublished: true,
  },
];

const testimonialData = [
  {
    name: 'Anh Nguyễn Văn Hùng',
    role: 'Chủ đầu tư',
    company: 'Trung tâm Thể thao Hòa Bình',
    content:
      'VietHan Sports đã thi công sân bóng cho trung tâm tôi đúng tiến độ, chất lượng cỏ nhân tạo rất tốt, sau 1 năm vẫn như mới. Đội thợ chuyên nghiệp, làm việc cẩn thận. Tôi rất hài lòng và sẽ tiếp tục hợp tác cho dự án tiếp theo.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    projectRef: 'Sân bóng đá Hòa Bình Sport',
    order: 0,
    isPublished: true,
  },
  {
    name: 'Chị Trần Thị Mai',
    role: 'Giám đốc Khu du lịch',
    company: 'Bãi Cháy Marina Resort',
    content:
      'Cụm sân pickleball do VietHan Sports thi công được khách hàng của chúng tôi rất ưa thích. Mặt sân đẹp, êm, không trượt. Công trình bàn giao trước hạn 3 ngày – điều rất hiếm thấy trong ngành xây dựng. Chắc chắn sẽ giới thiệu cho bạn bè.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    projectRef: 'Cụm sân Pickleball Bãi Cháy Marina',
    order: 1,
    isPublished: true,
  },
  {
    name: 'Ông Phạm Đức Thanh',
    role: 'Phó Hiệu trưởng',
    company: 'Trường THPT Hạ Long',
    content:
      'Chúng tôi đã tham khảo nhiều đơn vị nhưng chọn VietHan Sports vì họ tư vấn rất tận tâm, báo giá minh bạch không phát sinh. Sân bóng rổ cho học sinh hoàn thành trong dịp hè, kịp đưa vào sử dụng đầu năm học. Học sinh rất thích!',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    rating: 5,
    projectRef: 'Sân bóng rổ THPT Hạ Long',
    order: 2,
    isPublished: true,
  },
  {
    name: 'Anh Lê Minh Quân',
    role: 'Ban Quản lý',
    company: 'Vinhomes Star Hạ Long',
    content:
      'Điểm tôi đánh giá cao nhất ở VietHan Sports là thái độ chuyên nghiệp và vật liệu chính hãng có kiểm định rõ ràng. Sân bóng mini cho cư dân của chúng tôi được hoàn thành đúng thiết kế 3D đã duyệt. Rất đáng tiền!',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    rating: 5,
    projectRef: 'Sân bóng mini Vinhomes Star',
    order: 3,
    isPublished: true,
  },
];

const postData = [
  {
    title: 'Cách chọn cỏ nhân tạo cho sân bóng đá: Tiêu chí và sai lầm cần tránh',
    slug: 'cach-chon-co-nhan-tao-cho-san-bong-da',
    excerpt:
      'Cỏ nhân tạo là yếu tố quan trọng nhất quyết định chất lượng sân. Bài viết này giúp bạn hiểu rõ các loại cỏ, thế hệ cỏ và cách chọn phù hợp với ngân sách.',
    content: `
      <h2>Cỏ nhân tạo có mấy thế hệ?</h2>
      <p>Hiện nay trên thị trường Việt Nam phổ biến 3 thế hệ cỏ nhân tạo:</p>
      <ul>
        <li><strong>Thế hệ 3 (3G):</strong> Sợi cỏ thẳng, cứng, ít dùng cho sân bóng đá vì dễ gây trầy xước</li>
        <li><strong>Thế hệ 4 (4G):</strong> Sợi cỏ xoăn + sợi thẳng kết hợp, mềm mại hơn, phổ biến nhất hiện tại</li>
        <li><strong>Thế hệ 5 (5G):</strong> Công nghệ mới nhất, sợi hình chữ S xoắn, không cần hạt cao su, thân thiện môi trường</li>
      </ul>
      <h2>Tiêu chí chọn cỏ nhân tạo tốt</h2>
      <p>Để chọn được cỏ nhân tạo chất lượng, bạn cần chú ý:</p>
      <ol>
        <li><strong>Chiều cao sợi cỏ:</strong> Sân 5 người dùng 40-45mm, sân 7-11 người dùng 50-60mm</li>
        <li><strong>Mật độ sợi cỏ:</strong> Tối thiểu 10.000 sợi/m² – càng dày càng bền và êm chân</li>
        <li><strong>Chất liệu PE/PP:</strong> PE (Polyethylene) mềm hơn, thân thiện với da hơn PP</li>
        <li><strong>Xuất xứ:</strong> Ưu tiên hàng Hàn Quốc, Đức, Tây Ban Nha có chứng nhận FIFA</li>
        <li><strong>Lớp backing:</strong> Lớp đế 2 lớp có lỗ thoát nước, không bị phồng rộp khi mưa</li>
      </ol>
      <h2>Sai lầm thường gặp khi chọn cỏ</h2>
      <p>Nhiều khách hàng mắc phải những sai lầm sau:</p>
      <ul>
        <li>Chọn cỏ giá rẻ không rõ nguồn gốc – phai màu và xuống cấp sau 1-2 năm</li>
        <li>Không yêu cầu chứng chỉ kiểm định khi nhập hàng</li>
        <li>Bỏ qua lớp đệm cao su bên dưới cỏ – giảm chấn thương cho vận động viên</li>
      </ul>
      <p>Liên hệ VietHan Sports để được tư vấn chọn cỏ phù hợp với dự án của bạn!</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&q=80',
    tags: ['cỏ nhân tạo', 'sân bóng đá', 'kiến thức', 'thi công sân'],
    isPublished: true,
    publishedAt: new Date('2024-08-15'),
    authorName: 'VietHan Sports',
    viewCount: 1245,
    metaTitle: 'Cách chọn cỏ nhân tạo sân bóng đá chuẩn | VietHan Sports',
    metaDescription: 'Hướng dẫn chọn cỏ nhân tạo cho sân bóng đá: tiêu chí về thế hệ cỏ, mật độ, xuất xứ và những sai lầm cần tránh khi đầu tư sân bóng.',
  },
  {
    title: 'Báo giá thi công sân bóng đá cỏ nhân tạo 2024 tại Quảng Ninh',
    slug: 'bao-gia-thi-cong-san-bong-da-co-nhan-tao-2024-quang-ninh',
    excerpt:
      'Bảng giá tham khảo thi công sân bóng đá cỏ nhân tạo năm 2024 tại Hạ Long, Quảng Ninh. Các yếu tố ảnh hưởng đến giá thành và cách tối ưu chi phí.',
    content: `
      <h2>Báo giá tham khảo sân bóng đá cỏ nhân tạo 2024</h2>
      <p>Chi phí thi công một sân bóng đá cỏ nhân tạo phụ thuộc vào nhiều yếu tố. Dưới đây là báo giá tham khảo (chưa bao gồm VAT):</p>
      <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
        <thead>
          <tr style="background:#16A34A; color:white;">
            <th style="padding:12px; text-align:left;">Hạng mục</th>
            <th style="padding:12px; text-align:right;">Đơn giá (VNĐ/m²)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px;">Cỏ nhân tạo 4G phổ thông</td>
            <td style="padding:12px; text-align:right;">280.000 – 380.000</td>
          </tr>
          <tr style="border-bottom:1px solid #eee; background:#f9f9f9;">
            <td style="padding:12px;">Cỏ nhân tạo 5G cao cấp (Hàn Quốc)</td>
            <td style="padding:12px; text-align:right;">420.000 – 600.000</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px;">Nền bê tông + thoát nước</td>
            <td style="padding:12px; text-align:right;">150.000 – 250.000</td>
          </tr>
          <tr style="border-bottom:1px solid #eee; background:#f9f9f9;">
            <td style="padding:12px;">Hàng rào lưới B40</td>
            <td style="padding:12px; text-align:right;">350.000 – 500.000/m dài</td>
          </tr>
          <tr>
            <td style="padding:12px;">Đèn LED sân bóng (8 cột)</td>
            <td style="padding:12px; text-align:right;">45.000.000 – 80.000.000</td>
          </tr>
        </tbody>
      </table>
      <h3>Chi phí ước tính cho sân bóng 5 người (650m²)</h3>
      <p>Tổng chi phí hoàn thiện: <strong>450 – 700 triệu đồng</strong> tùy chọn vật liệu.</p>
      <p><em>Lưu ý: Giá trên chỉ mang tính tham khảo. Liên hệ để nhận báo giá chính xác theo dự án thực tế.</em></p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
    tags: ['báo giá', 'sân bóng đá', 'chi phí', 'cỏ nhân tạo', 'Quảng Ninh'],
    isPublished: true,
    publishedAt: new Date('2024-09-01'),
    authorName: 'VietHan Sports',
    viewCount: 2890,
    metaTitle: 'Báo giá thi công sân bóng đá cỏ nhân tạo 2024 tại Hạ Long | VietHan Sports',
    metaDescription: 'Bảng giá tham khảo thi công sân bóng đá cỏ nhân tạo năm 2024 tại Hạ Long, Quảng Ninh. Cập nhật mới nhất, minh bạch, không phát sinh.',
  },
  {
    title: 'Sân Pickleball là gì? Tất cả những gì bạn cần biết trước khi đầu tư',
    slug: 'san-pickleball-la-gi-truoc-khi-dau-tu',
    excerpt:
      'Pickleball đang bùng nổ tại Việt Nam. Bài viết cung cấp đầy đủ thông tin về kích thước sân, loại mặt sân, chi phí thi công và tiềm năng kinh doanh.',
    content: `
      <h2>Pickleball – Môn thể thao "hot" nhất 2024</h2>
      <p>Pickleball là môn thể thao kết hợp giữa tennis, bóng bàn và cầu lông, đang trở thành cơn sốt tại Việt Nam, đặc biệt ở các thành phố lớn và khu du lịch như Hạ Long.</p>
      <h2>Kích thước sân Pickleball tiêu chuẩn</h2>
      <ul>
        <li>Sân đơn: 6,1m x 13,41m</li>
        <li>Sân đôi (toàn bộ): 9,14m x 20,12m</li>
        <li>Diện tích toàn khu (bao gồm vùng an toàn): khoảng 130-200m²/sân</li>
      </ul>
      <h2>Các loại mặt sân Pickleball phổ biến</h2>
      <ol>
        <li><strong>Sơn Acrylic:</strong> Giá rẻ, bền, dễ bảo trì. Phù hợp sân ngoài trời</li>
        <li><strong>Sàn PU (Polyurethane):</strong> Êm chân, giảm chấn thương. Phù hợp sân trong nhà</li>
        <li><strong>Sàn PP (Interlock):</strong> Lắp ghép nhanh, chịu nước tốt. Phù hợp sân di động</li>
      </ol>
      <h2>Chi phí thi công sân Pickleball 2024</h2>
      <p>1 sân Pickleball tiêu chuẩn ngoài trời: <strong>80 – 150 triệu đồng</strong></p>
      <p>Cụm 4 sân trong nhà: <strong>500 – 900 triệu đồng</strong></p>
      <h2>Tiềm năng kinh doanh sân Pickleball</h2>
      <p>Với giá cho thuê 80.000 – 150.000 VNĐ/giờ/sân và thời gian khai thác 12-16 giờ/ngày, cụm 4 sân có thể thu về 5-8 triệu đồng/ngày. Thời gian hoàn vốn: 18-24 tháng.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    tags: ['pickleball', 'thi công sân', 'kiến thức', 'đầu tư'],
    isPublished: true,
    publishedAt: new Date('2024-09-20'),
    authorName: 'VietHan Sports',
    viewCount: 3456,
    metaTitle: 'Sân Pickleball là gì? Chi phí và tiềm năng kinh doanh 2024 | VietHan Sports',
    metaDescription: 'Tìm hiểu về sân Pickleball: kích thước, loại mặt sân, chi phí thi công 2024 và tiềm năng kinh doanh tại Hạ Long, Quảng Ninh.',
  },
];

const settingData = {
  key: 'main',
  companyName: 'VietHan Sports',
  companyNameFull: 'Công ty TNHH VietHan Sports',
  slogan: 'Kiến tạo sân chơi – Nâng tầm thể thao',
  address: '123 Đường Trần Quốc Nghiễn, P. Bãi Cháy, TP. Hạ Long, Quảng Ninh',
  hotline: '0901 234 567',
  email: 'info@viethansports.vn',
  zalo: '0901 234 567',
  website: 'https://viethansports.vn',
  socialLinks: {
    facebook: 'https://facebook.com/viethansports',
    youtube: 'https://youtube.com/@viethansports',
    zalo: 'https://zalo.me/0901234567',
    tiktok: 'https://tiktok.com/@viethansports',
  },
  stats: {
    projects: 100,
    years: 10,
    clients: 50,
    warranty: 100,
  },
  metaTitle: 'VietHan Sports – Thi công sân cỏ nhân tạo Hạ Long, Quảng Ninh',
  metaDescription:
    'VietHan Sports – Công ty Việt–Hàn chuyên tư vấn, thiết kế và thi công sân bóng đá cỏ nhân tạo, sân tennis, pickleball, bóng rổ, cầu lông tại Hạ Long, Quảng Ninh theo tiêu chuẩn Hàn Quốc.',
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5!2d107.0667!3d20.9517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDU3JzA2LjEiTiAxMDfCsDA0JzAwLjEiRQ!5e0!3m2!1svi!2svn!4v1234567890',
  latitude: 20.9517,
  longitude: 107.0667,
};

// ========================================================
// HÀM SEED CHÍNH
// ========================================================

const seedDatabase = async () => {
  try {
    console.log('\n🌱 ============================================');
    console.log('🌱 Bắt đầu seed dữ liệu VietHan Sports...');
    console.log('🌱 ============================================\n');

    // Kết nối DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa dữ liệu cũ
    console.log('🗑️  Xóa dữ liệu cũ...');
    await Promise.all([
      User.deleteMany({}),
      Banner.deleteMany({}),
      Service.deleteMany({}),
      Project.deleteMany({}),
      Testimonial.deleteMany({}),
      Post.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log('✅ Đã xóa dữ liệu cũ\n');

    // 1. Tạo Admin
    console.log('👤 Tạo admin user...');
    const admin = await User.create({
      name: 'Admin VietHan Sports',
      email: process.env.ADMIN_EMAIL || 'admin@viethansports.vn',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
    });
    console.log(`✅ Admin: ${admin.email} | Mật khẩu: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);

    // 2. Tạo Banners
    console.log('\n🖼️  Tạo banners...');
    const banners = await Banner.insertMany(bannerData);
    console.log(`✅ Đã tạo ${banners.length} banners`);

    // 3. Tạo Services
    console.log('\n⚙️  Tạo dịch vụ...');
    const services = await Service.insertMany(serviceData);
    console.log(`✅ Đã tạo ${services.length} dịch vụ`);

    // 4. Tạo Projects (dùng vòng lặp để trigger pre-save hook nếu cần)
    console.log('\n🏗️  Tạo dự án...');
    const projects = await Project.insertMany(projectData);
    console.log(`✅ Đã tạo ${projects.length} dự án`);

    // 5. Tạo Testimonials
    console.log('\n⭐ Tạo cảm nhận khách hàng...');
    const testimonials = await Testimonial.insertMany(testimonialData);
    console.log(`✅ Đã tạo ${testimonials.length} cảm nhận`);

    // 6. Tạo Posts
    console.log('\n📝 Tạo bài viết...');
    const posts = await Post.insertMany(
      postData.map((p) => ({ ...p, author: admin._id }))
    );
    console.log(`✅ Đã tạo ${posts.length} bài viết`);

    // 7. Tạo Setting
    console.log('\n⚙️  Tạo cài đặt công ty...');
    await Setting.create(settingData);
    console.log('✅ Đã tạo setting công ty');

    console.log('\n🎉 ============================================');
    console.log('🎉 SEED HOÀN THÀNH!');
    console.log('🎉 ============================================');
    console.log('\n📋 Thông tin đăng nhập Admin:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mật khẩu: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n🚀 Chạy server: npm run dev');
    console.log('🌐 API: http://localhost:5000/api\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi seed:', error);
    process.exit(1);
  }
};

// Chạy seed
seedDatabase();
