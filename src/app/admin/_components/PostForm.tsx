'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ImageIcon } from 'lucide-react'
import type { Post } from '@/lib/posts'
import { queueToast, useToasts, ToastViewport } from './Toast'

type PostFormProps = {
  initialPost?: Post
  mode: 'create' | 'edit'
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

function markdownPreview(md: string): string {
  return md
    // FAQ blocks (before other replacements)
    .replace(/<FAQ>([\s\S]*?)<\/FAQ>/g, (_, inner: string) => {
      const items = inner.replace(
        /<FAQItem q="([^"]*)">([\s\S]*?)<\/FAQItem>/g,
        (_m: string, q: string, a: string) =>
          `<details class="preview-faq-item"><summary class="preview-faq-q">${q}</summary><div class="preview-faq-a">${a.trim()}</div></details>`,
      )
      return `<div class="preview-faq">${items}</div>`
    })
    // Images (before links)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="preview-img" />')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
    .replace(/^(?!<[h1-6buidU]).+$/gm, line => (line.trim() ? `<p>${line}</p>` : ''))
}

export default function PostForm({ initialPost, mode }: PostFormProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toasts, addToast } = useToasts()

  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [author, setAuthor] = useState(initialPost?.author ?? 'Patrícia Viana')
  const [date, setDate] = useState(initialPost?.date ?? new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState(initialPost?.tags.join(', ') ?? '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '')
  const [published, setPublished] = useState(initialPost?.published ?? false)
  const [content, setContent] = useState(initialPost?.content ?? '')

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (mode === 'create') setSlug(slugify(v))
  }

  const insertAtCursor = useCallback((text: string) => {
    const ta = textareaRef.current
    if (!ta) {
      setContent(prev => prev + text)
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    setContent(prev => prev.slice(0, start) + text + prev.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + text.length, start + text.length)
    })
  }, [])

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

  const insertLinePrefix = (prefix: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const next = content.slice(0, lineStart) + prefix + content.slice(lineStart)
    setContent(next)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }

  const insertFAQTemplate = () => {
    insertAtCursor(
      '\n<FAQ>\n<FAQItem q="Your question here">\nYour answer here.\n</FAQItem>\n<FAQItem q="Another question">\nAnother answer here.\n</FAQItem>\n</FAQ>\n',
    )
  }

  const toolbar = [
    { label: 'H1', action: () => insertLinePrefix('# ') },
    { label: 'H2', action: () => insertLinePrefix('## ') },
    { label: 'H3', action: () => insertLinePrefix('### ') },
    { label: 'B', action: () => insertAt('**', '**') },
    { label: 'I', action: () => insertAt('_', '_') },
    { label: '"', action: () => insertLinePrefix('> ') },
    { label: 'FAQ', action: insertFAQTemplate },
  ]

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? 'Upload failed')
      }
      const data = await res.json() as { url: string }
      insertAtCursor(`![](${data.url})`)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Image upload failed.', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      addToast('Title is required.', 'error')
      return
    }
    setSaving(true)
    const payload = {
      title, slug, author, date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt, published, content,
    }
    const url = mode === 'create' ? '/api/posts' : `/api/posts/${initialPost!.slug}`
    const method = mode === 'create' ? 'POST' : 'PUT'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(err.error ?? 'Failed to save post.')
      }
      const saved = await res.json() as Post
      if (mode === 'create') {
        queueToast('Post created.', 'success')
        router.push(`/admin/posts/${saved.slug}/edit`)
      } else {
        addToast('Post updated.', 'success')
        setSaving(false)
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save post.', 'error')
      setSaving(false)
    }
  }

  const preview = markdownPreview(content)

  return (
    <div className="post-editor">
      <ToastViewport toasts={toasts} />

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
          <button className={`editor-tab${tab === 'write' ? ' active' : ''}`} onClick={() => setTab('write')} type="button">Write</button>
          <button className={`editor-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')} type="button">Preview</button>
        </div>

        {tab === 'write' && (
          <>
            <div className="editor-toolbar">
              {toolbar.map(t => (
                <button key={t.label} className="toolbar-btn" onClick={t.action} type="button">{t.label}</button>
              ))}
              <button
                className="toolbar-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                type="button"
                title="Insert image"
              >
                <ImageIcon size={12} style={{ verticalAlign: -2, marginRight: 4 }} aria-hidden="true" />
                {uploading ? 'Uploading…' : 'Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden-file-input"
                onChange={handleImageUpload}
              />
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
          content ? (
            <div className="preview-content post-content" dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <div className="preview-content" style={{ textAlign: 'center', color: 'var(--text)' }}>
              Preview will appear here as you write...
            </div>
          )
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
