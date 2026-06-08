import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import PostForm from '../../../_components/PostForm'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Edit: {post.title}</h2>
        </div>
        <PostForm mode="edit" initialPost={post} />
      </div>
    </div>
  )
}
