import Link from 'next/link'
import { getPublishedPosts } from '@/lib/posts'
import BlogCard from '@/components/blog/BlogCard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog — Patrícia Viana Law Firm',
  description: 'Insights on Portuguese immigration law, residency, visas and more.',
}

export default async function BlogPage() {
  let posts = await getPublishedPosts().catch(() => [])

  return (
    <>
      <section style={{ paddingTop: 120, paddingBottom: 60, background: 'var(--navy)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>Insights</div>
          <h1 style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: 16 }}>Blog</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', maxWidth: 560, margin: '0 auto', fontSize: 15 }}>
            Expert insights on Portuguese immigration law, residency permits, visas, and building your new life in Portugal.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          {posts.length > 0 ? (
            <div className="blog__grid">
              {posts.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text)', padding: '60px 0', fontSize: 15 }}>
              New articles are on their way.
            </p>
          )}
        </div>
      </section>

      <section className="section section--white" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag" style={{ justifyContent: 'center' }}>Ready to start?</div>
          <h2 className="section-title" style={{ marginBottom: 20 }}>Book Your Consultation</h2>
          <a href="https://vianaconsultancy.com/contact/" className="btn btn-gold" target="_blank" rel="noopener">
            Get in Touch
          </a>
        </div>
      </section>
    </>
  )
}
