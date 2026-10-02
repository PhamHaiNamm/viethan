/**
 * pages/Projects.jsx – Danh sách dự án với lọc và phân trang
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, Filter } from 'lucide-react';
import { publicApi } from '../services/api';
import { CATEGORY_MAP } from '../utils/helpers';

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'bong-da',    label: '⚽ Sân bóng đá' },
  { value: 'bong-ro',    label: '🏀 Sân bóng rổ' },
  { value: 'tennis',     label: '🎾 Sân tennis' },
  { value: 'pickleball', label: '🏓 Sân pickleball' },
  { value: 'cau-long',   label: '🏸 Sân cầu lông' },
  { value: 'duong-chay', label: '🏃 Đường chạy' },
];

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', category, page],
    queryFn: () => publicApi.getProjects({ category: category || undefined, page, limit: 9 }),
  });

  const projects = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const setCategory = (cat) => {
    setPage(1);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Dự án thi công sân thể thao – VietHan Sports Hạ Long</title>
        <meta name="description" content="Danh mục các công trình sân thể thao đã thi công: sân cỏ nhân tạo, pickleball, tennis, cầu lông tại Hạ Long và Quảng Ninh." />
      </Helmet>
      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="bg-[#0B1410] py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dự án <span className="gradient-text">tiêu biểu</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Hơn 100 công trình sân thể thao đã hoàn thành trên toàn tỉnh Quảng Ninh và khu vực lân cận.
          </p>
        </section>

        {/* Filter */}
        <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === cat.value
                  ? 'bg-[#16A34A] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-72 rounded-3xl" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-gray-400">Chưa có dự án nào trong danh mục này.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => {
                  const cat = CATEGORY_MAP[project.category] || CATEGORY_MAP.khac;
                  return (
                    <motion.article
                      key={project._id}
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img src={project.thumbnail} alt={project.title} loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cat.color}`}>{cat.icon} {cat.label}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h2 className="font-black text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{project.title}</h2>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {project.location}</span>
                          <span>{project.year}</span>
                        </div>
                        <Link to={`/du-an/${project.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] hover:gap-3 transition-all">
                          Xem chi tiết <ArrowRight size={14} />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* Phân trang */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${i + 1 === page ? 'bg-[#16A34A] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#16A34A]'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
