import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const validUser = username === process.env.ADMIN_USER
  const hashB64 = process.env.ADMIN_PASSWORD_HASH ?? ''
  const hash = Buffer.from(hashB64, 'base64').toString('utf8')
  const validPass = await verifyPassword(password, hash)
  if (!validUser || !validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const session = await getSession()
  session.isLoggedIn = true
  session.user = { username }
  await session.save()
  return NextResponse.json({ success: true })
}
