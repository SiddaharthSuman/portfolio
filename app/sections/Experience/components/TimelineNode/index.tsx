// sections/ExperienceSection/components/TimelineNode/index.tsx

import React from 'react';

import { ExperienceType } from '../../models/Experience';

import styles from './TimelineNode.module.scss';

interface TimelineNodeProps {
  type: ExperienceType;
}

const TimelineNode: React.FC<TimelineNodeProps> = ({ type }) => {
  return (
    <div className={`${styles.nodeWrapper} ${styles[type]}`}>
      <div className={styles.node}></div>
      {/* <div className={styles.connector}></div> */}
    </div>
  );
};

export default TimelineNode;
