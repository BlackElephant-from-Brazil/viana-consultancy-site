import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'
import { FAQ, FAQItem } from '@/components/blog/FAQ'
import BlogCard from '@/components/blog/BlogCard'
import { articleJsonLd, extractFaqItems, faqPageJsonLd } from '@/lib/structuredData'

export const revalidate = 3600

export function generateStaticParams() {
  try {
    return getPublishedPosts().map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  let post: ReturnType<typeof getPostBySlug> = null
  try {
    post = getPostBySlug(slug)
  } catch {
    post = null
  }
  if (!post || !post.published) return {}

  return {
    title: `${post.title} — Patrícia Viana Law Firm`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

const mdxComponents = { FAQ, FAQItem }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post: ReturnType<typeof getPostBySlug> = null
  try {
    post = getPostBySlug(slug)
  } catch {
    post = null
  }
  if (!post || !post.published) notFound()

  const faqItems = extractFaqItems(post.content)
  let relatedPosts: ReturnType<typeof getPublishedPosts> = []
  try {
    relatedPosts = getPublishedPosts().filter(p => p.slug !== post.slug).slice(0, 2)
  } catch {
    relatedPosts = []
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqItems)) }}
        />
      )}
      <section className="section section--white" style={{ paddingTop: 120 }}>
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
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 60, paddingTop: 32, textAlign: 'center' }}>
            <p style={{ color: 'var(--text)', marginBottom: 20 }}>Need legal assistance with your move to Portugal?</p>
            <Link href="/contact" className="btn btn-gold">
              Book a Consultation
            </Link>
          </div>

          {relatedPosts.length > 0 && (
            <div style={{ marginTop: 60 }}>
              <h2 style={{ fontFamily: 'Marcellus, serif', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: 24 }}>
                Related Articles
              </h2>
              <div className="blog__grid">
                {relatedPosts.map(p => <BlogCard key={p.slug} post={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
