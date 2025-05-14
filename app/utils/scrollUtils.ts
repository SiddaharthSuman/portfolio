// utils/scrollUtils.js

import { MouseEvent } from 'react';

/**
 * Smoothly scrolls to a specific section with offset
 *
 * @param {string} id - The ID of the section to scroll to
 * @param {number} offset - Offset from the top (e.g., for fixed header)
 */
interface ScrollToSectionOptions {
  id: string;
  offset?: number;
}

export const scrollToSection = ({ id, offset = 80 }: ScrollToSectionOptions): void => {
  const element = document.getElementById(id);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    behavior: 'smooth',
    top: offsetPosition,
  });
};

/**
 * Handles anchor link clicks with smooth scrolling
 *
 * @param {Event} e - Click event
 * @param {number} offset - Offset from the top (e.g., for fixed header)
 */
interface HandleSmoothScrollOptions {
  e: MouseEvent;
  offset: number;
}

export const handleSmoothScroll = ({ e, offset = 80 }: HandleSmoothScrollOptions): void => {
  e.preventDefault();

  // Get the target section id from href
  const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const id = href.substring(1);
  scrollToSection({ id, offset });
};

/**
 * Checks if an element is in viewport
 *
 * @param {HTMLElement} element - The element to check
 * @param {number} offset - Additional offset
 * @returns {boolean} - True if element is in viewport
 */
export const isInViewport = (element: HTMLElement, offset = 0): boolean => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight - offset && rect.bottom >= offset;
};
