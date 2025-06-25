// components/LetterFx/LetterFx.tsx
'use client';

import { useEffect, useRef } from 'react';

import styles from './LetterFx.module.scss';

export type LetterFxEffect =
  | 'rainbow'
  | 'wave'
  | 'bidirectionalFade'
  | 'rainbowWave'
  | 'fadeWave'
  | 'allEffects';

export type LetterFxSpeed = 'slow' | 'normal' | 'fast';
export type LetterFxTheme = 'portfolio' | 'rainbow' | 'cool' | 'warm';

// TODO: word-break is not preserved
// TODO: sometimes entire groups are highlighted

interface LetterFxProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  effect?: LetterFxEffect;
  effects?: LetterFxEffect[];
  intensity?: number; // 0.1 to 1.0
  mobileOptimized?: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
  respectMotionPreference?: boolean;
  speed?: LetterFxSpeed;
  theme?: LetterFxTheme;
}

const LetterFx = ({
  children,
  className = '',
  disabled = false,
  effect = 'rainbow',
  effects = [],
  intensity = 0.8,
  mobileOptimized = true,
  ref,
  respectMotionPreference = true,
  speed = 'normal',
  theme = 'portfolio',
}: LetterFxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const originalContentRef = useRef<string>('');

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    if (ref) {
      ref.current = container;
    }

    // Store original content for cleanup
    originalContentRef.current = container.innerHTML;

    // Check for reduced motion preference
    if (respectMotionPreference && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Check if mobile and mobile optimization is enabled
    if (mobileOptimized && window.innerWidth < 768) {
      return;
    }

    const processTextNodes = (element: Element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

      const textNodes: Text[] = [];
      let node;

      while ((node = walker.nextNode())) {
        if (node.textContent && node.textContent.trim()) {
          textNodes.push(node as Text);
        }
      }

      textNodes.forEach((textNode) => {
        const parent = textNode.parentNode;
        if (!parent) return;

        const text = textNode.textContent || '';
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const span = document.createElement('span');
          span.className = styles.letter;

          if (char === ' ') {
            span.innerHTML = '&nbsp;';
          } else {
            span.textContent = char;
          }

          fragment.appendChild(span);
        }

        parent.replaceChild(fragment, textNode);
      });
    };

    // Process all text nodes in the container
    processTextNodes(container);

    // Cleanup function
    return () => {
      if (container && originalContentRef.current) {
        container.innerHTML = originalContentRef.current;
      }
    };
  }, [disabled, respectMotionPreference, mobileOptimized, ref]);

  // Determine which effects to apply
  const effectsToApply = effects.length > 0 ? effects : [effect];

  // Build CSS class names
  const effectClasses = effectsToApply
    .map((eff) => {
      switch (eff) {
        case 'rainbow':
          return styles.rainbowEffect;
        case 'wave':
          return styles.waveEffect;
        case 'bidirectionalFade':
          return styles.bidirectionalFadeEffect;
        case 'rainbowWave':
          return `${styles.rainbowEffect} ${styles.waveEffect}`;
        case 'fadeWave':
          return `${styles.bidirectionalFadeEffect} ${styles.waveEffect}`;
        case 'allEffects':
          return `${styles.rainbowEffect} ${styles.waveEffect} ${styles.bidirectionalFadeEffect}`;
        default:
          return styles.rainbowEffect;
      }
    })
    .join(' ');

  const speedClass = styles[`speed${speed.charAt(0).toUpperCase() + speed.slice(1)}`];
  const themeClass = styles[`theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`];

  const containerClasses = [
    styles.letterFxContainer,
    effectClasses,
    speedClass,
    themeClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{ '--intensity': intensity } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default LetterFx;
