import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/session'
import AdminHeader from '../_components/AdminHeader'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const authed = await requireAuth()
  if (!authed) redirect('/admin/login')
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-content">
        {children}
      </div>
    </div>
  )
}
