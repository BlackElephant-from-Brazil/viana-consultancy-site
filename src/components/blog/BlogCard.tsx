import type { Post } from '@/lib/posts'

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="blog-card">
      <div className="blog-card__body">
        <h3 className="blog-card__title">{post.title}</h3>
      </div>
    </article>
  )
}
