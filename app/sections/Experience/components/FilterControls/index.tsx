// sections/ExperienceSection/components/FilterControls/index.tsx

import React from 'react';

import { ExperienceType } from '../../models/Experience';

import styles from './FilterControls.module.scss';

interface FilterControlsProps {
  activeFilter: 'all' | ExperienceType;
  onFilterChange: (filter: 'all' | ExperienceType) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className={styles.filterContainer}>
      <button
        aria-pressed={activeFilter === 'all'}
        className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        aria-pressed={activeFilter === 'work'}
        className={`${styles.filterButton} ${activeFilter === 'work' ? styles.active : ''}`}
        onClick={() => onFilterChange('work')}
      >
        Work
      </button>
      <button
        aria-pressed={activeFilter === 'education'}
        className={`${styles.filterButton} ${activeFilter === 'education' ? styles.active : ''}`}
        onClick={() => onFilterChange('education')}
      >
        Education
      </button>
    </div>
  );
};

export default FilterControls;
