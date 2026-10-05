/**
 * pages/Home.jsx
 * Trang chủ – ghép tất cả sections
 */
import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';

// Import trực tiếp các section quan trọng (không lazy để tránh CLS)
import HeroBanner           from '../components/home/HeroBanner';
import ServicesSection      from '../components/home/ServicesSection';

// Lazy load các section phía dưới (code splitting)
const WhyUsSection          = lazy(() => import('../components/home/WhyUsSection'));
const ProcessSection        = lazy(() => import('../components/home/ProcessSection'));
const FeaturedProjects      = lazy(() => import('../components/home/FeaturedProjects'));
const TestimonialsSection   = lazy(() => import('../components/home/TestimonialsSection'));
const ContactFormSection    = lazy(() => import('../components/home/ContactFormSection'));

// Loading placeholder
const SectionSkeleton = () => (
  <div className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 space-y-4">
      <div className="skeleton h-8 w-48 rounded-full mx-auto" />
      <div className="skeleton h-12 w-80 rounded-xl mx-auto" />
      <div className="grid grid-cols-3 gap-6 mt-10">
        {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <Helmet>
        <title>VIỆT - HÀN – Thi công sân thể thao chuẩn Hàn Quốc tại Hạ Long, Quảng Ninh</title>
        <meta name="description" content="VIỆT - HÀN chuyên tư vấn, thiết kế và thi công sân bóng đá cỏ nhân tạo, tennis, pickleball, bóng rổ, cầu lông tại Hạ Long, Quảng Ninh. Chuẩn Hàn Quốc. Bảo hành 5 năm." />
        <meta name="keywords" content="thi công sân cỏ nhân tạo Hạ Long, sân bóng đá Quảng Ninh, sân pickleball, sân tennis, Việt Hàn" />
        <meta property="og:title" content="VIỆT - HÀN – Thi công sân thể thao chuẩn Hàn Quốc" />
        <meta property="og:description" content="Chuyên gia tư vấn, thiết kế và thi công sân thể thao Việt–Hàn tại Hạ Long, Quảng Ninh." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://viethansports.vn" />
      </Helmet>

      <main>
        {/* Hero Banner – section quan trọng nhất, không lazy */}
        <HeroBanner />

        {/* Dịch vụ */}
        <ServicesSection />

        {/* Phần còn lại lazy load */}
        <Suspense fallback={<SectionSkeleton />}>
          <WhyUsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ProcessSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedProjects />
        </Suspense>

        <Suspense fallback={<div className="py-20 bg-[#0B1410]" />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactFormSection />
        </Suspense>
      </main>
    </>
  );
}
