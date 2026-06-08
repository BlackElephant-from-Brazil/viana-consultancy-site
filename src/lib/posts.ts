import { getStore } from '@netlify/blobs'
import fs from 'fs'
import path from 'path'

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  published: boolean
  tags: string[]
  content: string
  coverImage?: string
}

// Minimal interface matching the Netlify Blobs store API
interface BlobStore {
  get(key: string, opts?: { type?: string }): Promise<unknown>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

// Local file-based fallback used when Netlify Blobs is unavailable (npm run dev)
const DEV_STORE_PATH = path.join(process.cwd(), '.dev-blobs.json')

function readDevStore(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(DEV_STORE_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function writeDevStore(data: Record<string, string>): void {
  fs.writeFileSync(DEV_STORE_PATH, JSON.stringify(data, null, 2))
}

function devFileStore(): BlobStore {
  return {
    async get(key: string, opts?: { type?: string }): Promise<unknown> {
      const data = readDevStore()
      const val = data[key]
      if (val === undefined) return null
      return opts?.type === 'json' ? JSON.parse(val) : val
    },
    async set(key: string, value: string): Promise<void> {
      const data = readDevStore()
      data[key] = value
      writeDevStore(data)
    },
    async delete(key: string): Promise<void> {
      const data = readDevStore()
      delete data[key]
      writeDevStore(data)
    },
  }
}

function store(): BlobStore {
  try {
    return getStore('posts') as unknown as BlobStore
  } catch {
    return devFileStore()
  }
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function getIndex(): Promise<string[]> {
  const s = store()
  const idx = await s.get('index', { type: 'json' }) as string[] | null
  return idx ?? []
}

async function saveIndex(index: string[]): Promise<void> {
  await store().set('index', JSON.stringify(index))
}

export async function getAllPosts(): Promise<Post[]> {
  const s = store()
  const index = await getIndex()
  const posts = await Promise.all(
    index.map(slug => s.get(`post:${slug}`, { type: 'json' }) as Promise<Post | null>)
  )
  return posts.filter((p): p is Post => p !== null)
}

export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getAllPosts()
  return all
    .filter(p => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await store().get(`post:${slug}`, { type: 'json' }) as Post | null
  return post
}

export async function createPost(
  data: Omit<Post, 'slug'> & { slug?: string }
): Promise<Post> {
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title)
  const post: Post = {
    slug,
    title: data.title,
    date: data.date || new Date().toISOString().split('T')[0],
    excerpt: data.excerpt ?? '',
    author: data.author ?? 'Patrícia Viana',
    published: data.published ?? false,
    tags: data.tags ?? [],
    content: data.content ?? '',
    ...(data.coverImage ? { coverImage: data.coverImage } : {}),
  }
  await store().set(`post:${slug}`, JSON.stringify(post))
  const index = await getIndex()
  if (!index.includes(slug)) {
    await saveIndex([...index, slug])
  }
  return post
}

export async function updatePost(
  slug: string,
  updates: Partial<Omit<Post, 'slug'>>
): Promise<Post | null> {
  const existing = await getPostBySlug(slug)
  if (!existing) return null
  const updated: Post = { ...existing, ...updates }
  await store().set(`post:${slug}`, JSON.stringify(updated))
  return updated
}

export async function deletePost(slug: string): Promise<boolean> {
  const existing = await getPostBySlug(slug)
  if (!existing) return false
  await store().delete(`post:${slug}`)
  const index = await getIndex()
  await saveIndex(index.filter(s => s !== slug))
  return true
}
