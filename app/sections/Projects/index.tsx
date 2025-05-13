// sections/ProjectsSection/index.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';

import styles from './ProjectsSection.module.scss';

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<Array<HTMLDivElement | null>>([]);

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

    // Observe heading
    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    // Observe projects
    projectsRef.current.forEach((project) => {
      if (project) {
        observer.observe(project);
      }
    });

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
      projectsRef.current.forEach((project) => {
        if (project) {
          observer.unobserve(project);
        }
      });
    };
  }, []);

  // Project data
  const projects = [
    {
      title: 'Mental Health Application',
      description:
        'A comprehensive mental health platform designed to provide users with personalized resources, self-assessment tools, and secure communication with mental health professionals. Led frontend development with a focus on accessibility and user engagement.',
      technologies: [
        'React',
        'TypeScript',
        'Redux',
        'Styled Components',
        'Jest',
        'WCAG Compliance',
      ],
      github: null, // Private repository
      external: null, // No public link
      image: '/images/projects/mental-health-app.jpg',
      featured: true,
    },
    {
      title: 'Component Library System',
      description:
        'Developed a comprehensive component library that reduced development time by 30% across multiple projects. The system included extensive documentation, usage examples, and integration with design tools to maintain consistency between design and implementation.',
      technologies: ['React', 'Storybook', 'SCSS Modules', 'TypeScript', 'Jest', 'Figma API'],
      github: null, // Private repository
      external: null, // No public link
      image: '/images/projects/component-library.jpg',
      featured: true,
    },
    {
      title: 'Financial Data Visualization Tool',
      description:
        'A powerful tool that enables financial analysts to visualize complex data sets, perform trend analysis, and generate custom reports. Optimized for performance to handle large datasets while maintaining responsive UI.',
      technologies: ['JavaScript', 'D3.js', 'Node.js', 'Express', 'SQL', 'RESTful APIs'],
      github: null, // Private repository
      external: null, // No public link
      image: '/images/projects/financial-viz.jpg',
      featured: true,
    },
    {
      title: 'Automated Reporting System',
      description:
        'Designed and implemented an automated reporting system that reduced manual effort from 1 hour to 5 minutes per report. The system handled data collection, processing, and visualization for 80+ production applications.',
      technologies: ['Java', 'Spring Boot', 'Selenium', 'SQL', 'React', 'Chart.js'],
      github: 'https://github.com/username/reporting-system',
      external: null,
      image: '/images/projects/reporting-system.jpg',
      featured: false,
    },
    {
      title: 'Workspace Reservation System',
      description:
        'Created a mobile-friendly application for managing office space reservations, helping employees book desks, meeting rooms, and other resources. The system improved space utilization and enhanced the hybrid work experience.',
      technologies: ['Angular', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.io'],
      github: 'https://github.com/username/workspace-system',
      external: null,
      image: '/images/projects/workspace-system.jpg',
      featured: false,
    },
    {
      title: 'Personal Portfolio Website',
      description:
        'A modern, responsive portfolio website built with Next.js and React. Features include dark/light mode, custom animations, and a mobile-first design approach. The site showcases my projects, skills, and professional experience.',
      technologies: ['Next.js', 'React', 'SCSS Modules', 'Framer Motion', 'Vercel'],
      github: 'https://github.com/siddaharthsuman/portfolio',
      external: 'https://siddaharthsuman.com',
      image: '/images/projects/portfolio.jpg',
      featured: false,
    },
  ];

  // Split projects into featured and other projects
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  // Set up project refs
  projectsRef.current = new Array(projects.length).fill(null);

  return (
    <section ref={sectionRef} className={styles.projectsSection} id="projects">
      <div className="container">
        <div ref={headingRef} className={styles.sectionHeading}>
          <h2 className={styles.heading}>
            <span className={styles.sectionNumber}>03.</span> Some Things I&apos;ve Built
          </h2>
          <div className={styles.headingLine}></div>
        </div>

        {/* Featured Projects */}
        <div className={styles.featuredProjects}>
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              ref={(el) => {
                projectsRef.current[index] = el;
              }}
              className={styles.featuredProject}
            >
              <div className={styles.projectContent}>
                <p className={styles.projectOverline}>Featured Project</p>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <div className={styles.projectDescription}>
                  <p>{project.description}</p>
                </div>
                <ul className={styles.projectTechList}>
                  {project.technologies.map((tech, i) => (
                    <li key={i} className={styles.projectTechItem}>
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className={styles.projectLinks}>
                  {project.github && (
                    <a
                      aria-label={`GitHub repository for ${project.title}`}
                      className={styles.projectLink}
                      href={project.github}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.external && (
                    <a
                      aria-label={`Live site for ${project.title}`}
                      className={styles.projectLink}
                      href={project.external}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.projectImageContainer}>
                <div className={styles.projectImageWrapper}>
                  <Image
                    alt={project.title}
                    className={styles.projectImage}
                    height={400}
                    src="/api/placeholder/600/400"
                    width={600}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects Grid */}
        <h3 className={styles.otherProjectsHeading}>Other Noteworthy Projects</h3>
        <div className={styles.projectsGrid}>
          {otherProjects.map((project, index) => (
            <div
              key={index + featuredProjects.length}
              ref={(el) => {
                projectsRef.current[index + featuredProjects.length] = el;
              }}
              className={styles.projectCard}
            >
              <div className={styles.projectCardTop}>
                <div className={styles.projectCardFolder}>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className={styles.projectCardLinks}>
                  {project.github && (
                    <a
                      aria-label={`GitHub for ${project.title}`}
                      className={styles.projectCardLink}
                      href={project.github}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.external && (
                    <a
                      aria-label={`Live site for ${project.title}`}
                      className={styles.projectCardLink}
                      href={project.external}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              <h3 className={styles.projectCardTitle}>{project.title}</h3>
              <p className={styles.projectCardDescription}>{project.description}</p>
              <div className={styles.projectCardFooter}>
                <ul className={styles.projectCardTechList}>
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <li key={i} className={styles.projectCardTechItem}>
                      {tech}
                    </li>
                  ))}
                  {project.technologies.length > 4 && (
                    <li className={styles.projectCardTechItem}>
                      +{project.technologies.length - 4}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
