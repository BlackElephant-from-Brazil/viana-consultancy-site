'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'

type PostFormProps = {
  initialPost?: Post
  mode: 'create' | 'edit'
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function PostForm({ initialPost, mode }: PostFormProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [author, setAuthor] = useState(initialPost?.author ?? 'Patrícia Viana')
  const [date, setDate] = useState(initialPost?.date ?? new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState(initialPost?.tags.join(', ') ?? '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '')
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage ?? '')
  const [published, setPublished] = useState(initialPost?.published ?? false)
  const [content, setContent] = useState(initialPost?.content ?? '')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (mode === 'create') setSlug(slugify(v))
  }

  const insertAt = (before: string, after = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(next)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  const toolbar = [
    { label: 'H1', action: () => insertAt('# ') },
    { label: 'H2', action: () => insertAt('## ') },
    { label: 'H3', action: () => insertAt('### ') },
    { label: 'B', action: () => insertAt('**', '**') },
    { label: 'I', action: () => insertAt('_', '_') },
    { label: '"', action: () => insertAt('\n> ') },
  ]

  const handleSave = async () => {
    setError('')
    if (!title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    const payload = {
      title, slug, author, date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt, coverImage, published, content,
    }
    const url = mode === 'create' ? '/api/posts' : `/api/posts/${initialPost!.slug}`
    const method = mode === 'create' ? 'POST' : 'PUT'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) {
      const saved = await res.json()
      showToast(mode === 'create' ? 'Post created!' : 'Post updated!')
      if (mode === 'create') router.push(`/admin/posts/${saved.slug}/edit`)
    } else {
      const err = await res.json().catch(() => ({}))
      setError(err.error ?? 'Failed to save post.')
    }
  }

  return (
    <div className="post-editor">
      {toast && (
        <div className="toast-container">
          <div className="toast toast--success">{toast}</div>
        </div>
      )}

      {error && <div className="login-error" style={{ marginBottom: 20 }}>{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="title">Title *</label>
        <input id="title" type="text" className="form-input" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="slug">Slug</label>
          <input id="slug" type="text" className="form-input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-slug" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="author">Author</label>
          <input id="author" type="text" className="form-input" value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input id="date" type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" type="text" className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="visa, residency, Portugal" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="excerpt">Excerpt</label>
        <input id="excerpt" type="text" className="form-input" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary shown in blog cards" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="coverImage">Cover Image URL</label>
        <input id="coverImage" type="url" className="form-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://example.com/image.jpg" />
      </div>

      <div className="form-group">
        <div className="toggle-wrap">
          <label className="toggle" htmlFor="published">
            <input id="published" type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          <span className="form-label" style={{ marginBottom: 0 }}>Published</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Content (Markdown)</label>
        <div className="editor-tabs">
          <button className={`editor-tab${tab === 'write' ? ' active' : ''}`} onClick={() => setTab('write')}>Write</button>
          <button className={`editor-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>Preview</button>
        </div>

        {tab === 'write' && (
          <>
            <div className="editor-toolbar">
              {toolbar.map(t => (
                <button key={t.label} className="toolbar-btn" onClick={t.action} type="button">{t.label}</button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="form-textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post in Markdown..."
            />
          </>
        )}

        {tab === 'preview' && (
          <div className="preview-content post-content" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(content) }} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button onClick={() => router.push('/admin')} className="btn btn-outline-gold" type="button">Cancel</button>
        <button onClick={handleSave} className="btn btn-gold" disabled={saving} type="button">
          {saving ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Update Post'}
        </button>
      </div>
    </div>
  )
}

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    || '<p>' + md + '</p>'
}
