import React from 'react';

import styles from './TechGrid.module.scss';

interface CategorySectionProps {
  children: React.ReactNode;
  title: string;
}

/**
 * CategorySection component - renders a section for a category of skills
 * Follows Single Responsibility Principle by only handling the category display
 * Follows Open/Closed Principle by accepting children for flexibility
 */
export const CategorySection: React.FC<CategorySectionProps> = ({ children, title }) => {
  return (
    <div className={styles.categorySection}>
      <h3 className={styles.categoryTitle}>{title}</h3>
      {children}
    </div>
  );
};
