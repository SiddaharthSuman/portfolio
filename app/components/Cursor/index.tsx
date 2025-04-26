'use client';

// components/CustomCursor/index.tsx
// TypeScript implementation for Next.js custom cursor with SCSS modules

import { useCallback, useEffect, useState } from 'react';

import styles from './CustomCursor.module.scss';

interface CursorPosition {
  x: number;
  y: number;
}

// interface CustomCursorProps {
//   // Optional size override
//   color?: string;
//   // Optional z-index override
//   disabled?: boolean;
//   size?: number;
//   // Optional color override
//   zIndex?: number; // Option to disable the cursor
// }

/**
 * Custom circular cursor component that uses mix-blend-mode: difference
 * to create a color inversion effect similar to Iara Grinspun's website
 */
const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check if device is touch-based
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Update cursor position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle mouse entering the window
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Handle mouse leaving the window
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Setup interaction handlers for interactive elements
  const setupInteractiveElements = useCallback(() => {
    const handleElementEnter = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    // Target all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"]'
    );

    // Add event listeners
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleElementEnter);
      el.addEventListener('mouseleave', handleElementLeave);

      // Ensure consistent cursor style
      (el as HTMLElement).style.cursor = 'none';
    });

    // Cleanup function
    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementEnter);
        el.removeEventListener('mouseleave', handleElementLeave);
        (el as HTMLElement).style.cursor = '';
      });
    };
  }, []);

  // Initialize cursor
  useEffect(() => {
    // Skip setup for touch devices
    if (isTouchDevice()) return;

    // Check for reduced motion preference
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionMediaQuery.matches);

    // Set up reduced motion listener
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Set up interactive elements
    const cleanupInteractive = setupInteractiveElements();

    // Listen for changes to reduced motion preference
    if (typeof motionMediaQuery.addEventListener === 'function') {
      motionMediaQuery.addEventListener('change', handleReducedMotionChange);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      // Restore default cursor
      // document.body.style.cursor = '';

      // Clean up interactive elements
      cleanupInteractive();

      // Remove motion preference listener
      if (typeof motionMediaQuery.removeEventListener === 'function') {
        motionMediaQuery.removeEventListener('change', handleReducedMotionChange);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, setupInteractiveElements]);

  // Don't render anything on touch devices
  if (typeof window !== 'undefined' && isTouchDevice()) {
    return null;
  }

  // Dynamic cursor styles
  const cursorStyles = {
    transform: `translate(-50%, -50%) ${isHovering ? 'scale(2)' : 'scale(1)'}`,
    left: `${position.x}px`,
    top: `${position.y}px`,
    opacity: isVisible ? 1 : 0,
  };

  // Apply different style for reduced motion
  const cursorClassName = prefersReducedMotion
    ? `${styles.cursor} ${styles.reducedMotion}`
    : styles.cursor;

  return <div aria-hidden="true" className={cursorClassName} style={cursorStyles} />;
};

export default CustomCursor;
