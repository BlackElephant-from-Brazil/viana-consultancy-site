import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/posts'
import { requireAuth } from '@/lib/session'

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const posts = await getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  if (!data.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
