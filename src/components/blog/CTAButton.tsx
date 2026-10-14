import Link from 'next/link'

export function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:\/\//.test(href)
  return (
    <p style={{ textAlign: 'center', margin: '2.5rem 0' }}>
      {external ? (
        <a href={href} className="btn btn-gold" target="_blank" rel="noopener noreferrer">{children}</a>
      ) : (
        <Link href={href} className="btn btn-gold">{children}</Link>
      )}
    </p>
  )
}
