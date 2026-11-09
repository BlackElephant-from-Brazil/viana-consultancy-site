'use client'

import { useEffect, useRef } from 'react'
import { CALENDLY_URL as EVENT_URL } from '@/lib/booking'

const WIDGET_SRC = 'https://assets.calendly.com/assets/external/widget.js'

type CalendlyGlobal = { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void }

/**
 * Inline Calendly booking for the 60 minute Legal Consultation, the same event
 * the blog CTAs open (src/lib/booking.ts). Built like the #book-now section on
 * visa.vianaconsultancy.com.
 *
 * The copy names no price: Calendly shows it on the event itself, so the page
 * cannot drift from what the client is actually charged.
 *
 * widget.js fills every .calendly-inline-widget present when it first runs. A
 * client-side visit back to the home page finds the script already loaded and
 * nothing to fill the new element, so the effect fills it by hand whenever the
 * iframe is missing.
 *
 * No booking event is pushed from here: on the visa site the conversion is a
 * GTM tag listening to Calendly's postMessage, and this site has no GTM.
 */
export default function BookSession() {
  const headRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const head = headRef.current
    if (!head) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    obs.observe(head)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fill = () => {
      const el = widgetRef.current
      const calendly = (window as unknown as { Calendly?: CalendlyGlobal }).Calendly
      if (!el || !calendly || el.querySelector('iframe')) return
      calendly.initInlineWidget({ url: EVENT_URL, parentElement: el })
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`)
    if (existing) {
      fill()
      existing.addEventListener('load', fill)
      return () => existing.removeEventListener('load', fill)
    }
    const script = document.createElement('script')
    script.src = WIDGET_SRC
    script.async = true
    script.addEventListener('load', fill)
    document.body.appendChild(script)
    return () => script.removeEventListener('load', fill)
  }, [])

  return (
    <section id="book-now" className="book-section section" aria-label="Book your immigration consultation">
      <div className="container">
        <div ref={headRef} className="book__head fade-in">
          <div className="section-tag">Your Next Step in Portugal</div>
          <h2 className="section-title">Book Your <span className="gold">Immigration Consultation</span></h2>
          <p className="book__sub">Discuss your plans or immigration concerns with a licensed lawyer in a <strong className="hl">one-hour consultation</strong>. Receive a <strong className="hl">written assessment</strong> of your situation, your legal options and recommended next steps.</p>
          <div className="divider-center" />
          <p className="book__hint">Choose a date and time that works for you.</p>
        </div>
        <div
          ref={widgetRef}
          className="calendly-inline-widget"
          data-url={EVENT_URL}
          style={{ minWidth: 320, height: 700 }}
        />
      </div>
    </section>
  )
}
