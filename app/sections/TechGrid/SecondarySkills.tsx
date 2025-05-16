import React from 'react';
import Image from 'next/image';

import styles from './TechExpertise.module.scss';
import { Skill } from './types';

interface SecondarySkillsProps {
  color: string;
  isExpanded: boolean;
  secondarySkills: Skill[];
}

/**
 * SecondarySkills component - displays additional skills in an expandable section
 * Following Single Responsibility Principle by focusing only on secondary skills display
 */
export const SecondarySkills: React.FC<SecondarySkillsProps> = ({
  color,
  isExpanded,
  secondarySkills,
}) => {
  return (
    <div className={`${styles.secondarySkills} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.secondaryContent}>
        <div className={styles.divider}></div>
        <div className={styles.secondaryLabel}>Also proficient in:</div>
        <div className={`row ${styles.skillBadges}`}>
          {secondarySkills.map((skill) => (
            <div key={skill.name} className={`col-md-6 ${styles.skillBadgeContainer}`}>
              <div className={` ${styles.skillBadge}`}>
                <div
                  className={`${styles.iconContainer}`}
                  style={
                    {
                      '--color-glow': `${skill.color}90`,
                      backgroundColor: `${skill.color}15`,
                    } as React.CSSProperties
                  }
                >
                  {skill.icon ? (
                    <Image
                      alt={`${skill.name} icon`}
                      aria-hidden="true"
                      className={styles.icon}
                      height={80}
                      src={skill.icon}
                      width={80}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className={styles.smallIconPlaceholder}
                      style={{ color }}
                    >
                      •
                    </div>
                  )}
                </div>
                <div className={styles.skillBadgeTextContainer}>
                  <span className={styles.skillBadgeTitle}>{skill.name}</span>
                  <span
                    className={styles.skillBadgeDescription}
                    style={{ '--secondary-hover-color': skill.color } as React.CSSProperties}
                  >
                    {skill.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
