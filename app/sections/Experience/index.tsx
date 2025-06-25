// sections/ExperienceSection/index.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';

import Timeline from './components/Timeline';
import FilterControls from './components/FilterControls';
import { experienceService } from './services/ExperienceService';
import { ExperienceType } from './models/Experience';
import styles from './ExperienceSection.module.scss';

const ExperienceSection: React.FC = () => {
  // Local state for filter
  const [filter, setFilter] = useState<'all' | ExperienceType>('all');
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get filtered experiences
  const experiences = experienceService.getFilteredExperiences(filter);

  // Handle filter change
  const handleFilterChange = (newFilter: 'all' | ExperienceType) => {
    setFilter(newFilter);
  };

  // Set up intersection observer for timeline items
  useEffect(() => {
    if (!timelineRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleItems((prev) => [...prev, entry.target.id]);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.2,
      }
    );

    // Observe timeline items after a small delay to allow rendering
    setTimeout(() => {
      const items = timelineRef.current?.querySelectorAll('[data-timeline-item]');
      items?.forEach((item) => {
        observer.observe(item);
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className={styles.experienceSection} id="experience">
      <div className="container">
        <div className={styles.sectionHeading}>
          <h2 className={styles.heading}>My Journey</h2>
          <div className={styles.headingLine}></div>
        </div>

        {/* Filter Controls with simple props */}
        <FilterControls activeFilter={filter} onFilterChange={handleFilterChange} />

        {/* Timeline with ref for animation detection and props for data */}
        <div ref={timelineRef}>
          <Timeline experiences={experiences} visibleItems={visibleItems} />
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
