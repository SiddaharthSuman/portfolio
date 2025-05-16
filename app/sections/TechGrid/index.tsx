'use client';

import React, { useState, useRef } from 'react';

import expertiseData from '@/app/data/expertiseData.json';
import { useSectionAnimation } from '@/app/hooks/useSectionAnimation';

import { ExpertiseCard } from './ExpertiseCard';
import styles from './TechExpertise.module.scss';
import { ExpertiseCategory } from './types';

/**
 * TechExpertise component displays a row of expertise cards
 * Each card showcases primary skill and expands to show secondary skills
 */
const TechExpertise = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Use custom hook for section animation
  useSectionAnimation(sectionRef);

  // Handle card hover/expansion
  const handleCardToggle = (categoryId: string | null) => {
    setExpandedCard(categoryId);
  };

  return (
    <section className={styles.techSection}>
      <div className="container">
        <div ref={sectionRef} className={styles.sectionHeading}>
          <h2 className={styles.heading}>
            <span className={styles.sectionNumber}>02.</span> Skills
          </h2>
          <div className={styles.headingLine}></div>
        </div>

        {/* Expertise cards in a 2x2 grid using existing grid system */}
        <div className="row">
          {expertiseData.categories.map((category: ExpertiseCategory) => (
            <div key={category.id} className="col-sm-12 col-lg-6 mb-lg">
              <ExpertiseCard
                category={category}
                isExpanded={expandedCard === category.id}
                onToggle={handleCardToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechExpertise;
