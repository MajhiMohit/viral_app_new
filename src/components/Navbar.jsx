import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Clock } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube Shorts', 'X']

export default function Navbar() {
  const location = useLocation()
  const { platform, setPlatform } = useAnalysisStore()

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(10,10,11,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-[960px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E24B4A 0%, #FF8C7A 100%)' }}
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight hidden sm:block"
            style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}
          >
            Go<span style={{ color: '#E24B4A' }}>Viral</span>
          </span>
        </Link>

        {/* Platform Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#141416', border: '1px solid #2A2A2E' }}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                fontFamily: 'DM Mono, monospace',
                background: platform === p ? '#E24B4A' : 'transparent',
                color: platform === p ? '#fff' : '#9090A0',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* History icon */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200 shrink-0"
          style={{
            fontFamily: 'DM Mono, monospace',
            color: '#9090A0',
            border: '1px solid #2A2A2E',
            background: location.pathname === '/results' ? '#1C1C1F' : 'transparent',
          }}
        >
          <Clock size={13} />
          <span className="hidden sm:inline">History</span>
        </Link>
      </div>
    </motion.header>
  )
}
