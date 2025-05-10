import type { NextConfig } from 'next';
// import { i18n } from './next-i18next.config';

const nextConfig: NextConfig = {
  // i18n,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*'
      }
    ]
  },
  async headers() {
    return []
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        
      },
    ],
  },
}

export default nextConfig