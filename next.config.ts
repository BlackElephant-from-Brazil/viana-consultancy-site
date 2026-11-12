import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // No images.remotePatterns: next/image only serves local /images/* files
  // (blog markdown images render as plain <img>), so the optimizer refuses
  // every remote URL. Add a specific hostname here if that ever changes.
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
        source: '/portugal-the-ideal-destination-for-investors-and-the-golden-visa-discover-the-advantages-of-establishing-an-offshore-company-in-portugal',
        destination: '/blog/portugal-ideal-destination-investors-golden-visa-offshore-company',
        permanent: true,
      },
      {
        source: '/category/blog',
        destination: '/blog',
        permanent: true,
      },
      // Any other WordPress category or tag archive (Search Console still
      // crawls /category/blog/immigration/, for one). Specific mappings above
      // win because Next uses the first match.
      {
        source: '/category/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/:path*',
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
