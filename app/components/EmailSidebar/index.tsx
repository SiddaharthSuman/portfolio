'use client';

import React, { useEffect, useRef } from 'react';
import styles from './EmailSidebar.module.scss';

const EmailSidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Simple fade-in animation
    const timer = setTimeout(() => {
      sidebar.style.opacity = "1";
      sidebar.style.transform = 'translateY(0)';
    }, 1700); // Slightly after social sidebar

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.emailSidebar} ref={sidebarRef}>
      <a 
        href="mailto:siddaharthsuman@gmail.com" 
        className={styles.emailLink}
      >
        siddaharthsuman@gmail.com
      </a>
      <div className={styles.verticalLine}></div>
    </div>
  );
};

export default EmailSidebar;