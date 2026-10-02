/**
 * pages/Services.jsx – Danh sách dịch vụ
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { publicApi } from '../services/api';

export default function Services() {
  const { data, isLoading } = useQuery({ queryKey: ['services'], queryFn: publicApi.getServices });
  const services = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Dịch vụ thi công sân thể thao – VietHan Sports</title>
        <meta name="description" content="Tư vấn, thiết kế, thi công và bảo trì sân bóng đá cỏ nhân tạo, tennis, pickleball tại Hạ Long, Quảng Ninh." />
      </Helmet>
      <main className="pt-20 min-h-screen">
        <section className="bg-[#0B1410] py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dịch vụ <span className="gradient-text">trọn gói</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Từ tư vấn đến bàn giao – chúng tôi đảm nhận toàn bộ quy trình thi công sân thể thao.
          </p>
        </section>
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {isLoading ? (
              [1,2,3,4].map(i => <div key={i} className="skeleton h-64 rounded-3xl" />)
            ) : services.map((svc, i) => (
              <motion.div
                key={svc._id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
              >
                <h2 className="text-xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{svc.title}</h2>
                <p className="text-gray-500 mb-5">{svc.summary}</p>
                {svc.features?.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {svc.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#16A34A] mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link to={`/dich-vu/${svc.slug}`} className="inline-flex items-center gap-1.5 text-[#16A34A] font-semibold hover:gap-3 transition-all">
                  Xem chi tiết <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
