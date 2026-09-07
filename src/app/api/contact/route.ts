import { NextRequest, NextResponse } from 'next/server'
import { isSpam } from '@/lib/spam'

/** Reject cross-origin POSTs; same-origin requests send a matching Origin. */
function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // some legit clients omit it; honeypot/time-trap still apply
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, mobile, email, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Invisible bot protection. On a hit we pretend it worked so the bot moves
  // on, but we never forward the submission to the webhook.
  if (!originAllowed(req) || isSpam(body)) {
    return NextResponse.json({ success: true })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Contact service unavailable' }, { status: 503 })
  }

  // The form no longer asks for a subject, but the n8n workflow still reads
  // one, so we send a derived line and the payload shape stays identical.
  // TODO: delete `subject` here once n8n stops reading it.
  const subject = `Website enquiry from ${name}`

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile, email, subject, message }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
