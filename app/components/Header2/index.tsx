'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';

import { useTheme } from '@/app/context/ThemeContext';
import { handleSmoothScroll } from '@/app/utils/scrollUtils';

import ThemeToggle from '../ThemeToggle/ThemeToggle';

import styles from './Header.module.scss';

const Header = () => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize (if screen becomes larger)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Handle smooth scrolling for nav links
  const handleNavClick = (e: MouseEvent) => {
    handleSmoothScroll({ e, offset: 0 });
    closeMenu();
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.headerContainer}`}>
        <Link className={styles.logo} href="#hero" onClick={handleNavClick}>
          <span className={styles.logoText}>SS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.name} className={styles.navItem}>
                <Link className={styles.navLink} href={item.href} onClick={handleNavClick}>
                  {item.name}
                </Link>
              </li>
            ))}
            <li className={styles.navItem}>
              <a
                className={styles.resumeButton}
                href="/resume.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Resume
              </a>
            </li>
            <li className={styles.navItem}>
              {/* <button 
                // onClick={} 
                className={styles.themeToggle}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}
              <ThemeToggle />
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className={styles.mobileNavControls}>
          <button
            // onClick={}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={styles.themeToggle}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className={styles.menuToggle}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.name} className={styles.mobileNavItem}>
                <Link className={styles.mobileNavLink} href={item.href} onClick={handleNavClick}>
                  {item.name}
                </Link>
              </li>
            ))}
            <li className={styles.mobileNavItem}>
              <a
                className={styles.mobileResumeButton}
                href="/resume.pdf"
                rel="noopener noreferrer"
                target="_blank"
                onClick={closeMenu}
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
