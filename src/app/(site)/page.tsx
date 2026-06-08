import Image from 'next/image'
import Link from 'next/link'
import TestimonialsSlider from './_components/TestimonialsSlider'
import { getPublishedPosts } from '@/lib/posts'
import type { Post } from '@/lib/posts'
import BlogCard from '@/components/blog/BlogCard'

export const dynamic = 'force-dynamic'

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
        <div className="hero__content">
          <h1 className="hero__title">A Worry-Free Future Awaits You</h1>
          <p className="hero__sub">Our mission is to simplify the immigration process, ensuring you can focus on starting your new life in Portugal without stress.</p>
          <a href="https://vianaconsultancy.com/contact/" className="btn btn-gold" target="_blank" rel="noopener">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Your Consultation
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section section--white" id="sobre" aria-label="About us">
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <div className="section-tag">About Us</div>
              <h2 className="section-title">Patrícia Viana<br/>Law Firm</h2>
              <p><strong>Was established in 2022 with a mission to simplify the immigration process for clients worldwide.</strong> As a team of qualified Portuguese attorneys, we specialize in providing personalized legal support to help you navigate the complexities of moving to Portugal.</p>
              <p>At Patrícia Viana Law Firm, we pride ourselves on our deep understanding of Portuguese immigration law, allowing us to offer accurate and efficient solutions tailored to your unique needs. Our clients trust us for our dedication, professionalism, and commitment to making their dreams of living in Portugal a reality.</p>
            </div>
            <div className="about__image">
              <Image src="/images/patricia-photo.jpg" alt="Patrícia Viana, founding attorney" width={683} height={1024} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services section" id="areasdeatuacao" aria-label="Our services">
        <div className="container">
          <div className="services__header">
            <div className="section-tag">What We Do</div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Drawing from our extensive experience working with clients of diverse nationalities, we&apos;ve been able to develop new strategies and services tailored to meet their unique needs.</p>
          </div>
          <div className="services__grid" role="list">
            {[
              { icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, title: 'Consultations', desc: 'Receive expert advice on planning your move to Portugal, tailored to your individual needs and goals.' },
              { icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>, title: 'Legal Residency Permits', desc: 'Comprehensive guidance and support to help you obtain your legal residency permit in Portugal.' },
              { icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>, title: 'Certified Translations', desc: 'Our team delivers precise and legally recognized translations for official documents.' },
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, title: 'Litigations', desc: 'We handle litigation cases with expertise, safeguarding your rights and striving for the best possible outcomes in court.' },
              { icon: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, title: 'Visa Application Assistance', desc: 'We streamline the visa application process, ensuring accuracy and efficiency every step of the way.' },
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>, title: 'Company Incorporation', desc: 'We assist in incorporating your company, ensuring legal compliance and maximizing tax benefits.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="service-card" role="listitem">
                <svg className="service-card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
                <h3 className="service-card__title">{title}</h3>
                <p className="service-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog section section--white" id="blog" aria-label="Blog">
        <div className="container">
          <div className="blog__header">
            <div className="section-tag">Insights</div>
            <h2 className="section-title">Blog</h2>
            <p className="section-sub">Be sure to check out the latest posts on our blog</p>
          </div>
          {posts.length > 0 ? (
            <div className="blog__grid">
              {posts.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text)', padding: '40px 0' }}>Articles coming soon.</p>
          )}
          <div className="blog__cta">
            <Link href="/blog" className="btn btn-outline-gold">View All</Link>
          </div>
        </div>
      </section>

      {/* TEAM HEADER */}
      <div className="team-header" aria-label="Team section header">
        <div className="container">
          <div className="section-tag">Our People</div>
          <h2 className="section-title">Our Team</h2>
          <p className="section-sub">We have a professional team that is specialized in what it does</p>
        </div>
      </div>

      {/* TEAM */}
      <section className="team section" id="equipe" aria-label="Meet the team">
        <div className="container">
          <div className="team__grid">
            {[
              { img: '/images/patricia-viana-profile.png', name: 'Patrícia Viana', role: 'Founder & Lead Attorney', bio: "Patricia Viana has a bachelor's degree in law from the Pontifical Catholic University and is an attorney licensed in Portugal and Brazil. She does have great experience in Administrative Litigation. In 2023, she did the course of Administrative Litigation applied to Portuguese nationality and concluded the postgraduate studies in Administrative and Fiscal Litigation in Portugal. In the year 2024, she has already participated in over one hundred judicial cases about foreign nationals. She speaks fluent Portuguese, English, and Spanish and is now studying French." },
              { img: '/images/bruna-xavier-profile.png', name: 'Bruna Xavier', role: 'Assistant Attorney', bio: 'Bruna Xavier is also an attorney enrolled with the Portuguese Bar Association, specializing in Administrative and Criminal Law. She has contributed quite actively to the procedural management of our firm.' },
            ].map(({ img, name, role, bio }) => (
              <div key={name} className="team-card">
                <div className="team-card__photo">
                  <Image className="team-card__img" src={img} alt={`${name} — ${role}`} width={600} height={380} loading="lazy" />
                  <div className="team-card__overlay">
                    <h3 className="team-card__name">{name}</h3>
                    <div className="team-card__role">{role}</div>
                  </div>
                </div>
                <div className="team-card__body">
                  <p className="team-card__bio">{bio}</p>
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
          <h2 className="section-title">Feedback</h2>
          <p className="section-sub">Check out what our clients have to say about their experience with us.</p>
          <TestimonialsSlider />
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote" aria-label="Quote">
        <div className="container">
          <blockquote>
            &ldquo;Immigration is not just about moving to a new country; it&apos;s about building a new life and embracing new possibilities.&rdquo;
          </blockquote>
          <cite>–</cite>
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact section section--white" id="contato" aria-label="Contact">
        <div className="container">
          <div className="contact__header">
            <div className="section-tag">Get in Touch</div>
            <h2 className="section-title">Contact</h2>
          </div>
          <div className="contact__grid">
            <div className="contact__map">
              <iframe
                src="https://maps.google.com/maps?q=Av.%20Elias%20Garcia%2C%20123-A%2C%201050-098%2C%20Lisboa&t=m&z=16&output=embed&iwloc=near"
                title="Av. Elias Garcia, 123-A, 1050-098, Lisboa"
                aria-label="Office location map"
                loading="lazy"
              />
            </div>
            <div className="contact__right">
              <h3>Get in Touch</h3>
              <p>We&apos;re here to help you start your new chapter in Portugal.</p>
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
                    <a href="https://www.google.com/maps/dir//Av.+Elias+Garcia+123A,+1050-031+Lisboa" target="_blank" rel="noopener">
                      Av. Elias Garcia, 123-A, 1050-098, Lisboa.
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
