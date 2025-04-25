'use client';

import Header from './components/Header/Header';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

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
      <h1>Hello From Next.js 13.4</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi assumenda facere amet sed
        sit! Eligendi itaque harum nobis? Reprehenderit id perspiciatis et molestias animi
        asperiores numquam ratione nam expedita repellendus?
      </p>
      {/* <button onClick={toggleLightDark}>Light/Dark Mode</button>*/}
      <ThemeToggle />
    </div>
    // </Container>
  );
}
