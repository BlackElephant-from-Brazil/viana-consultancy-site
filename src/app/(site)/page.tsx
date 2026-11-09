import { Fragment } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import TestimonialsSlider from './_components/TestimonialsSlider'
import ServiceCards from './_components/ServiceCards'
import BookSession from './_components/BookSession'
import { getPublishedPosts } from '@/lib/posts'
import type { Post } from '@/lib/posts'
import BlogCard from '@/components/blog/BlogCard'

export const revalidate = 3600

const title = 'Immigration Lawyers in Portugal | Patrícia Viana'
const description = 'Legal guidance on Portuguese visas, residency and immigration disputes. Meet our Lisbon-based team and request a consultation about your situation.'

// Home only. The canonical, verification and the rest of the root metadata are
// inherited; openGraph and twitter are restated whole because Next replaces
// those objects rather than merging them.
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Patrícia Viana Law Firm',
    images: ['/images/hero-banner.webp'],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/hero-banner.webp'],
  },
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)

const needs = [
  {
    icon: <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
    title: 'Planning Your Move',
    text: 'Understand your visa and residency options before deciding how to proceed.',
    links: [{ href: '#areasdeatuacao', label: 'Explore Our Services' }],
  },
  {
    icon: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    title: 'Retirement and Passive Income',
    text: 'Discuss your plans to retire or live in Portugal and whether the D7 route may fit your circumstances.',
    links: [{ href: '#book-now', label: 'Request a Consultation' }],
  },
  {
    icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    title: 'Remote Work',
    text: 'Explore legal support for Portugal’s digital nomad visa and your plans to work remotely from Portugal.',
    links: [{ href: '#book-now', label: 'Request a Consultation' }],
  },
  {
    icon: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    title: 'Visa or Residency Difficulties',
    text: 'Request a legal assessment of a refusal, delay or other issue affecting your immigration process.',
    links: [
      { href: '#book-now', label: 'Request a Consultation' },
      { href: '/blog/portugal-visa-denied', label: 'Read: Portugal Visa Denied?' },
    ],
  },
]

const steps = [
  { title: 'Tell us about your situation', text: 'Use the form to share a few details about your plans or the issue affecting your immigration process.' },
  { title: 'Request a consultation', text: 'Our team will get back to you to arrange a consultation with one of our attorneys.' },
  { title: 'Discuss the scope of support', text: 'In the consultation we look at your situation, explain your options and agree on the support you need.' },
]

const team = [
  {
    img: '/images/patricia-viana-round.webp',
    name: 'Patrícia Viana',
    role: 'Founder & Lead Attorney',
    bio: [
      'Patrícia Viana holds a law degree from the Pontifical Catholic University and is licensed to practise law in Portugal and Brazil. Her work centres on administrative litigation.',
      'In 2023 she completed a course in administrative litigation applied to Portuguese nationality, as well as postgraduate studies in Administrative and Fiscal Litigation in Portugal. In 2024 she took part in over one hundred court cases involving foreign nationals.',
      'She speaks Portuguese, English and Spanish.',
    ],
  },
  {
    img: '/images/bruna-xavier-profile.png',
    name: 'Bruna Xavier',
    role: 'Assistant Attorney',
    bio: [
      'Bruna Xavier is an attorney enrolled with the Portuguese Bar Association, working in Administrative and Criminal Law. She plays an active part in the procedural management of the firm’s cases.',
    ],
  },
]

