// sections/ProjectsSection/index.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import { useTheme } from '@/app/context/ThemeContext';

import { ProjectData, projectData } from './ProjectData';
import { ProjectCard } from './ProjectCard';
import { ProjectFilter, FilterCategory } from './ProjectFilter';
import styles from './ProjectsSection.module.scss';

const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>(projectData);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();

  // Filter projects when the active filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projectData);
    } else {
      setFilteredProjects(
        projectData.filter((project) => project.categories.includes(activeFilter))
      );
    }
  }, [activeFilter]);

  // Animation logic for section heading and disclaimer
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

    // Observe disclaimer
    if (disclaimerRef.current) {
      observer.observe(disclaimerRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
      if (disclaimerRef.current) {
        observer.unobserve(disclaimerRef.current);
      }
    };
  }, []);

  // Handle filter change
  const handleFilterChange = (category: FilterCategory) => {
    setActiveFilter(category);
  };

  return (
    <section
      ref={sectionRef}
      className={styles.projectsSection}
      data-theme={resolvedTheme}
      id="projects"
    >
      <div className="container">
        {/* Section Heading */}
        <div ref={headingRef} className={styles.sectionHeading}>
          <h2 className={styles.heading}>Some Things I&apos;ve Built</h2>
          <div className={styles.headingLine}></div>
        </div>

        {/* Project Filters */}
        <ProjectFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Featured Projects */}
        <div className={styles.featuredProjects}>
          {filteredProjects
            .filter((project) => project.featured)
            .map((project, index) => (
              <ProjectCard key={project.id} featured={true} index={index} project={project} />
            ))}
        </div>

        {/* Regular Projects Grid */}
        <div className={styles.projectsGrid}>
          {filteredProjects
            .filter((project) => !project.featured)
            .map((project, index) => (
              <ProjectCard key={project.id} featured={false} index={index} project={project} />
            ))}
        </div>

        {/* Optional: "View More Projects" button or link to GitHub */}
        {filteredProjects.length > 0 && (
          <div className={styles.viewMoreContainer}>
            <a
              className={styles.viewMoreLink}
              href="https://github.com/siddaharthsuman"
              rel="noopener noreferrer"
              target="_blank"
            >
              View More Projects
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        {/* Empty state message when no projects match the filter */}
        {filteredProjects.length === 0 && (
          <div className={styles.emptyState}>
            <p>No projects found in this category.</p>
            <button className={styles.resetButton} onClick={() => setActiveFilter('all')}>
              View All Projects
            </button>
          </div>
        )}
      </div>
      {/* Section-wide Legal Disclaimer - always visible regardless of filters */}
      <div ref={disclaimerRef} className={styles.sectionDisclaimer}>
        <h4>Legal Disclaimer</h4>
        <p>
          The project videos featured in this portfolio showcase work completed while employed at
          respective organizations. All videos remain the intellectual property of their respective
          owners and are displayed for professional demonstration purposes only. Company names,
          logos, and product videos are trademarks or registered trademarks of their respective
          holders. Use of these materials does not imply endorsement.
        </p>
      </div>
    </section>
  );
};

export default ProjectsSection;
