/**
 * pages/ProjectDetail.jsx – Chi tiết dự án với gallery lightbox, bảng thông số kỹ thuật & dự án liên quan
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { 
  ArrowLeft, MapPin, Calendar, Maximize2, X, ChevronLeft, 
  ChevronRight, CheckCircle2, ShieldCheck, Ruler, UserCheck 
} from 'lucide-react';
import { CATEGORY_MAP } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => publicApi.getProjectBySlug(slug),
  });

  const project = data?.data?.data?.project;
  const related  = data?.data?.data?.related || [];

  const handlePrevImage = useCallback((e) => {
    e?.stopPropagation();
    if (!project?.images?.length) return;
    setLightbox((prev) => (prev > 0 ? prev - 1 : project.images.length - 1));
  }, [project?.images?.length]);

  const handleNextImage = useCallback((e) => {
    e?.stopPropagation();
    if (!project?.images?.length) return;
    setLightbox((prev) => (prev < project.images.length - 1 ? prev + 1 : 0));
  }, [project?.images?.length]);

  // Bắt phím Escape & mũi tên điều hướng
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, handlePrevImage, handleNextImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-200 border-t-[#16A34A] rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Đang tải chi tiết dự án...</span>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <div className="max-w-md mx-auto bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <p className="text-gray-600 mb-6 text-base font-semibold">Dự án không tồn tại hoặc đã được cập nhật.</p>
          <Link
            to="/du-an"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803D] transition-all"
          >
            <ArrowLeft size={16} /> Quay lại danh sách dự án
          </Link>
        </div>
      </div>
    );
  }

  const cat = CATEGORY_MAP[project.category] || CATEGORY_MAP.khac;

  return (
    <>
      <Helmet>
        <title>{project.metaTitle || `${project.title} – VietHan Sports`}</title>
        <meta name="description" content={project.metaDescription || project.description} />
      </Helmet>

      {/* ===== LIGHTBOX MODAL TOÀN MÀN HÌNH ===== */}
      <AnimatePresence>
        {lightbox !== null && project.images?.[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-3 transition-colors z-20"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>

            {/* Nút Prev */}
            {project.images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 rounded-full p-3 transition-colors z-20"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Ảnh hiện tại */}
            <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <img
                src={project.images[lightbox]?.url}
                alt={project.images[lightbox]?.alt || project.title}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              />
              {/* Caption */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs text-center max-w-lg">
                <span>{project.images[lightbox]?.caption || `${project.title} (${lightbox + 1}/${project.images.length})`}</span>
              </div>
            </div>

            {/* Nút Next */}
            {project.images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 rounded-full p-3 transition-colors z-20"
                aria-label="Ảnh sau"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO DỰ ÁN ===== */}
        <section className="bg-[#0B1410] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/du-an"
              className="inline-flex items-center gap-2 text-green-400 mb-6 hover:text-green-300 text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Danh sách tất cả dự án
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${cat.color}`}>
                {cat.icon} {cat.label}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ★ Công trình tiêu biểu
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {project.title}
            </h1>

            {/* Thẻ thông số tóm tắt */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="text-[#22C55E] shrink-0" size={18} />
                <div>
                  <div className="text-[11px] text-gray-400">Địa điểm</div>
                  <div className="text-white font-semibold truncate">{project.location || 'Hạ Long, Quảng Ninh'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Ruler className="text-[#22C55E] shrink-0" size={18} />
                <div>
                  <div className="text-[11px] text-gray-400">Diện tích quy mô</div>
                  <div className="text-white font-semibold">{project.area ? `${project.area.toLocaleString('vi-VN')} m²` : 'Đang cập nhật'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-[#22C55E] shrink-0" size={18} />
                <div>
                  <div className="text-[11px] text-gray-400">Năm hoàn thành</div>
                  <div className="text-white font-semibold">Năm {project.year || 2024}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserCheck className="text-[#22C55E] shrink-0" size={18} />
                <div>
                  <div className="text-[11px] text-gray-400">Chủ đầu tư</div>
                  <div className="text-white font-semibold truncate">{project.client || 'Cá nhân / Doanh nghiệp'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== THÔNG TIN CHI TIẾT & GALLERY ===== */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* CỘT CHÍNH (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Gallery hình ảnh thực tế */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Hình ảnh thực tế công trình
                  </h2>
                  <span className="text-xs text-gray-400">Nhấp vào ảnh để phóng to</span>
                </div>

                {project.images?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightbox(idx)}
                        className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all ${
                          idx === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {img.caption && (
                          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[11px]">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden aspect-[16/9]">
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Nội dung bài viết / mô tả */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Giới thiệu & Quá trình thi công
                </h3>
                {project.description && (
                  <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium">
                    {project.description}
                  </p>
                )}

                {project.content ? (
                  <div
                    className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                ) : (
                  <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                    <p>
                      Công trình <strong>{project.title}</strong> được VietHan Sports triển khai đáp ứng trọn vẹn các yêu cầu khắt khe của chủ đầu tư về tính thẩm mỹ, độ phẳng nền và khả năng chịu tải trọng khai thác mật độ cao.
                    </p>
                    <p>
                      Đội ngũ kỹ thuật đã xử lý nền móng lu lèn kỹ lưỡng, áp dụng hệ thống rãnh thoát nước ngầm chống ứ đọng nước cục bộ vào mùa mưa tại Quảng Ninh. Mặt sân sử dụng vật liệu nhập khẩu trực tiếp từ Hàn Quốc, đem đến trải nghiệm thi đấu chuyên nghiệp và an toàn cho người chơi.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR TÓM TẮT & LIÊN HỆ */}
            <div className="space-y-8 sticky top-24">
              {/* Bảng thông số kỹ thuật công trình */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                <h3 className="font-black text-gray-900 text-lg mb-4 pb-3 border-b border-gray-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Thông số kỹ thuật
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Phân loại sân:</span>
                    <span className="font-semibold text-gray-900">{cat.label}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Quy mô diện tích:</span>
                    <span className="font-semibold text-gray-900">{project.area ? `${project.area.toLocaleString('vi-VN')} m²` : '–'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Địa bàn thi công:</span>
                    <span className="font-semibold text-gray-900">{project.location || 'Quảng Ninh'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Tiêu chuẩn công nghệ:</span>
                    <span className="font-semibold text-[#16A34A]">Chuẩn Hàn Quốc</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Chính sách bảo hành:</span>
                    <span className="font-bold text-gray-900">5 năm trọn gói</span>
                  </div>
                </div>
              </div>

              {/* Khối kích cầu tư vấn */}
              <div className="bg-[#0B1410] text-white rounded-3xl p-6 border border-green-500/20 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Muốn làm sân tương tự?
                </h4>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  VietHan Sports hỗ trợ lập dự toán và thiết kế phối cảnh 3D miễn phí cho mô hình sân của bạn.
                </p>
                <Link
                  to="/lien-he"
                  className="block w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm rounded-xl transition-all shadow-lg"
                >
                  Nhận Báo Giá Dự Án Này
                </Link>
              </div>
            </div>

          </div>

          {/* DỰ ÁN LIÊN QUAN */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Các dự án cùng thể loại
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel._id}
                    to={`/du-an/${rel.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={rel.thumbnail}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#16A34A] transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <MapPin size={11} /> {rel.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
