import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export type SessionData = {
  user?: { username: string }
  isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? 'placeholder-replace-with-32-char-secret-minimum',
  cookieName: 'viana-admin-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function requireAuth(): Promise<boolean> {
  const session = await getSession()
  return session.isLoggedIn === true
}
