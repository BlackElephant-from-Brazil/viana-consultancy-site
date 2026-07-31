import Link from 'next/link'
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
      <div className="blog-card__body">
        <div className="blog-card__cat">
          {post.tags.slice(0, 2).join(' · ') || 'Blog'}
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <div className="blog-card__meta">
          {post.author} · {formatDate(post.date)}
        </div>
        <Link href={`/blog/${post.slug}`} className="blog-card__link" aria-label={`Read ${post.title}`}>
          Read More <ArrowRight />
        </Link>
      </div>
    </article>
  )
}
