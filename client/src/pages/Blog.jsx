/**
 * pages/Blog.jsx – Trang tin tức & cẩm nang kiến thức thi công sân thể thao
 * Tìm kiếm bài viết, phân loại chủ đề, bài viết nổi bật
 */
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { ArrowRight, Calendar, Eye, Search, Tag, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const TOPIC_TAGS = [
  'Tất cả',
  'Cỏ nhân tạo',
  'Pickleball',
  'Báo giá sân',
  'Kỹ thuật nền móng',
  'Bảo dưỡng sân',
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag]   = useState('Tất cả');

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => publicApi.getPosts({ limit: 12 }),
  });

  const posts = data?.data?.data || [];

  // Lọc bài viết theo ô tìm kiếm và tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTag =
        activeTag === 'Tất cả' ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())));

      return matchSearch && matchTag;
    });
  }, [posts, searchTerm, activeTag]);

  // Bài viết tiêu điểm (bài đầu tiên nếu có)
  const featuredPost = posts[0];

  return (
    <>
      <Helmet>
        <title>Tin Tức & Cẩm Nang Sân Thể Thao – VietHan Sports</title>
        <meta
          name="description"
          content="Chia sẻ kinh nghiệm đầu tư sân bóng đá, quy trình thi công sân pickleball, cách bảo dưỡng cỏ nhân tạo và báo giá mới nhất tại Quảng Ninh."
        />
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO ===== */}
        <section className="bg-[#0B1410] py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold mb-6 border border-green-700/50">
              <Sparkles size={16} /> Cẩm Nang & Kinh Nghiệm Thực Tế
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Kiến Thức & <span className="gradient-text">Tin Tức Ngành</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Những bài học kinh nghiệm, tư vấn kỹ thuật và cập nhật thị trường hữu ích dành cho các chủ đầu tư sân thể thao.
            </p>

            {/* Ô tìm kiếm */}
            <div className="max-w-xl mx-auto mt-8 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết (VD: chi phí sân 7 người, cỏ 5G...)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#22C55E] focus:bg-white/15 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </section>

        {/* ===== BỘ LỌC CHỦ ĐỀ ===== */}
        <section className="bg-gray-50 border-b border-gray-200 py-4 px-4 sticky top-16 md:top-20 z-20">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Tag size={16} className="text-gray-400 shrink-0 mr-1" />
            {TOPIC_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTag === tag
                    ? 'bg-[#16A34A] text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* ===== DANH SÁCH BÀI VIẾT ===== */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-80 rounded-3xl" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-medium mb-4">Không tìm thấy bài viết phù hợp với từ khóa của bạn.</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveTag('Tất cả'); }}
                className="px-6 py-2.5 bg-[#16A34A] text-white text-sm font-bold rounded-xl hover:bg-[#15803D]"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group"
                >
                  <div>
                    {post.thumbnail && (
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#16A34A]" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        {post.viewCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Eye size={13} className="text-[#16A34A]" />
                            {post.viewCount} lượt xem
                          </span>
                        )}
                      </div>

                      <h2
                        className="text-lg font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-[#16A34A] transition-colors leading-snug"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {post.title}
                      </h2>

                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <Link
                      to={`/tin-tuc/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#16A34A] group-hover:gap-3 transition-all"
                    >
                      Đọc chi tiết <ArrowRight size={15} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
