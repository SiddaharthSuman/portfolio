'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Lenis with basic settings
    lenisRef.current = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // easing: (t: number) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      // smoothTouch: false, // Usually better UX to disable on touch
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Create animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
