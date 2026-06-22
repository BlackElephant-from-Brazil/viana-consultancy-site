import fs from 'fs'
import path from 'path'
import { createPost, getAllPosts, getPublishedPosts, getPostBySlug, updatePost, deletePost } from '@/lib/posts'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')
const createdSlugs: string[] = []

function track(slug: string) {
  createdSlugs.push(slug)
  return slug
}

afterEach(() => {
  while (createdSlugs.length) {
    const slug = createdSlugs.pop()!
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
})

describe('posts CRUD', () => {
  it('createPost saves a post and returns it with a slug', () => {
    const post = createPost({ title: 'Hello World', content: '# Hi', excerpt: 'short', author: 'Patrícia', published: true, tags: ['visa'], date: '2026-06-08' })
    track(post.slug)
    expect(post.slug).toBe('hello-world')
    expect(post.title).toBe('Hello World')
  })

  it('getAllPosts returns all created posts', () => {
    track(createPost({ title: 'Post A', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-01' }).slug)
    track(createPost({ title: 'Post B', content: '', excerpt: '', author: '', published: false, tags: [], date: '2026-06-02' }).slug)
    const all = getAllPosts().filter(p => createdSlugs.includes(p.slug))
    expect(all).toHaveLength(2)
  })

  it('getPublishedPosts returns only published posts sorted by date desc', () => {
    track(createPost({ title: 'Old', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-01-01' }).slug)
    track(createPost({ title: 'New', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-01' }).slug)
    track(createPost({ title: 'Draft', content: '', excerpt: '', author: '', published: false, tags: [], date: '2026-06-05' }).slug)
    const pub = getPublishedPosts().filter(p => createdSlugs.includes(p.slug))
    expect(pub).toHaveLength(2)
    expect(pub[0].title).toBe('New')
  })

  it('getPostBySlug returns post or null', () => {
    track(createPost({ title: 'Find Me', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-08' }).slug)
    const found = getPostBySlug('find-me')
    expect(found?.title).toBe('Find Me')
    const missing = getPostBySlug('no-such-post')
    expect(missing).toBeNull()
  })

  it('updatePost merges changes', () => {
    track(createPost({ title: 'Original', content: 'old', excerpt: '', author: '', published: false, tags: [], date: '2026-06-08' }).slug)
    const updated = updatePost('original', { published: true, content: 'new' })
    expect(updated?.published).toBe(true)
    expect(updated?.content).toBe('new')
    expect(updated?.title).toBe('Original')
  })

  it('deletePost removes the post and returns true', () => {
    const slug = createPost({ title: 'Delete Me', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-08' }).slug
    const ok = deletePost('delete-me')
    expect(ok).toBe(true)
    expect(getPostBySlug('delete-me')).toBeNull()
    // already deleted from disk, don't try to clean up again
    createdSlugs.splice(createdSlugs.indexOf(slug), 1)
  })

  it('deletePost returns false for non-existent slug', () => {
    const ok = deletePost('ghost')
    expect(ok).toBe(false)
  })
})
