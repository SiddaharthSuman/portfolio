import { useEffect, RefObject } from 'react';

// Import styles for the animation class
import styles from '../sections/TechGrid/TechExpertise.module.scss';
/**
 * Custom hook for handling section animations
 * Follows Single Responsibility Principle by focusing only on animation logic
 *
 * @param ref Reference to the element to animate
 */
export const useSectionAnimation = (ref: RefObject<HTMLDivElement | null>): void => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.classList) {
            entry.target.classList.add(styles.animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
};
