// sections/ExperienceSection/index.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

import styles from './ExperienceSection.module.scss';

const ExperienceSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

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

    const elements = [headingRef.current, contentRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => elements.forEach((el) => el && observer.unobserve(el));
  }, []);

  // Experience data
  const experiences = [
    {
      company: 'Code and Theory',
      position: 'Senior Software Engineer',
      duration: 'Nov 2021 - Nov 2023',
      location: 'Bengaluru, India',
      website: 'https://www.codeandtheory.com/',
      responsibilities: [
        'Led a team of frontend web developers, delivering a high-performance mental health application, improving accessibility by 20% and increasing user engagement by 15%',
        'Developed a reusable component library that reduced development time by 30% and improved consistency across multiple projects',
        'Conducted framework feasibility studies and established architecture for scalable frontend projects, reducing future technical debt',
        'Collaborated with cross-functional teams to integrate frontend solutions with backend services, reducing errors by 25% and improving system scalability',
        'Mentored junior developers, resulting in a 15% improvement in code quality and faster turnaround on code reviews',
      ],
      technologies: ['React', 'TypeScript', 'Next.js', 'CSS Modules', 'Jest', 'Storybook'],
    },
    {
      company: 'FactSet',
      position: 'Software Engineer III',
      duration: 'Dec 2018 - Oct 2021',
      location: 'Hyderabad, India',
      website: 'https://www.factset.com/',
      responsibilities: [
        'Developed and optimized client-facing endpoints using JavaScript and NodeJS, reducing query latency by 40%, enhancing client satisfaction',
        'Created a custom Oracle SQL data import package that cut data integration time by 35%, streamlining internal workflows',
        'Spearheaded the development of a financial data tool, improving system responsiveness and handling complex queries efficiently',
        'Earned recognition for consistently delivering high-quality solutions ahead of deadlines',
      ],
      technologies: ['JavaScript', 'Node.js', 'Oracle SQL', 'RESTful APIs', 'Data Visualization'],
    },
    {
      company: 'Infosys',
      position: 'Senior Systems Engineer',
      duration: 'Dec 2015 - Dec 2018',
      location: 'Hyderabad, India',
      website: 'https://www.infosys.com/',
      responsibilities: [
        'Automated report generation for 80+ production applications, reducing manual effort from 1 hour to 5 minutes and improving operational efficiency by 90%',
        'Developed mobile device management and workspace reservation systems, boosting employee productivity by 25%',
        'Recognized for delivering high-impact solutions that enhanced employee workflows and reduced downtime',
      ],
      technologies: ['Java', 'JavaScript', 'SQL', 'Automation Tools', 'RESTful Services'],
    },
    {
      company: 'Institute of Forensic Science',
      position: 'Assistant Professor',
      duration: 'Aug 2015 - Oct 2015',
      location: 'Mumbai, India',
      website: 'https://iofs.gov.in/',
      responsibilities: [
        'Instructed students in Cyber Forensics and programming by incorporating practical, real-world forensic challenges into coursework',
      ],
      technologies: ['Digital Forensics', 'Programming Fundamentals', 'Cybersecurity'],
    },
    {
      company: 'Palmate Solutions',
      position: 'Backend Developer',
      duration: 'May 2014 - Oct 2014',
      location: 'Mumbai, India',
      website: null,
      responsibilities: [
        'Developed and maintained backend systems for web applications, improving server-side performance by 20% and reducing system downtime',
      ],
      technologies: ['PHP', 'MySQL', 'RESTful APIs', 'Backend Development'],
    },
  ];

  return (
    <section ref={sectionRef} className={styles.experienceSection} id="experience">
      <div className="container">
        <div ref={headingRef} className={styles.sectionHeading}>
          <h2 className={styles.heading}>
            <span className={styles.sectionNumber}>02.</span> Where I&apos;ve Worked
          </h2>
          <div className={styles.headingLine}></div>
        </div>

        <div ref={contentRef} className={styles.experienceContainer}>
          <div className={styles.tabsContainer}>
            <div aria-label="Work experience tabs" className={styles.tabList} role="tablist">
              {experiences.map((experience, index) => (
                <button
                  key={index}
                  aria-controls={`panel-${index}`}
                  aria-selected={activeTab === index}
                  className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
                  id={`tab-${index}`}
                  role="tab"
                  onClick={() => handleTabClick(index)}
                >
                  <span className={styles.tabCompany}>{experience.company}</span>
                </button>
              ))}
            </div>
            <div
              className={styles.tabHighlight}
              style={{ transform: `translateY(${activeTab * 42}px)` }}
            ></div>
          </div>

          <div className={styles.tabContent}>
            {experiences.map((experience, index) => (
              <div
                key={index}
                aria-labelledby={`tab-${index}`}
                className={`${styles.tabPanel} ${activeTab === index ? styles.active : ''}`}
                hidden={activeTab !== index}
                id={`panel-${index}`}
                role="tabpanel"
              >
                <h3 className={styles.positionTitle}>
                  {experience.position}{' '}
                  <span className={styles.companyName}>
                    @ {experience.company}
                    {experience.website && (
                      <a
                        aria-label={`Visit ${experience.company} website`}
                        className={styles.companyLink}
                        href={experience.website}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </span>
                </h3>
                <p className={styles.duration}>
                  {experience.duration} | {experience.location}
                </p>

                <ul className={styles.responsibilitiesList}>
                  {experience.responsibilities.map((responsibility, i) => (
                    <li key={i} className={styles.responsibilityItem}>
                      <span className={styles.bullet}>▹</span>
                      {responsibility}
                    </li>
                  ))}
                </ul>

                <div className={styles.technologiesContainer}>
                  {experience.technologies.map((tech, i) => (
                    <span key={i} className={styles.technologyTag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
