import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 80) return '#1DB87A'
  if (score >= 60) return '#3D8EE8'
  if (score >= 40) return '#C07820'
  return '#E8453C'
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
      whileHover={{ y: -3, background: '#18181C', borderColor: '#303038' }}
      style={{
        background: '#111114',
        border: '1px solid #242428',
        borderRadius: 16,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'default',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#EEECEA' }}>
            {label}
          </span>
        </div>
        <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 20, color }}>
          {score}
        </span>
      </div>

      <div style={{ height: 3, borderRadius: 999, background: '#242428', overflow: 'hidden' }}>
        <div
          className="score-bar-fill"
          style={{
            height: '100%', width: `${width}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}70, ${color})`,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>

      <p style={{ fontSize: 12, color: '#888796', lineHeight: 1.5 }}>{insight}</p>

      {fix && (
        <div style={{
          display: 'flex', gap: 8, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(232,69,60,0.06)', border: '1px solid rgba(232,69,60,0.12)',
          fontSize: 11,
        }}>
          <span style={{ color: '#E8453C', flexShrink: 0 }}>⚡</span>
          <span style={{ color: '#888796' }}>{fix}</span>
        </div>
      )}
    </motion.div>
  )
}
