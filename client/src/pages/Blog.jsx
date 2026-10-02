/**
 * pages/Blog.jsx – Danh sách bài viết tin tức
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { ArrowRight, Calendar, Eye } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function Blog() {
  const { data, isLoading } = useQuery({ queryKey: ['posts'], queryFn: () => publicApi.getPosts({ limit: 9 }) });
  const posts = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Tin tức & Kiến thức thi công sân thể thao – VietHan Sports</title>
        <meta name="description" content="Kiến thức về cỏ nhân tạo, báo giá sân thể thao, hướng dẫn bảo dưỡng và tin tức mới nhất từ VietHan Sports." />
      </Helmet>
      <main className="pt-20 min-h-screen">
        <section className="bg-[#0B1410] py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Tin tức & <span className="gradient-text">Kiến thức</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Cập nhật kiến thức về thi công sân thể thao, chọn vật liệu và xu hướng mới nhất trong ngành.
          </p>
        </section>
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {isLoading ? [1,2,3].map(i => <div key={i} className="skeleton h-80 rounded-3xl" />) : posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                {post.thumbnail && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={post.thumbnail} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(post.publishedAt || post.createdAt)}</span>
                    {post.viewCount > 0 && <span className="flex items-center gap-1"><Eye size={11} /> {post.viewCount}</span>}
                  </div>
                  <h2 className="font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-[#16A34A] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>{post.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  <Link to={`/tin-tuc/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] hover:gap-3 transition-all">
                    Đọc tiếp <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
