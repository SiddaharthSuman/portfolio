// sections/ProjectsSection/ProjectCard.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

import VimeoVideo from '../../components/VimeoVideo';

import { ProjectData } from './ProjectData';
import styles from './ProjectsSection.module.scss';

interface ProjectCardProps {
  featured: boolean;
  index: number;
  project: ProjectData;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ featured, index, project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const disclaimerTextRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Animation logic for card reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay based on index for staggered animation
            setTimeout(() => {
              entry.target.classList.add(styles.animate);
            }, index * 100); // 100ms staggered delay
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  const restartDisclaimerAnimation = useCallback(() => {
    if (isHovering && disclaimerTextRef.current) {
      disclaimerTextRef.current.classList.remove(styles.active);

      void disclaimerTextRef.current.offsetWidth;

      disclaimerTextRef.current.classList.add(styles.active);
    }
  }, [isHovering]);

  useEffect(() => {
    restartDisclaimerAnimation();
  }, [isHovering, restartDisclaimerAnimation]);

  // Calculate which technologies to show and how many are hidden
  const visibleTechs = project.technologies.slice(0, 5);
  const hiddenTechsCount = Math.max(0, project.technologies.length - 5);

  return (
    <div
      ref={cardRef}
      className={`${styles.projectCard} ${featured ? styles.featuredCard : ''}`}
      style={{
        // Use client's branding color if available for subtle accents
        borderBottom: project.accentColor ? `4px solid ${project.accentColor}` : undefined,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Media Background - Takes up entire card */}
      <div className={styles.projectCardMedia}>
        {project.vimeoId ? (
          // Use dedicated VimeoVideo component
          <VimeoVideo
            company={project.company}
            isHovering={isHovering}
            title={project.title}
            videoId={project.vimeoId}
          />
        ) : project.videoSrc ? (
          // Local video implementation
          <video
            loop
            muted
            playsInline
            className={styles.cardVideo}
            poster={project.image || '/api/placeholder/600/300'}
            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
            onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
          >
            <source src={project.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Standard image for projects without video
          <Image
            alt={project.title}
            className={styles.cardImage}
            height={300}
            objectFit="cover"
            src={project.image || '/api/placeholder/600/300'}
            width={600}
          />
        )}
      </div>

      {/* Content Overlay - Semi-transparent overlay with project details */}
      <div className={`${styles.projectCardOverlay}`}>
        <div className={styles.projectCardContent}>
          <div className={styles.projectCardHeader}>
            {featured && <span className={styles.featuredBadge}>Featured</span>}
            <h3 className={styles.projectCardTitle}>{project.title}</h3>
            <p className={styles.projectCardCompany}>{project.company}</p>
          </div>

          <div className={`${styles.projectCardDescription} ${isHovering ? styles.active : ''}`}>
            <p>{project.description}</p>
          </div>

          <div className={styles.projectCardFooter}>
            {/* Technologies used */}
            <ul className={`${styles.projectCardTechList} ${isHovering ? styles.active : ''}`}>
              {visibleTechs.map((tech, i) => (
                <li key={i} className={styles.projectCardTechItem}>
                  {tech}
                </li>
              ))}
              {hiddenTechsCount > 0 && (
                <li className={styles.projectCardTechItem}>+{hiddenTechsCount}</li>
              )}
            </ul>

            {/* External links */}
            <div className={styles.projectCardLinks}>
              {project.github && (
                <a
                  aria-label={`GitHub for ${project.title}`}
                  className={styles.projectCardLink}
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
                  className={styles.projectCardLink}
                  href={project.external}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Video disclaimer overlay */}
        {(project.vimeoId || project.videoSrc) && (
          <div className={`${styles.videoDisclaimerContainer} ${isHovering ? styles.active : ''}`}>
            <div ref={disclaimerTextRef} className={`${styles.videoDisclaimer}`}>
              Video courtesy of {project.disclaimerCompanies}. All rights reserved.
            </div>
            <button
              className={styles.videoDisclaimerIBtn}
              onMouseEnter={restartDisclaimerAnimation}
            >
              <span>i</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
