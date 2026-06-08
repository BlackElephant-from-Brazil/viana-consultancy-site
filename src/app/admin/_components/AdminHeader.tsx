'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <header className="admin-header">
      <div className="container">
        <div className="admin-header__inner">
          <Image src="/images/logo.png" alt="Patrícia Viana" className="admin-header__logo" width={120} height={32} />
          <nav className="admin-header__nav">
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
            <Link href="/admin/posts/new" className={pathname === '/admin/posts/new' ? 'active' : ''}>New Post</Link>
            <button
              onClick={logout}
              disabled={loading}
              style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: 'rgba(255,255,255,.7)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            >
              {loading ? '…' : 'Logout'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
