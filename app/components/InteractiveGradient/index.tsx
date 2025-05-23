// components/InteractiveGradient/InteractiveGradient.tsx
'use client';

import { useEffect, useRef } from 'react';

import styles from './InteractiveGradient.module.scss';

interface InteractiveGradientProps {
  /**
   * Children elements to render on top of the gradient
   */
  children?: React.ReactNode;
  /**
   * Custom className for additional styling
   */
  className?: string;
  /**
   * Speed of the cursor following (1 to 50)
   * Lower values = slower following, Higher values = faster following
   */
  followSpeed?: number;
  /**
   * Intensity of the gradient animation (0.1 to 1.0)
   * Lower values = more subtle, Higher values = more dramatic
   */
  intensity?: number;
  /**
   * Whether to show the noise texture overlay
   */
  showNoise?: boolean;
  /**
   * Variant of the gradient (affects color distribution)
   */
  variant?: 'default' | 'warm' | 'cool' | 'accent';
}

export default function InteractiveGradient({
  children,
  className = '',
  followSpeed = 20,
  intensity = 0.8,
  showNoise = true,
  variant = 'default',
}: InteractiveGradientProps) {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const interactive = interactiveRef.current;
    if (!interactive) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
      curX += (tgX - curX) / followSpeed;
      curY += (tgY - curY) / followSpeed;
      interactive.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      animationFrameRef.current = requestAnimationFrame(move);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      tgX = event.clientX - rect.left - rect.width / 2;
      tgY = event.clientY - rect.top - rect.height / 2;
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(move);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [followSpeed]);

  return (
    <div
      ref={containerRef}
      className={`${styles.gradientBackground} ${styles[variant]} ${className}`}
      style={{ '--intensity': intensity } as React.CSSProperties}
    >
      {/* Noise Texture */}
      {showNoise && (
        <svg
          className={styles.noiseBg}
          viewBox="0 0 100vw 100vw"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id={`noiseFilter-${Math.random().toString(36).substr(2, 9)}`}>
            <feTurbulence baseFrequency="0.6" stitchTiles="stitch" type="fractalNoise" />
          </filter>
          <rect
            filter={`url(#noiseFilter-${Math.random().toString(36).substr(2, 9)})`}
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
          />
        </svg>
      )}

      {/* SVG Filters */}
      <svg className={styles.svgBlur} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="goo"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gradient Elements */}
      <div className={styles.gradientsContainer}>
        <div className={`${styles.gradient} ${styles.g1}`} />
        <div className={`${styles.gradient} ${styles.g2}`} />
        <div className={`${styles.gradient} ${styles.g3}`} />
        <div className={`${styles.gradient} ${styles.g4}`} />
        <div className={`${styles.gradient} ${styles.g5}`} />
        <div ref={interactiveRef} className={`${styles.gradient} ${styles.interactive}`} />
      </div>

      {/* Content */}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
