// hooks/useScrollSections.js
'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * A hook to manage scrolling between sections with keyboard navigation
 * @param {string[]} sectionIds - Array of section IDs to scroll between
 * @returns {Object} - currentSection and methods to navigate sections
 */
const useScrollSections = (sectionIds: string[] = []) => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Function to scroll to a specific section
  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sectionIds.length) return;

      const targetSection = document.getElementById(sectionIds[index]);
      if (!targetSection) return;

      setIsScrolling(true);
      setCurrentSection(index);

      window.scrollTo({
        behavior: 'smooth',
        top: targetSection.offsetTop,
      });

      // Reset isScrolling after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    },
    [sectionIds]
  );

  // Track scroll position and update current section
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = sectionIds.map((id) => document.getElementById(id));
      const validSections = sections.filter(Boolean);

      const scrollPosition = window.scrollY;
      const headerHeight = 80; // Adjust to match your header height

      // Find current section based on scroll position
      for (let i = 0; i < validSections.length; i++) {
        const section = validSections[i];
        if (!section) continue;
        const sectionTop = section.offsetTop - headerHeight;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling, sectionIds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input, textarea, etc.
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }

      // Arrow up/down and PageUp/PageDown for navigation
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'PageUp' ||
        e.key === 'PageDown'
      ) {
        e.preventDefault();

        const isUpDirection = e.key === 'ArrowUp' || e.key === 'PageUp';
        const newIndex = isUpDirection
          ? Math.max(0, currentSection - 1)
          : Math.min(sectionIds.length - 1, currentSection + 1);

        scrollToSection(newIndex);
      }

      // Home/End keys
      if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      }

      if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(sectionIds.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, sectionIds, scrollToSection]);

  const nextSection = () => {
    scrollToSection(currentSection + 1);
  };

  const prevSection = () => {
    scrollToSection(currentSection - 1);
  };

  return {
    currentSection,
    scrollToSection,
    nextSection,
    prevSection,
    totalSections: sectionIds.length,
  };
};

export default useScrollSections;
