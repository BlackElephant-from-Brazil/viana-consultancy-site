import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/posts'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="blog-card">
      <div className="blog-card__img-wrap">
        {post.coverImage ? (
          <Image
            className="blog-card__img"
            src={post.coverImage}
            alt={post.title}
            width={600}
            height={175}
            style={{ objectFit: 'cover', height: 175, width: '100%' }}
          />
        ) : (
          <div className="blog-card__img" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--gold) 100%)', height: 175 }} />
        )}
      </div>
      <div className="blog-card__body">
        <div className="blog-card__cat">
          {post.tags.slice(0, 2).join(' · ') || 'Blog'}
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        {post.excerpt && <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 12, lineHeight: 1.6 }}>{post.excerpt}</p>}
        <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 10 }}>
          {post.author} · {formatDate(post.date)}
        </div>
        <Link href={`/blog/${post.slug}`} className="blog-card__link" aria-label={`Read ${post.title}`}>
          Read More <ArrowRight />
        </Link>
      </div>
    </article>
  )
}