export default async function HomePage() {
  let posts: Post[] = []
  try {
    posts = (await getPublishedPosts()).slice(0, 3)
  } catch {
    // Blobs not available in local dev without netlify dev — show empty state
  }

  return (
    <>
      {/* HERO */}
      <section className="hero" id="home" aria-label="Hero">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__content">
              <div className="section-tag">Immigration Lawyers in&nbsp;Lisbon,&nbsp;Portugal</div>
              <h1 className="hero__title">Legal Guidance for Your Visa and Residency in Portugal</h1>
              <p className="hero__sub">Planning a move or facing an issue with your immigration process? Our legal team can assess your situation, explain your options and help you understand the next steps.</p>

              <div className="hero__actions">
                {/* Beside the form on wide screens this would only point at the
                    card next to it, so it shows once the form drops below. */}
                <a href="#contact-form" className="btn btn-gold hero__cta-request">Request a Consultation</a>
                <a href="#areasdeatuacao" className="btn btn-outline-gold hero__cta-services">Explore Our Services</a>
              </div>

              <ul className="hero__trust" role="list">
                {['Qualified Portuguese attorneys', 'Consultations in English, Portuguese and Spanish', 'Based in Lisbon'].map(item => (
                  <li key={item}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero__form-card" id="contact-form">
              <h2 className="hero__form-title">Tell Us About Your Situation</h2>
              <p className="hero__form-sub">Share a few details and our team will get back to you.</p>
              <ContactForm submitLabel="Request a Consultation" />
            </div>
          </div>
        </div>
      </section>

      {/* NEEDS */}
      <section className="needs section section--white" id="how-we-help" aria-label="How we can help">
        <div className="container">
          <div className="needs__header">
            <div className="section-tag">Where to Start</div>
            <h2 className="section-title">How Can We Help?</h2>
            <p className="section-sub">Find the support that matches your situation.</p>
          </div>
          <div className="needs__grid" role="list">
            {needs.map(({ icon, title, text, links }) => (
              <div key={title} className="need-card" role="listitem">
                <svg className="need-card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
                <h3 className="need-card__title">{title}</h3>
                <p className="need-card__text">{text}</p>
                <div className="need-card__links">
                  {links.map(({ href, label }) =>
                    href.startsWith('/') ? (
                      <Link key={href} href={href} className="need-card__link">{label}<Arrow /></Link>
                    ) : (
                      <a key={href} href={href} className="need-card__link">{label}<Arrow /></a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services section" id="areasdeatuacao" aria-label="Our services">
        <div className="container">
          <div className="services__header">
            <div className="section-tag">What We Do</div>
            <h2 className="section-title">Legal Support for Your Next Steps</h2>
            <p className="section-sub">What our attorneys can do for you, from a first consultation on Portuguese visas to proceedings before the Portuguese courts.</p>
          </div>
          <ServiceCards services={[
            {
              icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
              title: 'Immigration Consultations',
              desc: 'A meeting with one of our attorneys to review your situation and the visa or residency options that may apply to you.',
              details: [
                'Review of your circumstances and the Portuguese visa and residency routes that may apply',
                'An outline of possible next steps, based on your income type, goals and family situation',
                'Further legal guidance as your plans progress',
                'Consultations in Portuguese, English and Spanish',
              ],
            },
            {
              icon: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
              title: 'Visa Application Support',
              desc: 'Help choosing the visa category that fits your plans and preparing your application and supporting documents.',
              details: [
                'Guidance on choosing a visa category, such as the D7, D8, D2, Golden Visa and others',
                'Preparation of consular visa applications and supporting documents',
                'Coordination with Portuguese consulates abroad',
                'Support with the move from visa to residence permit after you arrive',
                <Fragment key="alttavia-partner">Visa processing and relocation logistics are handled in partnership with{' '}
                  <a href="https://alttavia-relocation.com" target="_blank" rel="noopener">Alttavia Relocation</a>,
                  our partner for relocation services in Portugal.
                </Fragment>,
              ],
            },
            {
              icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
              title: 'Residency Applications and Renewals',
              desc: 'Preparation and follow-up of residence permit applications before AIMA, including renewals of existing permits.',
              details: [
                'Preparation and submission of residence permit applications before AIMA',
                'Document review and eligibility check before filing',
                'Appointment scheduling and follow-up with the Portuguese authorities',
                'Renewal of existing residence permits',
              ],
            },
            {
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
              title: 'Immigration Litigation',
              desc: 'Representation before the Portuguese courts when an immigration application is refused or delayed.',
              details: [
                'Administrative litigation before the Portuguese courts',
                'Appeals against refused or delayed immigration applications',
                'Legal defence in disputes over residency and nationality',
                'Cases handled directly by licensed attorneys, with no outsourcing',
              ],
            },
            {
              icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>,
              title: 'Certified Translations',
              desc: 'Certified translations of the official documents your application or case may require.',
              details: [
                'Civil documents such as birth and marriage certificates and criminal record certificates',
                'Academic and professional qualifications',
                'Documents for court and administrative proceedings',
                'Translations between Portuguese, English and Spanish',
              ],
            },
            {
              icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
              title: 'Company Incorporation',
              desc: 'Support with registering a company in Portugal and keeping it legally compliant.',
              details: [
                'Company registration and incorporation in Portugal',
                'Guidance on choosing a company structure for your situation',
                'Coordination with tax and accounting requirements',
                'Legal compliance support for your Portuguese company',
              ],
            },
          ]} />
        </div>
      </section>

      {/* HOW TO START */}
      <section className="start section" id="how-to-start" aria-label="How to start">
        <div className="container">
          <div className="start__header">
            <div className="section-tag">How to Start</div>
            <h2 className="section-title">Start with a Conversation About Your Situation</h2>
          </div>
          <ol className="start__steps">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="start-step">
                <span className="start-step__num" aria-hidden="true">{i + 1}</span>
                <h3 className="start-step__title">{title}</h3>
                <p className="start-step__text">{text}</p>
              </li>
            ))}
          </ol>
          <div className="start__cta">
            <a href="#contato" className="btn btn-gold">Request a Consultation</a>
            <a href="#book-now" className="start__book-link">Or book a consultation online</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section section--white" id="sobre" aria-label="About us">
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <div className="section-tag">About Us</div>
              <h2 className="section-title">Patrícia Viana<br/>Law Firm</h2>
              <p><strong>Established in Lisbon in 2022, our firm is a team of qualified Portuguese attorneys.</strong> We advise clients of many nationalities on Portuguese visas, residency in Portugal, nationality and immigration disputes.</p>
              <p>As immigration lawyers in Lisbon, we hold consultations in English, Portuguese and Spanish. If an application is refused or delayed, our attorneys can also represent you before the Portuguese courts.</p>
            </div>
            <div className="about__image">
              <Image src="/images/patricia-photo.jpg" alt="Patrícia Viana, founding attorney" width={683} height={1024} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM HEADER */}
      <div className="team-header" aria-label="Team section header">
        <div className="container">
          <div className="section-tag">Our People</div>
          <h2 className="section-title">Our Team</h2>
          <p className="section-sub">The attorneys who work on your case.</p>
        </div>
      </div>

      {/* TEAM */}
      <section className="team section" id="equipe" aria-label="Meet the team">
        <div className="container">
          <div className="team__grid">
            {team.map(({ img, name, role, bio }) => (
              <div key={name} className="team-card">
                <div className="team-card__photo">
                  <Image className="team-card__img" src={img} alt={`${name}, ${role}`} width={600} height={380} loading="lazy" />
                  <div className="team-card__overlay">
                    <h3 className="team-card__name">{name}</h3>
                    <div className="team-card__role">{role}</div>
                  </div>
                </div>
                <div className="team-card__body">
                  {bio.map(paragraph => (
                    <p key={paragraph} className="team-card__bio">{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials section" aria-label="Client testimonials">
        <div className="container">
          <div className="section-tag">What Clients Say</div>
          <h2 className="section-title">Client Reviews</h2>
          <p className="section-sub">Reviews our clients have left on Google.</p>
          <TestimonialsSlider />
        </div>
      </section>

      {/* BLOG */}
      <section className="blog section section--white" id="blog" aria-label="Blog">
        <div className="container">
          <div className="blog__header">
            <div className="section-tag">Blog</div>
            <h2 className="section-title">Immigration Insights</h2>
            <p className="section-sub">Explore articles on Portuguese visas, residency and immigration challenges.</p>
          </div>
          {posts.length > 0 ? (
            <div className="blog__grid">
              {posts.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text)', padding: '40px 0' }}>Articles coming soon.</p>
          )}
          <div className="blog__cta">
            <Link href="/blog" className="btn btn-outline-gold">View All Articles</Link>
          </div>
        </div>
      </section>

      {/* BOOK NOW */}
      <BookSession />

      {/* QUOTE */}
      <div className="quote" aria-label="Quote">
        <div className="container">
          <blockquote lang="en">
            &ldquo;Where the land ends and the sea begins.&rdquo;
          </blockquote>
          {/* Os Lusíadas, Canto III, stanza 20: "Onde a terra se acaba e o mar começa". */}
          <cite>Luís de Camões, <i>The Lusiads</i></cite>
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact section section--white" id="contato" aria-label="Contact">
        <div className="container">
          <div className="contact__header">
            <div className="section-tag">Get in Touch</div>
            <h2 className="section-title">Tell Us About Your Plans or Immigration Issue</h2>
            <p className="section-sub">Share a few details about your situation and the support you are looking for. Our team will get back to you to discuss the next step.</p>
          </div>
          <div className="contact__grid">
            <div className="contact__form">
              <ContactForm submitLabel="Request a Consultation" />
            </div>
            <div className="contact__right">
              <h3>Contact Details</h3>
              <p>You can also reach our Lisbon office directly.</p>
              <div role="list">
                <div className="contact__item" role="listitem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width:18, height:18, color:'var(--gold)', flexShrink:0, marginTop:2 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.8 12.8a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.71 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.15 6.15l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div className="contact__item-body">
                    <a href="tel:+351960174940">+351 960 174 940</a><br/>
                    <span style={{ fontSize:12, color:'var(--text)' }}>Call to national mobile network</span>
                  </div>
                </div>
                <div className="contact__item" role="listitem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width:18, height:18, color:'var(--gold)', flexShrink:0, marginTop:2 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div className="contact__item-body">
                    <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a>
                  </div>
                </div>
                <div className="contact__item" role="listitem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width:18, height:18, color:'var(--gold)', flexShrink:0, marginTop:2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div className="contact__item-body">
                    <a href="https://www.google.com/maps/dir//Av.+Ant%C3%B3nio+Augusto+Aguiar+24,+1050-016+Lisbon" target="_blank" rel="noopener">
                      Av. António Augusto Aguiar, 24, 1st floor right, 1050-016, Lisbon.
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact__map">
                <iframe
                  src="https://maps.google.com/maps?q=Av.%20Ant%C3%B3nio%20Augusto%20Aguiar%2C%2024%2C%201050-016%2C%20Lisbon&t=m&z=16&output=embed&iwloc=near"
                  title="Av. António Augusto Aguiar, 24, 1st floor right, 1050-016, Lisbon"
                  aria-label="Office location map"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
