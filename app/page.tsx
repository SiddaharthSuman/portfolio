'use client';

import EmailSidebar from './components/EmailSidebar';
import Footer from './components/Footer';
import Header from './components/Header2';
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

  return (
    // <Container >
    <div>
      <Header></Header>
      {/* <h1>Hello From Next.js 13.4</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi assumenda facere amet sed
        sit! Eligendi itaque harum nobis? Reprehenderit id perspiciatis et molestias animi
        asperiores numquam ratione nam expedita repellendus?
      </p> */}
      {/* <button onClick={toggleLightDark}>Light/Dark Mode</button>*/}
      <HeroSection></HeroSection>
      <AboutSection></AboutSection>
      <ExperienceSection></ExperienceSection>
      <ProjectsSection></ProjectsSection>
      <ContactSection></ContactSection>
      <SocialSidebar></SocialSidebar>
      <EmailSidebar></EmailSidebar>
      {/* <ThemeToggle /> */}
      <Footer></Footer>
    </div>
    // </Container>
  );
}
