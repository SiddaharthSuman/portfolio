'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import ThemeToggle from '../ThemeToggle/ThemeToggle';

import styles from './Header.module.scss';

const navLinks = [
  { name: 'Home', path: '#home' },
  { name: 'About', path: '#about' },
  { name: 'Experience', path: '#experience' },
  { name: 'Skills', path: '#skills' },
  { name: 'Projects', path: '#projects' },
  { name: 'Contact', path: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="#home">
            <span className={styles.logoText}>SS</span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            {navLinks.map((link, index) => (
              <li key={index} className={styles.navItem}>
                <Link
                  className={styles.navLink}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.ctaButton}>
            <a
              className={styles.resumeButton}
              href="/resume.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Resume
            </a>
          </div>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
