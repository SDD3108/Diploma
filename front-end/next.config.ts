import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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