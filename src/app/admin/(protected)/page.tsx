import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostsTable from '../_components/PostsTable'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let posts = await getAllPosts().catch(() => [])
  posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Posts ({posts.length})</h2>
          <Link href="/admin/posts/new" className="btn btn-gold" style={{ padding: '9px 20px', fontSize: 13 }}>
            + New Post
          </Link>
        </div>
        <PostsTable initialPosts={posts} />
      </div>
    </div>
  )
}
