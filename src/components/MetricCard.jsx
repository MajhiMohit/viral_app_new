import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 80) return 'var(--green)'
  if (score >= 60) return 'var(--blue)'
  if (score >= 40) return 'var(--amber)'
  return 'var(--red)'
}

export default function MetricCard({ label, score, insight, fix, icon, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const color = getScoreColor(score)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 300 + delay * 1000)
    return () => clearTimeout(t)
  }, [score, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)', transition: { duration: 0.2 } }}
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-default"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            {label}
          </span>
        </div>
        <span className="text-xl font-bold" style={{ fontFamily: 'DM Mono, monospace', color }}>
          {score}
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full score-bar-fill"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}50` }} />
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight}</p>

      {fix && (
        <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
          style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
          <span style={{ color: 'var(--accent)' }} className="shrink-0 mt-0.5">⚡</span>
          <span style={{ color: 'var(--text-secondary)' }}>{fix}</span>
        </div>
      )}
    </motion.div>
  )
}
