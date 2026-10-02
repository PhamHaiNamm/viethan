/**
 * pages/BlogDetail.jsx – Chi tiết bài viết
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => publicApi.getPostBySlug(slug),
  });

  const post    = data?.data?.data?.post;
  const related = data?.data?.data?.related || [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-green-200 border-t-[#16A34A] rounded-full animate-spin" /></div>;
  if (isError || !post) return (
    <div className="min-h-screen pt-24 text-center px-4">
      <p className="text-gray-500 mb-4">Không tìm thấy bài viết.</p>
      <Link to="/tin-tuc" className="text-[#16A34A] font-semibold inline-flex items-center gap-2"><ArrowLeft size={16} /> Quay lại tin tức</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || `${post.title} – VietHan Sports`}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
      </Helmet>
      <main className="pt-20 min-h-screen">
        <section className="bg-[#0B1410] py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/tin-tuc" className="inline-flex items-center gap-2 text-green-400 mb-5 hover:text-green-300 text-sm"><ArrowLeft size={16} /> Tất cả bài viết</Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-green-400" /> {formatDate(post.publishedAt || post.createdAt)}</span>
              {post.viewCount > 0 && <span className="flex items-center gap-1.5"><Eye size={14} className="text-green-400" /> {post.viewCount} lượt xem</span>}
              <span>✍️ {post.authorName}</span>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            {post.thumbnail && (
              <img src={post.thumbnail} alt={post.title} className="w-full max-h-96 object-cover rounded-3xl mb-10 shadow-lg" />
            )}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                <Tag size={14} className="text-gray-400 mt-1" />
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">#{tag}</span>
                ))}
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bài viết liên quan</h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  {related.map((p) => (
                    <Link key={p._id} to={`/tin-tuc/${p.slug}`} className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                      {p.thumbnail && <div className="aspect-video overflow-hidden"><img src={p.thumbnail} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#16A34A] transition-colors">{p.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
