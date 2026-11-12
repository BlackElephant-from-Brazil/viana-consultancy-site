'use client'

import { useSyncExternalStore } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'

type Consent = 'accepted' | 'rejected'

// localStorage as an external store: the server snapshot is `undefined`
// ("not known yet"), so the banner never renders on the server and never
// flashes for a visitor who already chose.
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

// Fallback for browsers that block storage: the choice holds for this page view.
let pageChoice: Consent | null = null

function readConsent(): Consent | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'rejected') return stored
  } catch {
    // storage blocked
  }
  return pageChoice
}

export default function CookieConsent({ gaId, clarityId }: { gaId?: string; clarityId?: string }) {
  const consent = useSyncExternalStore<Consent | null | undefined>(subscribe, readConsent, () => undefined)
  const ready = consent !== undefined

  const choose = (value: Consent) => {
    pageChoice = value
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // storage blocked: pageChoice carries it
    }
    listeners.forEach(notify => notify())
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
