'use client'

import { useRef, useState } from 'react'

const CARD_W = 340 + 24

const testimonials = [
  { initial: 'H', name: 'Hendranus Vermeulen', source: 'Google Review', text: "I highly recommend Patricia, an exceptional immigration lawyer who impressed me with her professionalism, warmth, and extensive expertise. She went above and beyond to assist me, helping me obtain my NIF number and open a bank account. Patricia's deep knowledge of Portuguese immigration laws was invaluable, guiding me through the process with clarity and ease." },
  { initial: 'G', name: 'Gala Oussama', source: 'Google Review', text: 'Excellent lawyer. She helped me obtain the residence card within 25 days. I will never forget your kindness. Thank you very much.' },
  { initial: 'N', name: 'Nazim Uddin', source: 'Google Review', text: 'From the beginning, very helpful, a unique professional, I recommend his work. We need more professionals like this, of excellence! Very satisfied.' },
  { initial: 'R', name: 'Rabah Touamen', source: 'Google Review', text: 'Muito obrigado, consegui minha residência de volta, graças a você.' },
  { initial: 'R', name: 'Rehan Khan', source: 'Google Review', text: 'Excellent service.. really I recommend for others.. Thank you very much.' },
  { initial: 'D', name: 'Dja Mel', source: 'Google Review', text: 'I had the honor to work with you as my lawyer, all the best for you.' },
]

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 15, height: 15, fill: 'var(--gold)' }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export default function TestimonialsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const scrollL = useRef(0)

  const goTo = (i: number) => {
    sliderRef.current?.scrollTo({ left: i * CARD_W, behavior: 'smooth' })
    setActive(i)
  }

  const onScroll = () => {
    if (!sliderRef.current) return
    setActive(Math.round(sliderRef.current.scrollLeft / CARD_W))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    startX.current = e.pageX - (sliderRef.current?.offsetLeft ?? 0)
    scrollL.current = sliderRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !sliderRef.current) return
    e.preventDefault()
    sliderRef.current.scrollLeft = scrollL.current - (e.pageX - (sliderRef.current.offsetLeft) - startX.current)
  }

  return (
    <div className="testimonials__wrap">
      <div
        ref={sliderRef}
        className={`testimonials__slider${dragging ? ' dragging' : ''}`}
        role="list"
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onMouseLeave={() => setDragging(false)}
        onMouseUp={() => setDragging(false)}
        onMouseMove={onMouseMove}
      >
        {testimonials.map((t, i) => (
          <div key={i} className="tcard" role="listitem">
            <div className="tcard__stars" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, j) => <Star key={j} />)}
            </div>
            <p className="tcard__text">{t.text}</p>
            <div className="tcard__author">
              <div className="tcard__avatar" aria-hidden="true">{t.initial}</div>
              <div>
                <div className="tcard__name">{t.name}</div>
                <div className="tcard__source">{t.source}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonials__nav" aria-label="Testimonials navigation" role="group">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`testimonials__dot${active === i ? ' active' : ''}`}
            aria-label={`Review ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
