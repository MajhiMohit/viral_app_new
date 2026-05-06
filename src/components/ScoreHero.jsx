import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

function getScoreColor(score) {
  if (score >= 80) return '#1D9E75'
  if (score >= 60) return '#378ADD'
  if (score >= 40) return '#BA7517'
  return '#E24B4A'
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
    setCurrent(0)
    startTime.current = null
    let frame

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return <>{current}</>
}

export default function ScoreHero({ data }) {
  const { virality_score, wins, fixes, platform } = data
  const color = getScoreColor(virality_score)
  const label = getScoreLabel(virality_score)
  const confettiFired = useRef(false)

  // Ring math
  const size = 180
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (virality_score >= 85 && !confettiFired.current) {
      confettiFired.current = true
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#E24B4A', '#1D9E75', '#378ADD', '#F0F0F2'],
        })
      }, 800)
    }
  }, [virality_score])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-8"
      style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Score Ring */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="score-ring">
              {/* Background track */}
              <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="#2A2A2E" strokeWidth={strokeWidth}
              />
              {/* Animated score arc */}
              <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (virality_score / 100) * circumference }}
                transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
              />
            </svg>

            {/* Center number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-bold leading-none"
                style={{ fontFamily: 'DM Mono, monospace', color }}
              >
                <AnimatedNumber target={virality_score} />
              </span>
              <span className="text-xs mt-1" style={{ color: '#9090A0', fontFamily: 'DM Mono, monospace' }}>
                /100
              </span>
            </div>
          </div>

          <div className="text-center">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Wins & Fixes */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Wins */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#1D9E75', fontFamily: 'DM Mono, monospace' }}>
              ✦ What's Working
            </p>
            {wins?.map((win, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.12)' }}
              >
                <span className="mt-0.5 shrink-0" style={{ color: '#1D9E75' }}>✓</span>
                <span style={{ color: '#C0C0CC' }}>{win}</span>
              </motion.div>
            ))}
          </div>

          {/* Fixes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#E24B4A', fontFamily: 'DM Mono, monospace' }}>
              ✦ Quick Fixes
            </p>
            {fixes?.map((fix, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.12)' }}
              >
                <span className="mt-0.5 shrink-0" style={{ color: '#E24B4A' }}>→</span>
                <span style={{ color: '#C0C0CC' }}>{fix}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
