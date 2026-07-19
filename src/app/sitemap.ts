import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/posts'

const baseUrl = 'https://vianaconsultancy.com'

export default function sitemap(): MetadataRoute.Sitemap {
  let posts: ReturnType<typeof getPublishedPosts> = []
  try {
    posts = getPublishedPosts()
  } catch {
    posts = []
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes]
}
