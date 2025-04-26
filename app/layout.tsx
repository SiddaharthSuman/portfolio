import type { Metadata } from 'next';
import { Geist, Geist_Mono, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './styles/globals.scss';

import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/Cursor2';

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
  title: 'Siddaharth Suman | Portfolio',
  description: 'Personal portfolio of Siddaharth Suman, Senior Software Engineer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable}`}>
        <Analytics />
        <SpeedInsights />
        <CustomCursor />
        <ThemeProvider>
          {/* <Header /> */}
          {/* <Container component={'main'} maxWidth="lg"> */}
          <div className="root">{children}</div>
          {/* </Container> */}
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
