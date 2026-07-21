'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'

type Consent = 'accepted' | 'rejected'

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'rejected') setConsent(stored)
    setReady(true)
  }, [])

  const choose = (value: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
  }

  return (
    <>
      {gaId && consent === 'accepted' && (
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

      {ready && consent === null && (
        <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
          <p className="cookie-banner__text">
            We use cookies to analyze site traffic and improve your experience. See our{' '}
            <Link href="/politica-de-privacidade">Privacy Policy</Link> for details.
          </p>
          <div className="cookie-banner__actions">
            <button type="button" className="btn btn-outline-gold" onClick={() => choose('rejected')}>
              Reject
            </button>
            <button type="button" className="btn btn-gold" onClick={() => choose('accepted')}>
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  )
}
