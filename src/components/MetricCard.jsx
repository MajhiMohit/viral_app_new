import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 80) return '#1D9E75'
  if (score >= 60) return '#378ADD'
  if (score >= 40) return '#BA7517'
  return '#E24B4A'
}

export default function MetricCard({ label, score, insight, fix, icon, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const color = getScoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 300 + delay * 1000)
    return () => clearTimeout(timer)
  }, [score, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-default transition-shadow duration-200"
      style={{
        background: '#141416',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
            {label}
          </span>
        </div>
        <span
          className="text-xl font-bold"
          style={{ fontFamily: 'DM Mono, monospace', color }}
        >
          {score}
        </span>
      </div>

      {/* Score bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#2A2A2E' }}>
        <div
          className="h-full rounded-full score-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}90, ${color})`,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>

      {/* Insight */}
      <p className="text-sm leading-relaxed" style={{ color: '#9090A0' }}>
        {insight}
      </p>

      {/* Fix */}
      {fix && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl text-xs"
          style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.1)' }}
        >
          <span style={{ color: '#E24B4A' }} className="shrink-0 mt-0.5">⚡</span>
          <span style={{ color: '#C0C0CC' }}>{fix}</span>
        </div>
      )}
    </motion.div>
  )
}
