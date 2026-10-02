/**
 * components/layout/FloatingActions.jsx
 * Các nút nổi góc phải: Zalo, điện thoại, scroll to top
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ChevronUp, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">

      {/* Zalo */}
      <a
        href="https://zalo.me/0901234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="float-btn w-12 h-12 rounded-2xl bg-[#0068FF] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_20px_rgba(0,104,255,0.5)] hover:scale-110 transition-transform"
      >
        Z
      </a>

      {/* Gọi điện */}
      <a
        href="tel:0901234567"
        aria-label="Gọi điện"
        className="float-btn w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(22,163,74,0.5)] hover:scale-110 transition-transform"
      >
        <Phone size={20} />
      </a>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Lên đầu trang"
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
