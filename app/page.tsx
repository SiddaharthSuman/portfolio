'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import Header from './components/Header2';
import HeroSection from './sections/Hero';
import ScrollNavigator from './components/ScrollNavigator';
import SocialSidebar from './components/SocialSidebar';
import EmailSidebar from './components/EmailSidebar';
import Footer from './components/Footer';

// Create placeholder components
const SectionPlaceholder = () => (
  <div className="section-placeholder" style={{ height: '100vh' }}></div>
);

const AboutSection = dynamic(() => import('./sections/TechGrid'), {
  loading: () => <div className="section-placeholder">Loading...</div>,
});
const ContactSection = dynamic(() => import('./sections/Contact'), {
  loading: () => <div className="section-placeholder">Loading...</div>,
});
const ExperienceSection = dynamic(() => import('./sections/Experience'), {
  loading: () => <div className="section-placeholder">Loading...</div>,
});
const ProjectsSection = dynamic(() => import('./sections/Projects'), {
  loading: () => <div className="section-placeholder">Loading...</div>,
});

// import Footer from './components/Footer';
// import ContactSection from './sections/Contact';
// import ExperienceSection from './sections/Experience';
// import ProjectsSection from './sections/Projects';

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    about: false,
    contact: false,
    experience: false,
    projects: false,
  });

  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'experience', name: 'Experience' },
    { id: 'projects', name: 'Projects' },
    { id: 'contact', name: 'Contact' },
  ];

  //TODO: Implement lazy nav by enabling section and then navigating to it

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px', // Start loading when section is 200px away
      threshold: 0.1,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Get the id from the section's data attribute
        const sectionId = entry.target.getAttribute('data-section');
        if (sectionId && entry.isIntersecting) {
          setVisibleSections((prev) => ({ ...prev, [sectionId]: true }));
          // Unobserve after loading
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe section placeholders
    document.querySelectorAll('[data-section]').forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <Header></Header>

      <HeroSection></HeroSection>

      <div data-section="about" id="about">
        {visibleSections.about ? <AboutSection /> : <SectionPlaceholder />}
      </div>
      <div data-section="experience" id="experience">
        {visibleSections.experience ? <ExperienceSection /> : <SectionPlaceholder />}
      </div>
      <div data-section="projects" id="projects">
        {visibleSections.projects ? <ProjectsSection /> : <SectionPlaceholder />}
      </div>
      <div data-section="contact" id="contact">
        {visibleSections.contact ? <ContactSection /> : <SectionPlaceholder />}
      </div>

      <SocialSidebar></SocialSidebar>
      <EmailSidebar></EmailSidebar>
      <ScrollNavigator sections={sections} />
      <Footer></Footer>
    </div>
  );
}
