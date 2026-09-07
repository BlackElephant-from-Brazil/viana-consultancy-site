'use client'

import { useId, useRef, useState } from 'react'

type FormState = {
  name: string
  mobile: string
  email: string
  message: string
  company: string // honeypot — stays empty for real users
}

const empty: FormState = { name: '', mobile: '', email: '', message: '', company: '' }

/**
 * The enquiry form, shared by the home hero and the contact page so both post
 * the same fields to the same endpoint.
 *
 * Field ids are generated with useId() so two instances on one page never
 * collide and every label keeps pointing at its own input.
 */
export default function ContactForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  // Time the form first rendered, used server-side to reject instant (bot) submits.
  const startedAt = useRef(Date.now())
  const uid = useId()
  const fieldId = (name: string) => `${uid}-${name}`

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
        body: JSON.stringify({ ...form, startedAt: startedAt.current }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm(empty)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>

      {/* Honeypot: hidden from humans, catches bots that fill every field. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={fieldId('company')}>Company</label>
        <input
          id={fieldId('company')}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={update('company')}
        />
      </div>

      <div className="form-group" data-field="name">
        <label htmlFor={fieldId('name')} className="form-label">Your name</label>
        <input
          id={fieldId('name')}
          type="text"
          className="form-input"
          placeholder="Patrícia Viana"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          required
        />
      </div>

      <div className="form-group" data-field="mobile">
        <label htmlFor={fieldId('mobile')} className="form-label">Mobile number</label>
        <input
          id={fieldId('mobile')}
          type="tel"
          className="form-input"
          placeholder="Enter your mobile number with country code here"
          autoComplete="tel"
          value={form.mobile}
          onChange={update('mobile')}
        />
      </div>

      <div className="form-group" data-field="email">
        <label htmlFor={fieldId('email')} className="form-label">Your email</label>
        <input
          id={fieldId('email')}
          type="email"
          className="form-input"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          required
        />
      </div>

      <div className="form-group" data-field="message">
        <label htmlFor={fieldId('message')} className="form-label">Your message</label>
        <textarea
          id={fieldId('message')}
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
  )
}
