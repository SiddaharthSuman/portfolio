// sections/ProjectsSection/ProjectFilter.tsx
import React from 'react';

import styles from './ProjectsSection.module.scss';

// Define the possible filter categories
export type FilterCategory = 'all' | 'web' | 'mobile' | 'design' | 'automation';

interface ProjectFilterProps {
  activeFilter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({ activeFilter, onFilterChange }) => {
  // Filter categories with their display names
  const filterCategories: { label: string; value: FilterCategory }[] = [
    { value: 'all', label: 'All' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'design', label: 'Design Systems' },
    { value: 'automation', label: 'Automation' },
  ];

  return (
    <div className={styles.projectFilters}>
      <ul className={styles.filtersList}>
        {filterCategories.map((category) => (
          <li key={category.value}>
            <button
              aria-pressed={activeFilter === category.value}
              className={`${styles.filterButton} ${
                activeFilter === category.value ? styles.activeFilter : ''
              }`}
              onClick={() => onFilterChange(category.value)}
            >
              {category.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
