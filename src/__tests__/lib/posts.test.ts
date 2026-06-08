// Mock @netlify/blobs with an in-memory store
const store = new Map<string, string>()

jest.mock('@netlify/blobs', () => ({
  getStore: () => ({
    get: async (key: string, opts?: { type?: string }) => {
      const val = store.get(key)
      if (val === undefined) return null
      return opts?.type === 'json' ? JSON.parse(val) : val
    },
    set: async (key: string, value: string) => { store.set(key, value) },
    delete: async (key: string) => { store.delete(key) },
  }),
}))

import { createPost, getAllPosts, getPublishedPosts, getPostBySlug, updatePost, deletePost } from '@/lib/posts'

beforeEach(() => store.clear())

describe('posts CRUD', () => {
  it('createPost saves a post and returns it with a slug', async () => {
    const post = await createPost({ title: 'Hello World', content: '# Hi', excerpt: 'short', author: 'Patrícia', published: true, tags: ['visa'], date: '2026-06-08' })
    expect(post.slug).toBe('hello-world')
    expect(post.title).toBe('Hello World')
  })

  it('getAllPosts returns all created posts', async () => {
    await createPost({ title: 'Post A', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-01' })
    await createPost({ title: 'Post B', content: '', excerpt: '', author: '', published: false, tags: [], date: '2026-06-02' })
    const all = await getAllPosts()
    expect(all).toHaveLength(2)
  })

  it('getPublishedPosts returns only published posts sorted by date desc', async () => {
    await createPost({ title: 'Old', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-01-01' })
    await createPost({ title: 'New', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-01' })
    await createPost({ title: 'Draft', content: '', excerpt: '', author: '', published: false, tags: [], date: '2026-06-05' })
    const pub = await getPublishedPosts()
    expect(pub).toHaveLength(2)
    expect(pub[0].title).toBe('New')
  })

  it('getPostBySlug returns post or null', async () => {
    await createPost({ title: 'Find Me', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-08' })
    const found = await getPostBySlug('find-me')
    expect(found?.title).toBe('Find Me')
    const missing = await getPostBySlug('no-such-post')
    expect(missing).toBeNull()
  })

  it('updatePost merges changes', async () => {
    await createPost({ title: 'Original', content: 'old', excerpt: '', author: '', published: false, tags: [], date: '2026-06-08' })
    const updated = await updatePost('original', { published: true, content: 'new' })
    expect(updated?.published).toBe(true)
    expect(updated?.content).toBe('new')
    expect(updated?.title).toBe('Original')
  })

  it('deletePost removes the post and returns true', async () => {
    await createPost({ title: 'Delete Me', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-08' })
    const ok = await deletePost('delete-me')
    expect(ok).toBe(true)
    expect(await getPostBySlug('delete-me')).toBeNull()
    expect(await getAllPosts()).toHaveLength(0)
  })

  it('deletePost returns false for non-existent slug', async () => {
    const ok = await deletePost('ghost')
    expect(ok).toBe(false)
  })
})
