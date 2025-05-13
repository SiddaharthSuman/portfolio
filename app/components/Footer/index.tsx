// components/Footer/index.jsx
import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

import styles from './Footer.module.scss';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.socialLinks}>
            <a
              aria-label="GitHub"
              className={styles.socialLink}
              href="https://github.com/siddaharthsuman"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github size={20} />
            </a>
            <a
              aria-label="LinkedIn"
              className={styles.socialLink}
              href="https://linkedin.com/in/siddaharthsuman"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Linkedin size={20} />
            </a>
            <a
              aria-label="Twitter"
              className={styles.socialLink}
              href="https://twitter.com/siddaharthsuman"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Twitter size={20} />
            </a>
            <a
              aria-label="Email"
              className={styles.socialLink}
              href="mailto:siddaharthsuman@gmail.com"
            >
              <Mail size={20} />
            </a>
          </div>

          <div className={styles.credits}>
            <p className={styles.designed}>Designed & Built by Siddaharth Suman</p>
            <p className={styles.copyright}>© {year} All rights reserved.</p>
          </div>

          <div className={styles.backToTop}>
            <a aria-label="Back to top" className={styles.topButton} href="#top">
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
