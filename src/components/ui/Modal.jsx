import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  const overlayRef = useRef()

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const WIDTHS = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full' }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          >
            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full ${WIDTHS[size] || WIDTHS.md} rounded-2xl`}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              {/* Header */}
              {(title || description) && (
                <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {title && (
                        <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 hover:scale-110"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-5">{children}</div>

              {/* Footer */}
              {footer && (
                <div
                  className="px-6 pb-6 pt-4 flex items-center justify-end gap-3"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
