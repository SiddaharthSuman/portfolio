import type { Metadata } from 'next';
import { Geist, Geist_Mono, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './styles/index.scss';

import Head from 'next/head';

import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/Cursor2';
import SmoothScroll from './components/SmoothScroll';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Siddaharth Suman | Lead Software Engineer',
    template: '%s | Siddaharth Suman',
  },
  description:
    'Siddaharth Suman is a lead software engineer with over 8 years of experience specializing in creating exceptional digital experiences.',
  keywords: [
    'software engineer',
    'web developer',
    'frontend developer',
    'React developer',
    'portfolio',
  ],
  authors: [{ name: 'Siddaharth Suman' }],
  creator: 'Siddaharth Suman',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://siddaharthsuman.com',
    title: 'Siddaharth Suman | Lead Software Engineer',
    description:
      'Lead Software Engineer with expertise in frontend development and user experience.',
    siteName: 'Siddaharth Suman Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siddaharth Suman | Lead Software Engineer',
    description:
      'Lead Software Engineer with expertise in frontend development and user experience.',
    creator: '@siddaharthsuman',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />

        {/* Preconnect to domains that will be used */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />

        {/* Prefetch critical fonts */}
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/Geist-Bold.woff2"
          rel="preload"
          type="font/woff2"
        />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable}`}>
        <Analytics />
        <SpeedInsights />
        <SmoothScroll>
          <CustomCursor />
          <ThemeProvider>
            <div className="root">{children}</div>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
