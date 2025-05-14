// components/SnapContainer/index.jsx
import React from 'react';
import { ReactNode } from 'react';

import styles from './SnapContainer.module.scss';

/**
 * A container component that enables scroll-snapping for its children
 */

interface SnapContainerProps {
  [key: string]: unknown;
  children: ReactNode;
  className?: string;
}

const SnapContainer: React.FC<SnapContainerProps> = ({ children, className = '', ...props }) => {
  return (
    <main className={`${styles.scrollSnapContainer} ${className}`} {...props}>
      {children}
    </main>
  );
};

export default SnapContainer;
