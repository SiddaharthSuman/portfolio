'use client';

import EmailSidebar from './components/EmailSidebar';
import Footer from './components/Footer';
import Header from './components/Header2';
import ScrollNavigator from './components/ScrollNavigator';
// import SnapContainer from './components/SnapContainer';
import SocialSidebar from './components/SocialSidebar';
// import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import AboutSection from './sections/About';
import ContactSection from './sections/Contact';
import ExperienceSection from './sections/Experience';
import HeroSection from './sections/Hero';
import ProjectsSection from './sections/Projects';

export default function Home() {
  // function toggleLightDark() {
  //   const html = document.querySelector('html');
  //   if (html) {
  //     html.classList.toggle('dark');
  //   }
  // }

  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'experience', name: 'Experience' },
    { id: 'projects', name: 'Projects' },
    { id: 'contact', name: 'Contact' },
  ];

  return (
    // <Container >
    <div>
      <Header></Header>

      {/* <SnapContainer> */}
      <HeroSection></HeroSection>
      <AboutSection></AboutSection>
      <ExperienceSection />
      <ProjectsSection></ProjectsSection>
      <ContactSection></ContactSection>

      <SocialSidebar></SocialSidebar>
      <EmailSidebar></EmailSidebar>
      <ScrollNavigator sections={sections}></ScrollNavigator>
      {/* <ThemeToggle /> */}
      <Footer></Footer>

      {/* </SnapContainer> */}
    </div>
    // </Container>
  );
}
