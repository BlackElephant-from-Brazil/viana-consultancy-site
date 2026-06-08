import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts()
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post || !post.published) notFound()

  return (
    <>
      {post.coverImage && (
        <div style={{ width: '100%', height: 380, position: 'relative', marginTop: 72 }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(1,19,66,.4)' }} />
        </div>
      )}

      <section className="section section--white" style={{ paddingTop: post.coverImage ? 48 : 120 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gold)', marginBottom: 32 }}>
            ← Back to Blog
          </Link>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {post.tags.map(tag => (
              <span key={tag} className="blog-card__cat" style={{ background: 'var(--gold-pale)', padding: '2px 10px', borderRadius: 20 }}>{tag}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: 16 }}>
            {post.title}
          </h1>

          <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 40 }}>
            By <strong style={{ color: 'var(--navy)' }}>{post.author}</strong> · {formatDate(post.date)}
          </p>

          <div className="post-content">
            <MDXRemote source={post.content} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 60, paddingTop: 32, textAlign: 'center' }}>
            <p style={{ color: 'var(--text)', marginBottom: 20 }}>Need legal assistance with your move to Portugal?</p>
            <a href="https://vianaconsultancy.com/contact/" className="btn btn-gold" target="_blank" rel="noopener">
              Book a Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
