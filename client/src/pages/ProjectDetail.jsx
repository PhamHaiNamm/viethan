/**
 * pages/ProjectDetail.jsx – Chi tiết dự án với gallery lightbox
 */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { ArrowLeft, MapPin, Calendar, Maximize2, X } from 'lucide-react';
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-green-200 border-t-[#16A34A] rounded-full animate-spin" /></div>;
  if (isError || !project) return (
    <div className="min-h-screen pt-24 text-center px-4">
      <p className="text-gray-500 mb-4">Không tìm thấy dự án.</p>
      <Link to="/du-an" className="text-[#16A34A] font-semibold inline-flex items-center gap-2"><ArrowLeft size={16} /> Quay lại dự án</Link>
    </div>
  );

  const cat = CATEGORY_MAP[project.category] || CATEGORY_MAP.khac;

  return (
    <>
      <Helmet>
        <title>{project.metaTitle || `${project.title} – VietHan Sports`}</title>
        <meta name="description" content={project.metaDescription || project.description} />
      </Helmet>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-white bg-white/10 rounded-full p-2 hover:bg-white/20">
              <X size={24} />
            </button>
            <img src={project.images[lightbox]?.url} alt={project.images[lightbox]?.alt} className="max-h-[90vh] max-w-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
            {project.images[lightbox]?.caption && (
              <p className="absolute bottom-6 text-gray-300 text-sm">{project.images[lightbox].caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="bg-[#0B1410] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <Link to="/du-an" className="inline-flex items-center gap-2 text-green-400 mb-5 hover:text-green-300 text-sm">
              <ArrowLeft size={16} /> Tất cả dự án
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${cat.color}`}>{cat.icon} {cat.label}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{project.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
              {project.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-green-400" /> {project.location}</span>}
              {project.year     && <span className="flex items-center gap-1.5"><Calendar size={14} className="text-green-400" /> Năm {project.year}</span>}
              {project.area     && <span>📐 {project.area.toLocaleString('vi-VN')} m²</span>}
              {project.client   && <span>👤 {project.client}</span>}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            {/* Gallery */}
            {project.images?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {project.images.map((img, i) => (
                  <div key={i} className="relative group aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightbox(i)}>
                    <img src={img.url} alt={img.alt || project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mô tả */}
            {project.description && <p className="text-gray-600 text-lg leading-relaxed mb-8">{project.description}</p>}
            {project.content && <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: project.content }} />}

            {/* Dự án liên quan */}
            {related.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Dự án tương tự</h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  {related.map((p) => (
                    <Link key={p._id} to={`/du-an/${p.slug}`} className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={p.thumbnail} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{p.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {p.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <Link to="/lien-he" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold hover:scale-105 transition-transform">
                Liên hệ thi công tương tự
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
