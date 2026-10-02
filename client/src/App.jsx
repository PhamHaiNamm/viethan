/**
 * App.jsx
 * Router chính và cấu hình React Query
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar          from './components/layout/Navbar';
import Footer          from './components/layout/Footer';
import FloatingActions from './components/layout/FloatingActions';

// Auth context
import { AuthProvider, useAuth } from './context/AuthContext';

// Trang chủ – import trực tiếp (quan trọng nhất)
import Home from './pages/Home';

// Lazy load các trang khác
const About   = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Blog    = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin pages
const AdminLogin     = lazy(() => import('./pages/admin/Login'));
const AdminLayout    = lazy(() => import('./pages/admin/Layout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects  = lazy(() => import('./pages/admin/Projects'));
const AdminContacts  = lazy(() => import('./pages/admin/Contacts'));
const AdminPosts     = lazy(() => import('./pages/admin/Posts'));
const AdminBanners   = lazy(() => import('./pages/admin/Banners'));
const AdminSettings  = lazy(() => import('./pages/admin/AdminSettings'));

// Loading spinner toàn màn hình
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-[#16A34A] animate-spin" />
      <span className="text-gray-400 text-sm">Đang tải...</span>
    </div>
  </div>
);

// Layout cho các trang public
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <FloatingActions />
    <Footer />
  </>
);

// Route bảo vệ Admin
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

// Cấu hình React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>

                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={
                  <PublicLayout><Home /></PublicLayout>
                } />
                <Route path="/gioi-thieu" element={
                  <PublicLayout><About /></PublicLayout>
                } />
                <Route path="/dich-vu" element={
                  <PublicLayout><Services /></PublicLayout>
                } />
                <Route path="/dich-vu/:slug" element={
                  <PublicLayout><ServiceDetail /></PublicLayout>
                } />
                <Route path="/du-an" element={
                  <PublicLayout><Projects /></PublicLayout>
                } />
                <Route path="/du-an/:slug" element={
                  <PublicLayout><ProjectDetail /></PublicLayout>
                } />
                <Route path="/tin-tuc" element={
                  <PublicLayout><Blog /></PublicLayout>
                } />
                <Route path="/tin-tuc/:slug" element={
                  <PublicLayout><BlogDetail /></PublicLayout>
                } />
                <Route path="/lien-he" element={
                  <PublicLayout><Contact /></PublicLayout>
                } />

                {/* ===== ADMIN ROUTES ===== */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute><AdminLayout /></ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard"  element={<AdminDashboard />} />
                  <Route path="projects"   element={<AdminProjects />} />
                  <Route path="contacts"   element={<AdminContacts />} />
                  <Route path="posts"      element={<AdminPosts />} />
                  <Route path="banners"    element={<AdminBanners />} />
                  <Route path="settings"   element={<AdminSettings />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={
                  <PublicLayout>
                    <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                      <div className="text-8xl font-black text-gray-100 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>404</div>
                      <h1 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy trang</h1>
                      <p className="text-gray-500 mb-8">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                      <a href="/" className="px-8 py-3 rounded-xl bg-[#16A34A] text-white font-bold hover:bg-[#15803D] transition-colors">
                        Về trang chủ
                      </a>
                    </div>
                  </PublicLayout>
                } />
              </Routes>
            </Suspense>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: '#0B1410', color: '#fff', border: '1px solid rgba(34,197,94,0.3)' },
                success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
