import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow any HTTPS image source. Narrow this to specific CDN/storage
    // hostnames once the blog's cover image source is finalised.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
