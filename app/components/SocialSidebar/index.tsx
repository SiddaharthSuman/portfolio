'use client';

import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import styles from './SocialSidebar.module.scss';

const SocialSidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Simple fade-in animation
    const timer = setTimeout(() => {
      sidebar.style.opacity = "1";
      sidebar.style.transform = 'translateY(0)';
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.socialSidebar} ref={sidebarRef}>
      <ul className={styles.socialList}>
        <li className={styles.socialItem}>
          <a 
            href="https://github.com/siddaharthsuman" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={styles.socialLink}
          >
            <Github size={22} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <a 
            href="https://linkedin.com/in/siddaharthsuman" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={styles.socialLink}
          >
            <Linkedin size={22} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <a 
            href="https://twitter.com/siddaharthsuman" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter"
            className={styles.socialLink}
          >
            <Twitter size={22} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <a 
            href="mailto:siddaharthsuman@gmail.com" 
            aria-label="Email"
            className={styles.socialLink}
          >
            <Mail size={22} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <div className={styles.verticalLine}></div>
        </li>
      </ul>
    </div>
  );
};

export default SocialSidebar;