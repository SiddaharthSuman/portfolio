'use client';

import { useTheme } from '../../context/ThemeContext';

import styles from './ThemeToggle.module.scss';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className={styles.themeToggle}>
      <button
        aria-label="Light Mode"
        className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
        title="Light Mode"
        onClick={() => setTheme('light')}
      >
        <svg
          fill="none"
          height="20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" x2="12" y1="1" y2="3"></line>
          <line x1="12" x2="12" y1="21" y2="23"></line>
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64"></line>
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78"></line>
          <line x1="1" x2="3" y1="12" y2="12"></line>
          <line x1="21" x2="23" y1="12" y2="12"></line>
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36"></line>
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22"></line>
        </svg>
      </button>
      <button
        aria-label="Dark Mode"
        className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
        title="Dark Mode"
        onClick={() => setTheme('dark')}
      >
        <svg
          fill="none"
          height="20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
      <button
        aria-label="System Theme"
        className={`${styles.themeButton} ${theme === 'system' ? styles.active : ''}`}
        title="Use System Theme"
        onClick={() => setTheme('system')}
      >
        <svg
          fill="none"
          height="20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="14" rx="2" ry="2" width="20" x="2" y="3"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      </button>
    </div>
  );
}
