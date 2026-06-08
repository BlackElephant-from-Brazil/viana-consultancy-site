'use client'

import { useState } from 'react'

type FormState = {
  name: string
  mobile: string
  email: string
  subject: string
  message: string
}

const empty: FormState = { name: '', mobile: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm(empty)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero" aria-label="Contact page header">
        <div className="page-hero__content">
          <div className="section-tag">Get in Touch</div>
          <h1 className="page-hero__title">Book Your Consultation</h1>
          <p className="page-hero__sub">Fill in the form below and our team will get back to you as soon as possible.</p>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="contact-form-section section section--white" aria-label="Contact form">
        <div className="container">
          <div className="contact-form-wrap">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>

              <div className="form-group">
                <label htmlFor="cf-name" className="form-label">Your name</label>
                <input
                  id="cf-name"
                  type="text"
                  className="form-input"
                  placeholder="Patrícia Viana"
                  value={form.name}
                  onChange={update('name')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cf-mobile" className="form-label">Mobile number</label>
                <input
                  id="cf-mobile"
                  type="tel"
                  className="form-input"
                  placeholder="Enter your mobile number with country code here"
                  value={form.mobile}
                  onChange={update('mobile')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cf-email" className="form-label">Your email</label>
                <input
                  id="cf-email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cf-subject" className="form-label">Subject</label>
                <input
                  id="cf-subject"
                  type="text"
                  className="form-input"
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={update('subject')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cf-message" className="form-label">Your message</label>
                <textarea
                  id="cf-message"
                  className="form-textarea"
                  placeholder="Tell us about your situation..."
                  rows={6}
                  value={form.message}
                  onChange={update('message')}
                  required
                />
              </div>

              {status === 'success' && (
                <div className="form-feedback form-feedback--success" role="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  Your message has been sent! We&apos;ll be in touch soon.
                </div>
              )}

              {status === 'error' && (
                <div className="form-feedback form-feedback--error" role="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Something went wrong. Please try again or email us directly at{' '}
                  <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a>.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-gold form-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <span className="form-spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* SIDEBAR INFO */}
            <aside className="contact-info" aria-label="Contact information">
              <h2 className="contact-info__title">Contact Information</h2>
              <p className="contact-info__sub">We&apos;re here to help you start your new chapter in Portugal.</p>

              <div className="contact-info__list" role="list">
                <div className="contact-info__item" role="listitem">
                  <span className="contact-info__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.8 12.8a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.71 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.15 6.15l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <div>
                    <a href="tel:+351960174940">+351 960 174 940</a>
                    <span className="contact-info__note">Call to national mobile network</span>
                  </div>
                </div>

                <div className="contact-info__item" role="listitem">
                  <span className="contact-info__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <div>
                    <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a>
                  </div>
                </div>

                <div className="contact-info__item" role="listitem">
                  <span className="contact-info__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <div>
                    <a href="https://www.google.com/maps/dir//Av.+Elias+Garcia+123A,+1050-031+Lisboa" target="_blank" rel="noopener">
                      Av. Elias Garcia, 123-A,<br />1050-098, Lisboa.
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-info__map">
                <iframe
                  src="https://maps.google.com/maps?q=Av.%20Elias%20Garcia%2C%20123-A%2C%201050-098%2C%20Lisboa&t=m&z=16&output=embed&iwloc=near"
                  title="Office location"
                  loading="lazy"
                  aria-label="Office location map"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
