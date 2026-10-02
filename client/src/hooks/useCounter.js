/**
 * hooks/useCounter.js
 * Custom hook đếm số từ 0 đến target khi element vào viewport
 */
import { useState, useEffect, useRef } from 'react';

/**
 * @param {number} target - Số cuối cần đến
 * @param {number} duration - Thời gian đếm (ms)
 * @param {boolean} start - Bắt đầu đếm chưa
 */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start || target === 0) return;

    const startTime = performance.now();
    const startValue = 0;

    // Easing: ease-out cubic
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentValue = Math.round(startValue + easedProgress * (target - startValue));

      setCount(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return count;
};

export default useCounter;
