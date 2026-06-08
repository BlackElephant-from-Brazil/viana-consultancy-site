'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Pencil, Trash2, ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/posts'

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className="toast-container">
      <div className={`toast toast--${type}`}>{msg}</div>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const togglePublished = async (post: Post) => {
    setLoadingSlug(post.slug)
    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    })
    setLoadingSlug(null)
    if (res.ok) {
      setPosts(prev => prev.map(p => p.slug === post.slug ? { ...p, published: !p.published } : p))
      showToast(post.published ? 'Post unpublished.' : 'Post published.', 'success')
    } else {
      showToast('Failed to update post.', 'error')
    }
  }

  const deletePost = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setLoadingSlug(post.slug)
    const res = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' })
    setLoadingSlug(null)
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.slug !== post.slug))
      showToast('Post deleted.', 'success')
    } else {
      showToast('Failed to delete post.', 'error')
    }
  }

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ overflowX: 'auto' }}>
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text)' }}>No posts yet. <Link href="/admin/posts/new" style={{ color: 'var(--gold)' }}>Create the first one →</Link></td></tr>
            ) : posts.map(post => (
              <tr key={post.slug}>
                <td className="posts-table__title">{post.title}</td>
                <td>{post.author}</td>
                <td>{formatDate(post.date)}</td>
                <td>
                  <span className={`status-badge status-badge--${post.published ? 'published' : 'draft'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="icon-btn icon-btn--success"
                      onClick={() => togglePublished(post)}
                      disabled={loadingSlug === post.slug}
                      title={post.published ? 'Unpublish' : 'Publish'}
                    >
                      {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    {post.published && (
                      <a className="icon-btn" href={`/blog/${post.slug}`} target="_blank" rel="noopener" title="View post">
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <Link className="icon-btn" href={`/admin/posts/${post.slug}/edit`} title="Edit">
                      <Pencil size={15} />
                    </Link>
                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() => deletePost(post)}
                      disabled={loadingSlug === post.slug}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
