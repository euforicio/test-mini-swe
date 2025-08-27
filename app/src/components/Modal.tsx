import React from 'react'
import clsx from 'clsx'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  ariaLabel?: string
}
export const Modal: React.FC<Props> = ({ open, onClose, children, ariaLabel = 'Dialog' }) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        className={clsx('bg-white rounded shadow-lg p-4 w-full max-w-md', 'outline-none')}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
