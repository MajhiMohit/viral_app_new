import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const VARIANTS = {
  primary: {
    base: 'text-white font-semibold',
    style: (disabled) => ({
      background: disabled
        ? 'var(--bg-elevated)'
        : 'linear-gradient(135deg, var(--accent-hover) 0%, var(--accent) 50%, #FF6B6A 100%)',
      color: disabled ? 'var(--text-muted)' : '#fff',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(226,75,74,0.28)',
      border: '1px solid transparent',
    }),
  },
  secondary: {
    base: 'font-medium',
    style: () => ({
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }),
  },
  ghost: {
    base: 'font-medium',
    style: () => ({
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    }),
  },
  outline: {
    base: 'font-medium',
    style: () => ({
      background: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
    }),
  },
  danger: {
    base: 'font-semibold text-white',
    style: () => ({
      background: 'var(--red)',
      color: '#fff',
      border: '1px solid transparent',
    }),
  },
}

const SIZES = {
  xs:  'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  sm:  'px-4 py-2 text-sm rounded-xl gap-2',
  md:  'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg:  'px-6 py-3 text-base rounded-2xl gap-2.5',
  xl:  'px-8 py-4 text-base rounded-2xl gap-3',
}

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`
        inline-flex items-center justify-center
        font-inter ${s} ${v.base}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      style={v.style(disabled || loading)}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 rounded-full border-2"
          style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'currentColor' }}
        />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  )
})

export default Button
