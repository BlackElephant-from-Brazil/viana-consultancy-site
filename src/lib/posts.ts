import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  published: boolean
  tags: string[]
  content: string
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

function ensureDirectory(): void {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
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

export function getAllPosts(): Post[] {
  ensureDirectory()

  const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))

  return fileNames
    .map(fileName => getPostBySlug(fileName.replace(/\.md$/, '')))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter(post => post.published)
}

export function getPostBySlug(slug: string): Post | null {
  ensureDirectory()

  const filePath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug: typeof data.slug === 'string' ? data.slug : slug,
    title: typeof data.title === 'string' ? data.title : '',
    date: data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : typeof data.date === 'string'
        ? data.date
        : new Date().toISOString().split('T')[0],
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    author: typeof data.author === 'string' ? data.author : 'Patrícia Viana',
    published: typeof data.published === 'boolean' ? data.published : false,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content: content.trim(),
  }
}

export function createPost(data: Omit<Post, 'slug'> & { slug?: string }): Post {
  ensureDirectory()

  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title)
  const post: Post = {
    ...data,
    slug,
    date: data.date || new Date().toISOString().split('T')[0],
  }

  fs.writeFileSync(
    path.join(postsDirectory, `${slug}.md`),
    matter.stringify(post.content, {
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      author: post.author,
      slug: post.slug,
      published: post.published,
      tags: post.tags,
    }),
    'utf8',
  )

  return post
}

export function updatePost(slug: string, updates: Partial<Omit<Post, 'slug'>>): Post | null {
  const existing = getPostBySlug(slug)
  if (!existing) return null

  const updated: Post = { ...existing, ...updates, slug }

  fs.writeFileSync(
    path.join(postsDirectory, `${slug}.md`),
    matter.stringify(updated.content, {
      title: updated.title,
      date: updated.date,
      excerpt: updated.excerpt,
      author: updated.author,
      slug: updated.slug,
      published: updated.published,
      tags: updated.tags,
    }),
    'utf8',
  )

  return updated
}

export function deletePost(slug: string): boolean {
  ensureDirectory()
  const filePath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(filePath)) return false
  fs.unlinkSync(filePath)
  return true
}
