import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  glass = false,
  elevated = false,
  padding = 'p-6',
  onClick,
  style = {},
  ...props
}) {
  const baseStyle = glass
    ? {
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-md)',
      }
    : elevated
    ? {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }
    : {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -3, boxShadow: 'var(--shadow-lg)' } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`rounded-2xl ${padding} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ ...baseStyle, ...style }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* Sub-components */
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3
      className={`text-base font-bold ${className}`}
      style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
    >
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`mt-4 pt-4 ${className}`}
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {children}
    </div>
  )
}
