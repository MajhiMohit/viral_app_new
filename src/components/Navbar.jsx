import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, Clock } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube Shorts', 'X']

export default function Navbar() {
  const location = useLocation()
  const { platform, setPlatform } = useAnalysisStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#08080A',
        borderBottom: '1px solid #242428',
        height: 64,
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400 }}
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: '#E8453C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Zap size={16} fill="white" color="white" />
          </motion.div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#EEECEA', letterSpacing: '-0.02em' }}>
            Go<span style={{ color: '#E8453C' }}>Viral</span>
          </span>
        </Link>

        {/* Platform pills */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 6 }}>
          {PLATFORMS.map((p) => (
            <motion.button
              key={p}
              onClick={() => setPlatform(p)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: platform === p ? 600 : 400,
                fontFamily: 'DM Mono, monospace',
                cursor: 'pointer',
                border: platform === p ? 'none' : '1px solid #303038',
                background: platform === p ? '#E8453C' : '#18181C',
                color: platform === p ? '#FFFFFF' : '#888796',
                transition: 'all 0.2s ease',
              }}
            >
              {p}
            </motion.button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: 12,
                fontFamily: 'DM Mono, monospace',
                color: '#888796',
                border: '1px solid #303038',
                background: '#18181C',
                cursor: 'pointer',
              }}
            >
              <Clock size={12} />
              History
            </motion.div>
          </Link>

          {/* Mobile toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen(s => !s)}
            className="md:hidden"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#18181C', border: '1px solid #303038',
              color: '#888796', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', borderTop: '1px solid #242428', background: '#08080A' }}
          >
            <div style={{ padding: '12px 24px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPlatform(p); setMobileOpen(false) }}
                  style={{
                    padding: '6px 16px', borderRadius: 999, fontSize: 12,
                    fontFamily: 'DM Mono, monospace', cursor: 'pointer',
                    border: platform === p ? 'none' : '1px solid #303038',
                    background: platform === p ? '#E8453C' : '#18181C',
                    color: platform === p ? '#fff' : '#888796',
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
