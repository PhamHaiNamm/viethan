/**
 * components/layout/FloatingActions.jsx
 * Nút nổi góc phải: Chat Zalo, Hotline gọi điện, Cuộn lên đầu trang (Back to Top)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ChevronUp } from 'lucide-react';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Zalo Button */}
      <a
        href="https://zalo.me/0901234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="w-12 h-12 rounded-2xl bg-[#0068FF] text-white flex items-center justify-center font-black text-xs shadow-[0_6px_20px_rgba(0,104,255,0.4)] hover:scale-110 active:scale-95 transition-all"
        title="Chat Zalo cùng kỹ sư"
      >
        <span>Zalo</span>
      </a>

      {/* Hotline Button */}
      <a
        href="tel:0901234567"
        aria-label="Gọi điện hotline"
        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] text-white flex items-center justify-center shadow-[0_6px_25px_rgba(22,163,74,0.5)] hover:scale-110 active:scale-95 transition-all animate-bounce"
        title="Gọi điện tư vấn 24/7"
      >
        <Phone size={20} />
      </a>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Cuộn lên đầu trang"
            className="w-12 h-12 rounded-2xl bg-gray-900/90 text-white shadow-xl hover:bg-[#16A34A] border border-gray-700/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            title="Lên đầu trang"
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
