/**
 * hooks/useTypewriter.js
 * Hook typewriter – gõ văn bản tự động, luân phiên nhiều chuỗi
 */
import { useState, useEffect, useRef } from 'react';

/**
 * @param {string[]} texts - Mảng các chuỗi sẽ được gõ tuần tự
 * @param {number} typeSpeed  - Tốc độ gõ (ms/ký tự)
 * @param {number} deleteSpeed - Tốc độ xóa (ms/ký tự)
 * @param {number} pause - Thời gian dừng sau khi gõ xong (ms)
 */
const useTypewriter = (texts, typeSpeed = 80, deleteSpeed = 40, pause = 1800) => {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!texts?.length) return;

    const currentText = texts[textIndex];

    const tick = () => {
      if (!isDeleting) {
        // Đang gõ
        if (displayed.length < currentText.length) {
          setDisplayed(currentText.slice(0, displayed.length + 1));
          timeoutRef.current = setTimeout(tick, typeSpeed);
        } else {
          // Đã gõ xong → dừng rồi bắt đầu xóa
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        // Đang xóa
        if (displayed.length > 0) {
          setDisplayed((prev) => prev.slice(0, -1));
          timeoutRef.current = setTimeout(tick, deleteSpeed);
        } else {
          // Xóa xong → chuyển sang text tiếp theo
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isDeleting, textIndex, texts, typeSpeed, deleteSpeed, pause]);

  return displayed;
};

export default useTypewriter;
