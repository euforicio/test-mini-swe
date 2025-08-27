import React from 'react'

type Toast = { id: string; message: string; variant?: 'info' | 'success' | 'error' }
type Ctx = { push: (t: Omit<Toast, 'id'>) => void }
const ToastContext = React.createContext<Ctx | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const push = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 2500)
  }, [])
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="fixed bottom-2 right-2 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'px-3 py-2 rounded shadow text-sm ' +
              (t.variant === 'error'
                ? 'bg-red-600 text-white'
                : t.variant === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white')
            }
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
