import React from 'react';

import styles from './TechExpertise.module.scss';
import { ExpertiseCategory } from './types';
import { PrimarySkills } from './PrimarySkills';
import { SecondarySkills } from './SecondarySkills';

interface ExpertiseCardProps {
  category: ExpertiseCategory;
  isExpanded: boolean;
  onToggle: (categoryId: string | null) => void;
}

/**
 * ExpertiseCard component - renders a single category card
 * Following Single Responsibility Principle by handling only a single card
 */
export const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ category, isExpanded, onToggle }) => {
  return (
    <div
      className={`${styles.expertiseCard} ${isExpanded ? styles.expanded : ''}`}
      style={{ borderTopColor: category.color }}
      onMouseEnter={() => onToggle(category.id)}
      onMouseLeave={() => onToggle(null)}
    >
      {/* Category header */}
      <div className={styles.cardHeader}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        <div className={styles.indicator} style={{ backgroundColor: `${category.color}30` }}>
          <svg
            className={`${styles.arrow} ${isExpanded ? styles.rotated : ''}`}
            fill="none"
            stroke={category.color}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
      </div>

      {/* Primary skill section - always visible */}
      <PrimarySkills
        color={category.color}
        isExpanded={isExpanded}
        primarySkill={category.primarySkill}
      />

      {/* Secondary skills - revealed on hover */}
      <SecondarySkills
        color={category.color}
        isExpanded={isExpanded}
        secondarySkills={category.secondarySkills}
      />

      {/* Hover hint - only visible when not expanded */}
      <div
        className={styles.hoverHint}
        style={{
          color: category.color,
          opacity: isExpanded ? 0 : 0.6,
        }}
      >
        Hover for more
      </div>
    </div>
  );
};
