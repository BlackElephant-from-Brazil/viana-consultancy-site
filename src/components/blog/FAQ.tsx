'use client'

import { useState } from 'react'

export function FAQ({ children }: { children: React.ReactNode }) {
  return <div className="post-faq">{children}</div>
}

export function FAQItem({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="post-faq__item">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="post-faq__question"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={`post-faq__chevron${open ? ' post-faq__chevron--open' : ''}`} aria-hidden="true">⌄</span>
      </button>
      {open && <div className="post-faq__answer">{children}</div>}
    </div>
  )
}
