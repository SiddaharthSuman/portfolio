// components/ScrollNavigator/index.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

import useScrollSections from '@/app/hooks/useScrollSections';

import styles from './ScrollNavigator.module.scss';

const ScrollNavigator = ({ sections = [] }: { sections: { id: string; name: string }[] }) => {
  const [showNavigator, setShowNavigator] = useState(false);
  const { currentSection, nextSection, prevSection, scrollToSection, totalSections } =
    useScrollSections(sections.map((section) => section.id));

  // Show navigator after initial scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowNavigator(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!showNavigator) return null;

  return (
    <div className={styles.navigator}>
      <button
        aria-label="Navigate to previous section"
        className={styles.navButton}
        disabled={currentSection === 0}
        onClick={prevSection}
      >
        <ChevronUp size={20} />
      </button>

      <div className={styles.indicators}>
        {sections.map((section, index) => (
          <button
            key={index}
            aria-current={currentSection === index}
            aria-label={`Navigate to ${section.name}`}
            className={`${styles.indicator} ${currentSection === index ? styles.active : ''}`}
            onClick={() => scrollToSection(index)}
          >
            <span className={styles.indicatorTooltip}>{section.name}</span>
          </button>
        ))}
      </div>

      <button
        aria-label="Navigate to next section"
        className={styles.navButton}
        disabled={currentSection === totalSections - 1}
        onClick={nextSection}
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default ScrollNavigator;
