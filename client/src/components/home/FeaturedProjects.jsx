/**
 * components/home/FeaturedProjects.jsx
 * Danh sách công trình tiêu biểu – Lưới ảnh sang trọng, khoảng cách thoáng đãng
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { publicApi } from '../../services/api';
import { CATEGORY_MAP } from '../../utils/helpers';

const FALLBACK_PROJECTS = [
  { _id:'1', title:'Sân bóng đá cỏ nhân tạo Hòa Bình Sport', category:'bong-da', location:'Bãi Cháy, Hạ Long', area:1500, year:2024, thumbnail:'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=700&q=80', slug:'san-bong-da-co-nhan-tao-hoa-binh-sport' },
  { _id:'2', title:'Cụm sân Pickleball Bãi Cháy Marina', category:'pickleball', location:'Hạ Long, Quảng Ninh', area:960, year:2024, thumbnail:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=700&q=80', slug:'cum-san-pickleball-bai-chay-marina' },
  { _id:'3', title:'Sân Tennis & Cầu lông Công đoàn', category:'tennis', location:'Uông Bí, Quảng Ninh', area:2800, year:2023, thumbnail:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=700&q=80', slug:'san-tennis-cau-long-cong-doan-quang-ninh' },
  { _id:'4', title:'Sân bóng đá mini Khu đô thị Vinhomes', category:'bong-da', location:'Hạ Long, Quảng Ninh', area:800, year:2024, thumbnail:'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=700&q=80', slug:'san-bong-da-mini-khu-do-thi-vinhomes-star' },
];

export default function FeaturedProjects() {
  const { data } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => publicApi.getProjects({ featured: true, limit: 4 }),
    staleTime: 5 * 60 * 1000,
  });

  const projects = data?.data?.data?.length ? data.data.data : FALLBACK_PROJECTS;

  return (
    <section className="py-24 lg:py-36 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 lg:mb-20 gap-6"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles size={14} className="text-[#16A34A]" />
              Hồ sơ năng lực thực tế
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Công trình <span className="gradient-text">tiêu biểu</span>
            </h2>
          </div>

          <Link
            to="/du-an"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-gray-200 text-gray-800 font-bold hover:border-[#16A34A] hover:text-[#16A34A] transition-all shadow-sm hover:shadow"
          >
            Xem tất cả dự án <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Grid 4 dự án */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8">
          {projects.slice(0, 4).map((project, i) => {
            const cat = CATEGORY_MAP[project.category] || CATEGORY_MAP.khac;
            return (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(22,163,74,0.12)] transition-all flex flex-col justify-between"
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
                  </div>

                  {/* Nội dung */}
                  <div className="p-6">
                    <h3
                      className="font-black text-gray-900 text-base mb-3 line-clamp-2 group-hover:text-[#16A34A] transition-colors leading-snug"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {project.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#16A34A] shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#16A34A] shrink-0" />
                        <span>Hoàn thành: Năm {project.year}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    to={`/du-an/${project.slug}`}
                    className="w-full py-2.5 bg-gray-50 group-hover:bg-[#16A34A] text-gray-700 group-hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    Xem chi tiết <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
