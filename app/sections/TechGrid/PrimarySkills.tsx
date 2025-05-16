import React from 'react';
import Image from 'next/image';

import styles from './TechExpertise.module.scss';
import { Skill } from './types';

interface PrimarySkillProps {
  color: string;
  isExpanded: boolean;
  primarySkill: Skill & { description?: string; experience: string };
}

/**
 * PrimarySkill component - displays the primary technology for a category
 * Following Single Responsibility Principle by focusing only on primary skill display
 */
export const PrimarySkills: React.FC<PrimarySkillProps> = ({ color, isExpanded, primarySkill }) => {
  return (
    <div className={styles.primarySkill}>
      <div
        className={`${styles.iconContainer} ${isExpanded ? styles.iconSmaller : ''}`}
        style={{ backgroundColor: `${color}15` }}
      >
        {primarySkill.icon ? (
          <Image
            alt={`${primarySkill.name} icon`}
            aria-hidden="true"
            className={styles.icon}
            height={80}
            src={primarySkill.icon}
            width={80}
          />
        ) : (
          <div className={styles.iconPlaceholder} style={{ color }}>
            {primarySkill.name.substring(0, 2)}
          </div>
        )}
      </div>
      <div className={styles.skillInfo}>
        <div className={styles.skillName}>{primarySkill.name}</div>
        <div
          className={styles.skillDescription}
          style={{ color: isExpanded ? color : 'var(--color-text-secondary)' }}
        >
          {primarySkill.description || primarySkill.experience}
        </div>
      </div>
    </div>
  );
};
