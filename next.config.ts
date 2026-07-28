import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow any HTTPS image source. Narrow this to specific CDN/storage
    // hostnames once the blog's cover image source is finalised.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    // Legacy WordPress URLs still indexed by Google, mapped to their
    // real equivalent on the new site to preserve any existing ranking.
    return [
      {
        source: '/portuguese-nationality-for-goans-a-historic-opportunity-within-reach',
        destination: '/blog/portuguese-nationality-for-goans-historic-opportunity',
        permanent: true,
      },
      {
        source: '/elementor-2700',
        destination: '/blog/ifici-portugal-strategic-tax-incentive-d7-d8-visa-holders',
        permanent: true,
      },
      {
        source: '/tag/golden-visa',
        destination: '/blog/portugal-ideal-destination-investors-golden-visa-offshore-company',
        permanent: true,
      },
      {
        source: '/category/blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
