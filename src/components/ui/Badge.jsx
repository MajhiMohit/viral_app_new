import { motion } from 'framer-motion'

const VARIANTS = {
  default:   { bg: 'var(--bg-elevated)',              color: 'var(--text-secondary)', border: 'var(--border)' },
  primary:   { bg: 'var(--accent-subtle)',             color: 'var(--accent)',          border: 'var(--accent-border)' },
  success:   { bg: 'rgba(29,158,117,0.1)',             color: 'var(--green)',           border: 'rgba(29,158,117,0.2)' },
  warning:   { bg: 'rgba(186,117,23,0.1)',             color: 'var(--amber)',           border: 'rgba(186,117,23,0.2)' },
  danger:    { bg: 'rgba(226,75,74,0.1)',              color: 'var(--red)',             border: 'rgba(226,75,74,0.2)' },
  blue:      { bg: 'rgba(55,138,221,0.1)',             color: 'var(--blue)',            border: 'rgba(55,138,221,0.2)' },
  trending:  { bg: 'rgba(226,75,74,0.1)',              color: 'var(--red)',             border: 'rgba(226,75,74,0.2)' },
  niche:     { bg: 'rgba(55,138,221,0.1)',             color: 'var(--blue)',            border: 'rgba(55,138,221,0.2)' },
  evergreen: { bg: 'rgba(100,100,120,0.08)',           color: 'var(--text-muted)',      border: 'var(--border)' },
}

const SIZES = {
  xs: 'px-2 py-0.5 text-xs rounded-md',
  sm: 'px-2.5 py-1 text-xs rounded-lg',
  md: 'px-3 py-1.5 text-xs rounded-full',
  lg: 'px-4 py-2 text-sm rounded-full',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
}) {
  const v = VARIANTS[variant] || VARIANTS.default
  const s = SIZES[size] || SIZES.md

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 font-medium ${s} ${className}`}
      style={{
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        fontFamily: 'DM Mono, monospace',
      }}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${pulse ? 'animate-pulse' : ''}`}
          style={{ background: v.color }}
        />
      )}
      {children}
    </motion.span>
  )
}
