import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { organizationJsonLd } from '@/lib/structuredData'

const title = 'Patrícia Viana — Lawyer'
const description = 'Patrícia Viana Law Firm — Expert Portuguese immigration attorneys helping you build a new life in Portugal.'
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
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
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
