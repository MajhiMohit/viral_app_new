import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

function getScoreColor(score) {
  if (score >= 80) return 'var(--green)'
  if (score >= 60) return 'var(--blue)'
  if (score >= 40) return 'var(--amber)'
  return 'var(--red)'
}

function getScoreLabel(score) {
  if (score >= 80) return 'Viral Potential'
  if (score >= 60) return 'Good Content'
  if (score >= 40) return 'Needs Work'
  return 'Needs Major Rework'
}

function AnimatedNumber({ target, duration = 1400 }) {
  const [current, setCurrent] = useState(0)
  const startTime = useRef(null)
  useEffect(() => {
    setCurrent(0); startTime.current = null
    let frame
    const animate = (ts) => {
      if (!startTime.current) startTime.current = ts
      const p = Math.min((ts - startTime.current) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCurrent(Math.round(e * target))
      if (p < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return <>{current}</>
}

export default function ScoreHero({ data }) {
  const { virality_score, wins, fixes } = data
  const color = getScoreColor(virality_score)
  const label = getScoreLabel(virality_score)
  const firedRef = useRef(false)
  const size = 180, strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (virality_score >= 85 && !firedRef.current) {
      firedRef.current = true
      setTimeout(() => confetti({ particleCount: 160, spread: 80, origin: { y: 0.5 }, colors: ['#E24B4A', '#1D9E75', '#378ADD', '#F0F0F2'] }), 700)
    }
  }, [virality_score])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-8"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Ring */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="score-ring">
              <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
              <motion.circle
                cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (virality_score / 100) * circumference }}
                transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold leading-none"
                style={{ fontFamily: 'DM Mono, monospace', color }}>
                <AnimatedNumber target={virality_score} />
              </span>
              <span className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>/100</span>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            {label}
          </span>
        </div>

        {/* Wins & Fixes */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>
              ✦ What's Working
            </p>
            {wins?.map((win, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.12)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }}>✓</span>
                <span style={{ color: 'var(--text-secondary)' }}>{win}</span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
              ✦ Quick Fixes
            </p>
            {fixes?.map((fix, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }}>→</span>
                <span style={{ color: 'var(--text-secondary)' }}>{fix}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
