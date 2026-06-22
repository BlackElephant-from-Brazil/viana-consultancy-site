'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

export type ToastType = 'success' | 'error'
export type ToastItem = { id: number; message: string; type: ToastType }

const STORAGE_KEY = 'admin-pending-toast'

/** Queues a toast to be shown on the next page load (e.g. after a redirect). */
export function queueToast(message: string, type: ToastType) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ message, type }))
  } catch {
    // sessionStorage unavailable — toast just won't survive the navigation
  }
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      sessionStorage.removeItem(STORAGE_KEY)
      const pending = JSON.parse(raw) as { message: string; type: ToastType }
      addToast(pending.message, pending.type)
    } catch {
      // ignore malformed/unavailable storage
    }
  }, [addToast])

  return { toasts, addToast }
}

export function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={16} aria-hidden="true" />
          ) : (
            <XCircle size={16} aria-hidden="true" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
