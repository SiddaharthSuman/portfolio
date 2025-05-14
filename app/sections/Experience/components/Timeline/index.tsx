// sections/ExperienceSection/components/Timeline/index.tsx

import React from 'react';

import TimelineNode from '../TimelineNode';
import ExperienceCard from '../ExperienceCard';
import OrganizationLogo from '../OrganizationLogo';
import { ExperienceWithType } from '../../models/Experience';

import styles from './Timeline.module.scss';

interface TimelineProps {
  experiences: ExperienceWithType[];
  visibleItems: string[];
}

const Timeline = ({ experiences, visibleItems }: TimelineProps) => {
  return (
    <div className={styles.timelineContainer} data-testid="timeline-container">
      <div aria-hidden="true" className={styles.timelineLine}></div>

      {experiences.map((experience, index) => (
        <div
          key={experience.id}
          data-timeline-item
          data-type={experience.type}
          id={experience.id}
          className={`${styles.timelineItem} ${styles[experience.type]} ${
            visibleItems.includes(experience.id) ? styles.visible : ''
          }`}
          style={
            {
              '--item-index': index,
              '--parallax-offset': '0px', // Initial value
            } as React.CSSProperties
          }
        >
          <TimelineNode type={experience.type} />

          {/* Combined container for date and logo with shared parallax effect */}
          <div className={styles.metaContainer}>
            <div className={styles.logoArea}>
              <OrganizationLogo experience={experience} />
            </div>
            <div className={styles.timelineDate}>
              <span>
                {experience.startDate} - {experience.endDate || 'Present'}
              </span>
              <span className={styles.timelineLocation}>{experience.location}</span>
            </div>
          </div>

          <ExperienceCard experience={experience} />
        </div>
      ))}
    </div>
  );
};

export default Timeline;
