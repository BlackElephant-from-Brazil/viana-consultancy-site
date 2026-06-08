import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const validUser = username === process.env.ADMIN_USER
  const validPass = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? '')
  if (!validUser || !validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const session = await getSession()
  session.isLoggedIn = true
  session.user = { username }
  await session.save()
  return NextResponse.json({ success: true })
}
