// app/test-scroll/page.jsx
'use client';

import React from 'react';

import { handleSmoothScroll } from '@/app/utils/scrollUtils';

import '@/app/styles/index.scss';

// Simple test page for scroll snapping
export default function TestScrollPage() {
  return (
    <div>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          backgroundColor: '#0a192f',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        }}
      >
        <nav>
          <a
            href="#section1"
            style={{ color: 'white', marginRight: '20px' }}
            onClick={(e) => handleSmoothScroll({ e, offset: 80 })}
          >
            Section 1
          </a>
          <a
            href="#section2"
            style={{ color: 'white', marginRight: '20px' }}
            onClick={(e) => handleSmoothScroll({ e, offset: 80 })}
          >
            Section 2
          </a>
          <a
            href="#section3"
            style={{ color: 'white', marginRight: '20px' }}
            onClick={(e) => handleSmoothScroll({ e, offset: 80 })}
          >
            Section 3
          </a>
          <a
            href="#section4"
            style={{ color: 'white', marginRight: '20px' }}
            onClick={(e) => handleSmoothScroll({ e, offset: 80 })}
          >
            Section 4
          </a>
        </nav>
      </header>

      <main>
        <section
          className="scrollSnap"
          id="section1"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a192f',
            color: 'white',
            fontSize: '2rem',
            paddingTop: '80px',
            marginTop: '-80px',
            scrollSnapType: 'y mandatory',
          }}
        >
          <h1>Section 1</h1>
        </section>

        <section
          className="scrollSnap"
          id="section2"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#112240',
            color: 'white',
            fontSize: '2rem',
            paddingTop: '80px',
            marginTop: '-80px',
            scrollSnapType: 'y mandatory',
          }}
        >
          <h1>Section 2</h1>
        </section>

        <section
          className="scrollSnap"
          id="section3"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1d3557',
            color: 'white',
            fontSize: '2rem',
            paddingTop: '80px',
            marginTop: '-80px',
            scrollSnapType: 'y mandatory',
          }}
        >
          <h1>Section 3</h1>
        </section>

        <section
          className="scrollSnap"
          id="section4"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2a4f76',
            color: 'white',
            fontSize: '2rem',
            paddingTop: '80px',
            marginTop: '-80px',
            scrollSnapType: 'y mandatory',
          }}
        >
          <h1>Section 4</h1>
        </section>
      </main>
    </div>
  );
}
