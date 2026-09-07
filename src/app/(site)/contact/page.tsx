import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Patrícia Viana Law Firm',
  description: 'Get in touch with Patrícia Viana Law Firm to book a consultation on Portuguese immigration, residency permits, and visas.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Patrícia Viana Law Firm',
    description: 'Get in touch with Patrícia Viana Law Firm to book a consultation on Portuguese immigration, residency permits, and visas.',
    url: '/contact',
  },
}

/**
 * Only the form itself needs to run in the browser, so the page stays a server
 * component and ships just that one client island.
 */
export default function ContactPage() {
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
            <ContactForm />

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
