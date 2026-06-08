import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, mobile, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Contact service unavailable' }, { status: 503 })
  }

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
