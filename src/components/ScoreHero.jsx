import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

function getScoreColor(score) {
  if (score >= 80) return '#1DB87A'
  if (score >= 60) return '#3D8EE8'
  if (score >= 40) return '#C07820'
  return '#E8453C'
}
function getScoreLabel(score) {
  if (score >= 80) return 'Viral Potential 🔥'
  if (score >= 60) return 'Good Content ✓'
  if (score >= 40) return 'Needs Work'
  return 'Needs Rework'
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
      const ease = 1 - Math.pow(1 - p, 3)
      setCurrent(Math.round(ease * target))
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
  const SIZE = 180, SW = 10
  const radius = (SIZE - SW) / 2
  const circ = 2 * Math.PI * radius

  useEffect(() => {
    if (virality_score >= 85 && !firedRef.current) {
      firedRef.current = true
      setTimeout(() => confetti({ particleCount: 160, spread: 80, origin: { y: 0.5 }, colors: ['#E8453C', '#1DB87A', '#3D8EE8', '#EEECEA'] }), 700)
    }
  }, [virality_score])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '2rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
        className="md:flex-row">

        {/* Score ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="score-ring">
              <circle cx={SIZE/2} cy={SIZE/2} r={radius} fill="none" stroke="#242428" strokeWidth={SW} />
              <motion.circle
                cx={SIZE/2} cy={SIZE/2} r={radius} fill="none"
                stroke={color} strokeWidth={SW} strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ - (virality_score / 100) * circ }}
                transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                style={{ filter: `drop-shadow(0 0 10px ${color}70)` }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '3.2rem', color, lineHeight: 1 }}>
                <AnimatedNumber target={virality_score} />
              </span>
              <span style={{ fontSize: 11, color: '#4A4A58', fontFamily: 'DM Mono, monospace', marginTop: 4 }}>/100</span>
            </div>
          </div>
          <span style={{
            padding: '6px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: `${color}15`, color, border: `1px solid ${color}30`,
          }}>
            {label}
          </span>
        </div>

        {/* Wins & Fixes */}
        <div style={{ flex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.15em', color: '#1DB87A', textTransform: 'uppercase', marginBottom: 12 }}>
              ✦ What's Working
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {wins?.map((win, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(29,184,122,0.06)', border: '1px solid rgba(29,184,122,0.12)', fontSize: 13 }}>
                  <span style={{ color: '#1DB87A', flexShrink: 0 }}>✓</span>
                  <span style={{ color: '#888796', lineHeight: 1.5 }}>{win}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.15em', color: '#E8453C', textTransform: 'uppercase', marginBottom: 12 }}>
              ✦ Quick Fixes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fixes?.map((fix, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(232,69,60,0.06)', border: '1px solid rgba(232,69,60,0.12)', fontSize: 13 }}>
                  <span style={{ color: '#E8453C', flexShrink: 0 }}>→</span>
                  <span style={{ color: '#888796', lineHeight: 1.5 }}>{fix}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
