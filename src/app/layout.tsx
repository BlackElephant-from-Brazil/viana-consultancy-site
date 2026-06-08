import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Patrícia Viana — Lawyer',
  description: 'Patrícia Viana Law Firm — Expert Portuguese immigration attorneys helping you build a new life in Portugal.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
