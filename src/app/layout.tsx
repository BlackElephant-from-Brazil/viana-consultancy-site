import type { Metadata } from 'next'
import './globals.css'
import { organizationJsonLd } from '@/lib/structuredData'

const title = 'Patrícia Viana — Lawyer'
const description = 'Patrícia Viana Law Firm — Expert Portuguese immigration attorneys helping you build a new life in Portugal.'
const siteVerification = process.env.GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL('https://vianaconsultancy.com'),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Patrícia Viana Law Firm',
    images: ['/images/hero-banner.webp'],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/hero-banner.webp'],
  },
  ...(siteVerification ? { verification: { google: siteVerification } } : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
