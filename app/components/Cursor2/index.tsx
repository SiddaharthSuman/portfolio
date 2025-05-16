'use client';

// components/CustomCursor/index.tsx
// GSAP implementation for Next.js custom cursor with mix-blend-mode difference effect

// TODO: Expand on non-obvious cues
// TODO: Disable on smaller screens
// TODO: Implement animated view and scroll cues

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import styles from './CustomCursor.module.scss';

const CustomCursor = () => {
  // const [isVisible, setIsVisible] = useState(false);
  // const [isHovering, setIsHovering] = useState(false);
  // Reference to the cursor element
  const cursorRef = useRef<HTMLDivElement>(null);
  // Reference to the text element inside the cursor
  const textRef = useRef<HTMLDivElement>(null);

  // Check if device is touch-based
  const isTouchDevice = () => {
    return (
      typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  };

  // const trackMousePositionForRefresh = () => {
  //   const savePosition = (e: MouseEvent) => {
  //     if (typeof sessionStorage !== 'undefined') {
  //       sessionStorage.setItem(
  //         'cursorPosition',
  //         JSON.stringify({
  //           x: e.clientX,
  //           y: e.clientY,
  //         })
  //       );
  //     }
  //   };

  //   window.addEventListener('mousemove', savePosition);

  //   return () => {
  //     window.removeEventListener('mousemove', savePosition);
  //   };
  // };

  useEffect(() => {
    // Skip setup for touch devices
    if (isTouchDevice()) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Current mouse position
    let mouseX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let mouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    // If there's a cached mouse position from a previous move, use it
    // This helps when page is refreshed and mouse hasn't moved yet
    // const cachedPosition = sessionStorage.getItem('cursorPosition');
    // if (cachedPosition) {
    //   try {
    //     const { x, y } = JSON.parse(cachedPosition);
    //     mouseX = x;
    //     mouseY = y;
    //   } catch (e: unknown) {
    //     // Use fallback position if parsing fails
    //   }
    // }

    // Try to get actual mouse position if browser supports it
    if (typeof window !== 'undefined' && window.MouseEvent && 'clientX' in MouseEvent.prototype) {
      const initialEvent = window.event as MouseEvent;
      if (initialEvent && 'clientX' in initialEvent) {
        mouseX = initialEvent.clientX;
        mouseY = initialEvent.clientY;
      }
    }

    // Target cursor position (for smoother animation)
    let cursorX = 0;
    let cursorY = 0;

    // Cursor visibility state
    let isVisible = false;

    // Get cursor DOM element
    const cursor = cursorRef.current;
    const cursorText = textRef.current;
    if (!cursor || !cursorText) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Apply to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"]'
    );

    interactiveElements.forEach((el) => {
      (el as HTMLElement).style.cursor = 'none';
    });

    // Setup GSAP animation for cursor
    // Using defaults that respect reduced motion preferences
    const cursorOptions: Partial<gsap.TweenVars> = {
      duration: prefersReducedMotion ? 0 : 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    };

    // Initialize cursor position offscreen
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      opacity: 1,
      x: mouseX,
      y: mouseY,
    });

    // Hide text initially
    gsap.set(cursorText, {
      opacity: 0,
    });

    // Set initial visibility state
    // setIsVisible(true);
    isVisible = true;

    // Function to animate cursor position
    const animateCursor = () => {
      if (!isVisible) return;

      // Calculate target position
      cursorX = mouseX;
      cursorY = mouseY;

      gsap.to(cursor, {
        x: cursorX,
        y: cursorY,
        ...cursorOptions,
      });
    };

    // Update cursor position on mouse move
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // If we're not using animation, directly set position
      if (prefersReducedMotion) {
        gsap.set(cursor, {
          x: mouseX,
          y: mouseY,
        });
        return;
      }

      // Otherwise request animation frame for smoother performance
      requestAnimationFrame(animateCursor);
    };

    // Handle mouse entering the viewport
    const onMouseEnter = () => {
      // isVisible = true;
      gsap.to(cursor, {
        opacity: 1,
        duration: 0.3,
      });
    };

    // Handle mouse leaving the viewport
    const onMouseLeave = () => {
      // isVisible = false;
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.3,
      });
    };

    // Handle cursor states for interactive elements
    const onElementEnter = () => {
      // setIsHovering(true);
      // cursor.classList.add(styles.hover);

      // Show the "View" text
      gsap.to(cursorText, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      });

      gsap.to(cursor, {
        scale: 4,
        ...cursorOptions,
      });
    };

    const onElementLeave = () => {
      // setIsHovering(false);
      // cursor.classList.remove(styles.hover);

      // Hide the "View" text
      gsap.to(cursorText, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
      });

      gsap.to(cursor, {
        scale: 1,
        ...cursorOptions,
      });
    };

    // Add event listeners for interactive elements
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onElementEnter);
      el.addEventListener('mouseleave', onElementLeave);
    });

    // Add global mouse event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    // Track mouse positions
    // const cleanupTracking = trackMousePositionForRefresh();

    // Cleanup function
    return () => {
      // Kill any ongoing GSAP animations
      gsap.killTweensOf(cursor);

      // Remove event listeners
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);

      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onElementEnter);
        el.removeEventListener('mouseleave', onElementLeave);
        (el as HTMLElement).style.cursor = '';
      });

      // Restore default cursor
      document.body.style.cursor = '';

      // cleanupTracking();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && isTouchDevice()) {
    return null;
  }

  return (
    <div ref={cursorRef} aria-hidden="true" className={styles.cursor}>
      <div ref={textRef} className={styles.cursorText}>
        View
      </div>
    </div>
  );
};

export default CustomCursor;
