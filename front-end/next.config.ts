import type { NextConfig } from 'next';
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors: true,
  },
  eslint:{
    ignoreDuringBuilds: true,
  },
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*'
      }
    ]
  },
  async headers(){
    return []
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        
      },
    ],
  },
}

export default nextConfig