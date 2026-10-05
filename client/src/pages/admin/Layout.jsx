/**
 * pages/admin/Layout.jsx – Layout chung cho Admin Dashboard
 */
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FolderOpen, Settings, FileText, Users,
  Image, LogOut, Menu, X, ChevronRight, MessageSquare
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/projects',  icon: FolderOpen,      label: 'Dự án' },
  { to: '/admin/contacts',  icon: MessageSquare,   label: 'Liên hệ' },
  { to: '/admin/posts',     icon: FileText,        label: 'Bài viết' },
  { to: '/admin/banners',   icon: Image,           label: 'Banner Hero' },
  { to: '/admin/settings',  icon: Settings,        label: 'Cài đặt' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [sidebarOpen, setSidebar] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ===== SIDEBAR ===== */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-[#0B1410] flex flex-col shrink-0 relative`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5 shrink-0 shadow-sm">
            <img src="/logo.jpg" alt="Việt – Hàn" className="w-full h-full object-contain" />
          </div>
          {sidebarOpen && (
            <span className="font-black text-white text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Việt – Hàn <span className="text-[#22C55E]">Admin</span>
            </span>
          )}
          <button
            onClick={() => setSidebar(!sidebarOpen)}
            className="ml-auto text-gray-500 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-[#16A34A] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center gap-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.role}</p>
              </div>
            )}
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors" title="Đăng xuất">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] hover:underline font-medium">
              Xem website
            </a>
            <ChevronRight size={14} />
            <span>Admin</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Xin chào, <strong>{user?.name}</strong></span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
