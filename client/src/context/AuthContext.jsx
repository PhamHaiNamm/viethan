/**
 * context/AuthContext.jsx
 * Quản lý trạng thái đăng nhập Admin toàn cục
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem('viethan_token');
    if (token) {
      adminApi.getMe()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem('viethan_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await adminApi.login({ email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('viethan_token', token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('viethan_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng trong AuthProvider');
  return ctx;
};
