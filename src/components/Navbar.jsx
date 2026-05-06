import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sun, Moon, Menu, X, Clock } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'
import Button from './ui/Button'

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube Shorts', 'X']

export default function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { platform, setPlatform } = useAnalysisStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-[960px] mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-hover) 0%, var(--accent) 100%)' }}
          >
            <Zap size={15} fill="white" color="white" />
          </motion.div>
          <span
            className="text-lg font-black tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
          >
            Go<span style={{ color: 'var(--accent)' }}>Viral</span>
          </span>
        </Link>

        {/* ── Platform selector (desktop) ── */}
        <div
          className="hidden md:flex items-center gap-0.5 p-1 rounded-xl"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          {PLATFORMS.map((p) => (
            <motion.button
              key={p}
              onClick={() => setPlatform(p)}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                fontFamily: 'DM Mono, monospace',
                background: platform === p ? 'var(--accent)' : 'transparent',
                color: platform === p ? '#fff' : 'var(--text-secondary)',
                boxShadow: platform === p ? '0 2px 8px rgba(226,75,74,0.3)' : 'none',
              }}
            >
              {p}
            </motion.button>
          ))}
        </div>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2">
          {/* History link */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                background: location.pathname === '/' ? 'var(--bg-elevated)' : 'transparent',
              }}
            >
              <Clock size={12} />
              History
            </motion.div>
          </Link>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={15} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={15} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile menu toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen(s => !s)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </motion.button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPlatform(p); setMobileOpen(false) }}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    background: platform === p ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: platform === p ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
