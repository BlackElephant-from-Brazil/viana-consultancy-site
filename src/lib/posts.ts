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

export async function getPublishedPosts(): Promise<Post[]> {
  return []
}

export async function getAllPosts(): Promise<Post[]> {
  return []
}

export async function getPostBySlug(_slug: string): Promise<Post | null> {
  return null
}

export async function createPost(_data: Omit<Post, 'slug'> & { slug?: string }): Promise<Post> {
  throw new Error('Not implemented')
}

export async function updatePost(_slug: string, _updates: Partial<Omit<Post, 'slug'>>): Promise<Post | null> {
  return null
}

export async function deletePost(_slug: string): Promise<boolean> {
  return false
}
