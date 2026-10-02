/**
 * components/home/FeaturedProjects.jsx
 * Dự án nổi bật – lưới ảnh với hover effect
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, Eye } from 'lucide-react';
import { publicApi } from '../../services/api';
import { CATEGORY_MAP } from '../../utils/helpers';

const FALLBACK = [
  { _id:'1', title:'Sân bóng đá Hòa Bình Sport', category:'bong-da', location:'Hạ Long, QN', area:1200, year:2024, thumbnail:'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=600&q=80', slug:'san-bong-da-co-nhan-tao-hoa-binh-sport' },
  { _id:'2', title:'Cụm Pickleball Bãi Cháy',     category:'pickleball', location:'Hạ Long, QN', area:960, year:2024, thumbnail:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80', slug:'cum-san-pickleball-bai-chay-marina' },
  { _id:'3', title:'Sân Tennis Công đoàn QN',     category:'tennis',     location:'Uông Bí, QN', area:2800, year:2023, thumbnail:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80', slug:'san-tennis-cau-long-cong-doan-quang-ninh' },
  { _id:'4', title:'Sân bóng mini Vinhomes',      category:'bong-da',    location:'Hạ Long, QN', area:650, year:2024, thumbnail:'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80', slug:'san-bong-da-mini-khu-do-thi-vinhomes-star' },
];

export default function FeaturedProjects() {
  const { data } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => publicApi.getProjects({ featured: true, limit: 4 }),
    staleTime: 5 * 60 * 1000,
  });

  const projects = data?.data?.data?.length ? data.data.data : FALLBACK;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Dự án nổi bật
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Công trình <span className="gradient-text">tiêu biểu</span>
            </h2>
          </div>
          <Link
            to="/du-an"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-[#16A34A] hover:text-[#16A34A] transition-all"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Grid – 2 cột trên tablet, 4 cột trên desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.slice(0, 4).map((project, i) => {
            const cat = CATEGORY_MAP[project.category] || CATEGORY_MAP.khac;
            return (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="group relative rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-shadow"
              >
                {/* Ảnh */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <Link
                    to={`/du-an/${project.slug}`}
                    className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-[#22C55E] transition-colors"
                  >
                    <Eye size={16} /> Xem chi tiết
                  </Link>
                </div>

                {/* Badge category */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cat.color}`}>
                    {cat.icon} {cat.label}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {project.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {project.location}
                    </span>
                    <span>{project.area?.toLocaleString('vi-VN')} m²</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
