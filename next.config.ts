import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
