/**
 * pages/ServiceDetail.jsx – Chi tiết dịch vụ
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import { ArrowLeft } from 'lucide-react';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => publicApi.getServiceBySlug(slug),
  });
  const svc = data?.data?.data;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-green-200 border-t-[#16A34A] rounded-full animate-spin" /></div>;
  if (isError || !svc) return (
    <div className="min-h-screen pt-24 text-center">
      <p className="text-gray-500">Không tìm thấy dịch vụ.</p>
      <Link to="/dich-vu" className="text-[#16A34A] font-semibold mt-4 inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Quay lại dịch vụ
      </Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{svc.metaTitle || `${svc.title} – VietHan Sports`}</title>
        <meta name="description" content={svc.metaDescription || svc.summary} />
      </Helmet>
      <main className="pt-20 min-h-screen">
        <section className="bg-[#0B1410] py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/dich-vu" className="inline-flex items-center gap-2 text-green-400 mb-6 hover:text-green-300 transition-colors text-sm">
              <ArrowLeft size={16} /> Tất cả dịch vụ
            </Link>
            <h1 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{svc.title}</h1>
            <p className="text-gray-400 text-lg">{svc.summary}</p>
          </div>
        </section>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            {svc.image && (
              <img src={svc.image} alt={svc.title} className="w-full h-64 object-cover rounded-3xl mb-10 shadow-lg" />
            )}
            <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: svc.content }} />
            {svc.features?.length > 0 && (
              <div className="mt-10 bg-green-50 rounded-3xl p-8">
                <h3 className="font-black text-gray-900 text-xl mb-5">Điểm nổi bật</h3>
                <ul className="space-y-3">
                  {svc.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-[#16A34A] flex items-center justify-center text-white text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-10">
              <Link to="/lien-he" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold hover:scale-105 transition-transform">
                Nhận báo giá miễn phí
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
