// sections/AboutSection/index.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import styles from './AboutSection.module.scss';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const skillsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = [headingRef.current, contentRef.current, skillsRef.current, imageRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => elements.forEach((el) => el && observer.unobserve(el));
  }, []);

  // List of technologies grouped by category
  const skills = {
    languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'PHP', 'SQL', 'Java'],
    frameworks: ['React', 'Angular', 'Next.js', 'Node.js'],
    tools: ['Docker', 'Contentful', 'Bootstrap', 'Selenium', 'Git', 'Jenkins', 'SVN'],
    cloud: ['Azure', 'AWS', 'Google Cloud Platform'],
  };

  return (
    <section ref={sectionRef} className={styles.aboutSection} id="about">
      <div className="container">
        <div ref={headingRef} className={styles.sectionHeading}>
          <h2 className={styles.heading}>
            <span className={styles.sectionNumber}>01.</span> About Me
          </h2>
          <div className={styles.headingLine}></div>
        </div>

        <div className={styles.aboutContent}>
          <div ref={contentRef} className={styles.textContent}>
            <p>
              Hello! I&apos;m Siddaharth, a Senior Software Engineer with over 8 years of experience
              building digital products with a focus on user-centered design. My journey in software
              development started back in 2014, and since then, I&apos;ve had the privilege of
              working with a diverse range of companies from startups to established institutions.
            </p>
            <p>
              Most recently, I led a team of frontend developers at{' '}
              <span className="accent-text">Code and Theory</span>, where I delivered
              high-performance applications that improved accessibility by 20% and increased user
              engagement by 15%. I&apos;m passionate about creating reusable component libraries
              that enhance development efficiency and maintain design consistency.
            </p>
            <p>
              Currently, I&apos;m pursuing my Master&apos;s in Informatics at{' '}
              <span className="accent-text">Northeastern University</span>, where I&apos;m expanding
              my knowledge in data visualization, user experience design, and emerging web
              technologies.
            </p>
            <p>Here are a few technologies I&apos;ve been working with recently:</p>
          </div>

          <div ref={imageRef} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                priority
                alt="Siddaharth Suman"
                className={styles.profileImage}
                height={300}
                src="/images/profile.jpg"
                width={300}
              />
              <div className={styles.imageBorder}></div>
            </div>
          </div>
        </div>

        <div ref={skillsRef} className={styles.skillsContainer}>
          {Object.entries(skills).map(([category, techList]) => (
            <div key={category} className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className={styles.skillsList}>
                {techList.map((tech) => (
                  <li key={tech} className={styles.skillItem}>
                    <span className={styles.skillBullet}>▹</span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
