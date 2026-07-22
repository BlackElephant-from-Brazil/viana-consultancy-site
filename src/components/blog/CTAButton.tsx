import Link from 'next/link'

export function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p style={{ textAlign: 'center', margin: '2.5rem 0' }}>
      <Link href={href} className="btn btn-gold">{children}</Link>
    </p>
  )
}
