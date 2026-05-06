import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Check } from 'lucide-react'

const Input = forwardRef(function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  success,
  hint,
  icon,
  iconRight,
  disabled = false,
  required = false,
  className = '',
  textarea = false,
  rows = 3,
  ...props
}, ref) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const borderColor = error
    ? 'var(--red)'
    : success
    ? 'var(--green)'
    : focused
    ? 'var(--accent)'
    : 'var(--border)'

  const shadowColor = error
    ? 'rgba(226,75,74,0.12)'
    : success
    ? 'rgba(29,158,117,0.12)'
    : focused
    ? 'rgba(226,75,74,0.12)'
    : 'transparent'

  const sharedStyle = {
    background: disabled ? 'var(--bg-elevated)' : 'var(--bg-surface)',
    border: `1.5px solid ${borderColor}`,
    boxShadow: focused || error || success ? `0 0 0 3px ${shadowColor}` : 'var(--shadow-sm)',
    color: 'var(--text-primary)',
    borderRadius: 12,
    width: '100%',
    padding: icon ? '10px 12px 10px 40px' : iconRight || isPassword ? '10px 40px 10px 12px' : '10px 12px',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    resize: 'vertical',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'auto',
  }

  const InputEl = textarea ? 'textarea' : 'input'

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focused ? 'var(--accent)' : 'var(--text-muted)' }}>
            {icon}
          </div>
        )}

        <InputEl
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={textarea ? rows : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
          {...props}
        />

        {/* Right — password toggle or status icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          {success && !isPassword && <Check size={14} color="var(--green)" />}
          {error && !isPassword && <AlertCircle size={14} color="var(--red)" />}
          {iconRight && !isPassword && !success && !error && (
            <span style={{ color: 'var(--text-muted)' }}>{iconRight}</span>
          )}
        </div>
      </div>

      {/* Hint / Error message */}
      <AnimatePresence>
        {(error || hint) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs"
            style={{ color: error ? 'var(--red)' : 'var(--text-muted)' }}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

export default Input
