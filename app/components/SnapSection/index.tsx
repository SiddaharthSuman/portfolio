// components/SnapSection/index.jsx
import React from 'react';

import styles from './SnapSection.module.scss';

/**
 * A component that provides consistent scroll-snapping behavior for sections
 */
interface SnapSectionProps {
  [key: string]: unknown;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const SnapSection: React.FC<SnapSectionProps> = ({ children, className = '', id, ...props }) => {
  return (
    <section className={`${styles.scrollSnapSection} ${className}`} id={id} {...props}>
      {children}
    </section>
  );
};

export default SnapSection;
