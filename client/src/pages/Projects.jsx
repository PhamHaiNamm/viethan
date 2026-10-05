/**
 * pages/Projects.jsx – Danh sách công trình với bộ lọc đa năng, tìm kiếm từ khóa và phân trang
 */
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, Filter, Search, Sparkles, Calendar, Layers } from 'lucide-react';
import { publicApi } from '../services/api';
import { CATEGORY_MAP } from '../utils/helpers';

const CATEGORIES = [
  { value: '', label: 'Tất cả loại sân' },
  { value: 'bong-da',    label: '⚽ Sân bóng đá cỏ' },
  { value: 'pickleball', label: '🏓 Sân Pickleball' },
  { value: 'tennis',     label: '🎾 Sân Tennis' },
  { value: 'bong-ro',    label: '🏀 Sân Bóng rổ' },
  { value: 'cau-long',   label: '🏸 Sân Cầu lông' },
  { value: 'duong-chay', label: '🏃 Đường chạy' },
];

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['projects', category, page],
    queryFn: () => publicApi.getProjects({ category: category || undefined, page, limit: 12 }),
  });

  const projects = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const setCategory = (cat) => {
    setPage(1);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  // Lọc thêm theo từ khóa tìm kiếm
  const displayProjects = useMemo(() => {
    if (!searchKeyword.trim()) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (p.client && p.client.toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  }, [projects, searchKeyword]);

  return (
    <>
      <Helmet>
        <title>Dự Án Đã Thi Công – Việt – Hàn | 100+ Công Trình</title>
        <meta
          name="description"
          content="Khám phá các công trình sân bóng đá cỏ nhân tạo, cụm sân pickleball, sân tennis chất lượng cao do Công ty Việt – Hàn thi công tại Hạ Long, Cẩm Phả, Quảng Ninh."
        />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO DỰ ÁN ===== */}
        <section className="bg-[#0B1410] py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-[140px]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-6 border border-green-700/50">
              <Sparkles size={16} /> Hồ Sơ Năng Lực Thực Tế
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Dự Án <span className="gradient-text">Tiêu Biểu</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Hơn 100 công trình thể thao đẳng cấp được bàn giao đúng tiến độ, khẳng định uy tín và chất lượng chuẩn Hàn Quốc tại Quảng Ninh.
            </p>

            {/* Ô tìm kiếm nhanh */}
            <div className="max-w-xl mx-auto mt-8 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm dự án theo tên hoặc khu vực (VD: Bãi Cháy, Cẩm Phả...)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#22C55E] focus:bg-white/15 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </section>

        {/* ===== BỘ LỌC DANH MỤC ===== */}
        <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter size={16} className="text-gray-400 shrink-0 mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat.value
                    ? 'bg-[#16A34A] text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* ===== LƯỚI DỰ ÁN ===== */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-80 rounded-3xl" />
              ))}
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-semibold mb-4">Không tìm thấy công trình nào trong danh mục này.</p>
              <button
                onClick={() => { setCategory(''); setSearchKeyword(''); }}
                className="px-6 py-2.5 bg-[#16A34A] text-white text-sm font-bold rounded-xl hover:bg-[#15803D]"
              >
                Xem tất cả các dự án
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project, i) => {
                const cat = CATEGORY_MAP[project.category] || CATEGORY_MAP.khac;
                return (
                  <motion.article
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail ảnh */}
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${cat.color} shadow-sm`}>
                            {cat.icon} {cat.label}
                          </span>
                        </div>
                        {project.featured && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                            ★ Tiêu biểu
                          </div>
                        )}
                      </div>

                      {/* Thông tin */}
                      <div className="p-6">
                        <h2
                          className="font-black text-gray-900 text-base mb-3 line-clamp-2 group-hover:text-[#16A34A] transition-colors leading-snug"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {project.title}
                        </h2>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
                          <span className="flex items-center gap-1.5 truncate">
                            <MapPin size={13} className="text-[#16A34A] shrink-0" />
                            {project.location || 'Quảng Ninh'}
                          </span>
                          <span className="flex items-center gap-1.5 justify-end">
                            <Calendar size={13} className="text-[#16A34A] shrink-0" />
                            Năm {project.year || 2024}
                          </span>
                        </div>

                        {project.area && (
                          <div className="text-xs text-gray-400">
                            Quy mô: <strong className="text-gray-700">{project.area.toLocaleString('vi-VN')} m²</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <Link
                        to={`/du-an/${project.slug}`}
                        className="w-full py-3 bg-gray-50 text-gray-800 group-hover:bg-[#16A34A] group-hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        Xem chi tiết & Thư viện ảnh <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Phân trang */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    i + 1 === page
                      ? 'bg-[#16A34A] text-white shadow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#16A34A]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
