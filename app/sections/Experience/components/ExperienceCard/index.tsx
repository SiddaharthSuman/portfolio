// sections/ExperienceSection/components/ExperienceCard/index.tsx

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

import { ExperienceWithType } from '../../models/Experience';

import styles from './ExperienceCard.module.scss';

interface ExperienceCardProps {
  experience: ExperienceWithType;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`${styles.card} ${styles[experience.type]}`}>
      <h3 className={styles.title}>
        {experience.title}
        <span className={styles.organization}>
          @ {experience.organization}
          {experience.url && (
            <a
              aria-label={`Visit ${experience.organization} website`}
              className={styles.organizationLink}
              href={experience.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </span>
      </h3>

      {experience.details.length > 0 && (
        <div className={`${styles.details} ${isExpanded ? styles.expanded : ''}`}>
          <button aria-expanded={isExpanded} className={styles.expandButton} onClick={toggleExpand}>
            {isExpanded ? 'Hide Details' : `View Details (${experience.details.length})`}
          </button>

          <div className={styles.detailsContent}>
            <p className={styles.description}>{experience.description}</p>
            <ul className={styles.detailsList}>
              {experience.details.map((detail, index) => (
                <li key={index} className={styles.detailItem}>
                  <span className={styles.bullet}>▹</span>
                  {detail}
                </li>
              ))}
            </ul>

            {experience.technologies.length > 0 && (
              <div className={styles.technologies}>
                {experience.technologies.map((tech, index) => (
                  <span key={index} className={styles.technologyTag}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show technologies directly if no details to expand */}
      {experience.details.length === 0 && experience.technologies.length > 0 && (
        <div className={styles.technologies}>
          {experience.technologies.map((tech, index) => (
            <span key={index} className={styles.technologyTag}>
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;
