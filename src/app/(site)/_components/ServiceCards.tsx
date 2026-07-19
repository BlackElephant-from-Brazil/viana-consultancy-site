'use client'

import { useState } from 'react'

export type ServiceCardData = {
  icon: React.ReactNode
  title: string
  desc: string
  details: readonly React.ReactNode[]
}

export default function ServiceCards({ services }: { services: readonly ServiceCardData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="services__grid" role="list">
      {services.map(({ icon, title, desc, details }, index) => {
        const open = openIndex === index
        return (
          <div key={title} className="service-card" role="listitem">
            <svg className="service-card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
            <h3 className="service-card__title">{title}</h3>
            <p className="service-card__desc">{desc}</p>

            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="service-card__toggle"
            >
              {open ? 'Show less' : 'Learn more'}
              <span className={`service-card__chevron${open ? ' service-card__chevron--open' : ''}`} aria-hidden="true">⌄</span>
            </button>

            <div className={`service-card__details${open ? ' service-card__details--open' : ''}`}>
              <ul>
                {details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}
