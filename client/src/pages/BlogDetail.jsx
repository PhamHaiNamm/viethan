/**
 * pages/BlogDetail.jsx – Chi tiết bài viết chuẩn SEO, nút chia sẻ mạng xã hội & bài viết liên quan
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { 
  ArrowLeft, Calendar, Eye, Tag, Share2, 
  Copy, Check, Phone, ArrowRight, UserCheck 
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => publicApi.getPostBySlug(slug),
  });

  const post    = data?.data?.data?.post;
  const related = data?.data?.data?.related || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết bài viết!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-200 border-t-[#16A34A] rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <div className="max-w-md mx-auto bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <p className="text-gray-600 mb-6 font-semibold">Bài viết không tồn tại hoặc đã được chuyển mục.</p>
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803D]"
          >
            <ArrowLeft size={16} /> Quay lại danh mục tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || `${post.title} – VIỆT - HÀN`}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
      </Helmet>

      <main className="pt-20 min-h-screen bg-white">
        {/* ===== HERO BÀI VIẾT ===== */}
        <section className="bg-[#0B1410] py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/tin-tuc"
              className="inline-flex items-center gap-2 text-green-400 mb-6 hover:text-green-300 text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Danh mục tin tức & cẩm nang
            </Link>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs sm:text-sm pt-4 border-t border-white/10">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-[#22C55E]" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>

              <span className="flex items-center gap-2">
                <Eye size={15} className="text-[#22C55E]" />
                {post.viewCount || 0} lượt xem
              </span>

              <span className="flex items-center gap-2">
                <UserCheck size={15} className="text-[#22C55E]" />
                Tác giả: <strong className="text-white">{post.authorName || 'Ban Chuyên Môn VIỆT - HÀN'}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ===== NỘI DUNG CHÍNH ===== */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          {/* Ảnh tiêu đề bài viết */}
          {post.thumbnail && (
            <div className="rounded-3xl overflow-hidden shadow-xl mb-12 aspect-[16/9] relative">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Đoạn mở đầu (Lead excerpt) */}
          {post.excerpt && (
            <div className="bg-green-50/60 p-6 sm:p-8 rounded-3xl border-l-4 border-[#16A34A] text-gray-700 text-base sm:text-lg leading-relaxed mb-10 font-medium">
              {post.excerpt}
            </div>
          )}

          {/* Nội dung bài viết */}
          <article
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags bài viết */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
                <Tag size={14} /> Từ khóa:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-green-100 hover:text-[#16A34A] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Khối chia sẻ bài viết */}
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Share2 size={16} className="text-[#16A34A]" /> Chia sẻ bài viết này:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Copy size={13} /> Sao chép liên kết
              </button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1877F2] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                Facebook
              </a>
              <a
                href={`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0068FF] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                Zalo
              </a>
            </div>
          </div>

          {/* Box tư vấn cuối bài viết */}
          <div className="mt-14 p-8 rounded-3xl bg-[#0B1410] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Cần chuyên gia giải đáp trực tiếp cho công trình của bạn?
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Đội ngũ kỹ sư Việt – Hàn sẵn sàng giải đáp kỹ thuật và khảo sát hiện trường miễn phí.
              </p>
            </div>
            <Link
              to="/lien-he"
              className="shrink-0 px-6 py-3.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold text-sm rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              Liên Hệ Ngay <ArrowRight size={16} />
            </Link>
          </div>

          {/* BÀI VIẾT LIÊN QUAN */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Bài viết liên quan
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    to={`/tin-tuc/${item.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
                  >
                    {item.thumbnail && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#16A34A] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Calendar size={11} /> {formatDate(item.publishedAt || item.createdAt)}
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
