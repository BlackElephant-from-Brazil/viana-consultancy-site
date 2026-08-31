'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'

type Consent = 'accepted' | 'rejected'

export default function CookieConsent({ gaId, clarityId }: { gaId?: string; clarityId?: string }) {
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

      {clarityId && consent === 'accepted' && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', '${clarityId}');`}
        </Script>
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
