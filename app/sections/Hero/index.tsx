// components/HeroSection/index.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { handleSmoothScroll } from '@/app/utils/scrollUtils';

import styles from './HeroSection.module.scss';

const HeroSection = () => {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple fade-in animation for elements
    const elements = [nameRef.current, titleRef.current, descriptionRef.current, ctaRef.current];
    elements.forEach((el, index) => {
      if (!el) return;
      setTimeout(
        () => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        },
        300 + index * 200
      );
    });
  }, []);

  return (
    <section className={`${styles.heroSection}`} id="hero">
      {/* <SnapSection className={styles.heroSection} id="hero"> */}
      <div className="container">
        <div className={styles.heroContent}>
          <p ref={nameRef} className={styles.greeting}>
            <span className={styles.wave}>👋</span> Hi, my name is
          </p>
          <h1 ref={titleRef} className={styles.name}>
            Siddaharth Suman
            <span className={styles.title}>I build things for the web.</span>
          </h1>
          <p ref={descriptionRef} className={styles.description}>
            I&apos;m a <span className="accent-text">lead software engineer</span> with over 8 years
            of experience specializing in creating exceptional digital experiences. Currently,
            I&apos;m focused on building accessible, human-centered products at{' '}
            <span className="accent-text">Northeastern University</span> while pursuing my
            Master&apos;s in Informatics.
          </p>
          <div ref={ctaRef} className={styles.cta}>
            <Link className={styles.primaryButton} href="#projects">
              View My Work
              <ArrowRight size={16} />
            </Link>
            <Link className={styles.secondaryButton} href="#contact">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
      <Link href={'#skills'} onClick={(e) => handleSmoothScroll({ e, offset: 0 })}>
        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
          <div className={styles.scrollText}>Scroll Down</div>
        </div>
      </Link>
      {/* </SnapSection> */}
    </section>
  );
};

export default HeroSection;
