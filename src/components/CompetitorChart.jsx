import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 80) return 'var(--green)'
  if (score >= 60) return 'var(--blue)'
  if (score >= 40) return 'var(--amber)'
  return 'var(--red)'
}

export default function CompetitorChart({ data }) {
  const { virality_score, competitors } = data
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t) }, [])

  const allItems = [
    ...(competitors || []),
    { name: 'Your Content', score: virality_score, isYou: true },
  ].sort((a, b) => b.score - a.score)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
          <span className="text-base">📊</span>
        </div>
        <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Competitor Benchmark</h3>
      </div>
      <div className="space-y-4">
        {allItems.map((item, i) => {
          const color = item.isYou ? 'var(--accent)' : getScoreColor(item.score)
          const targetW = mounted ? `${(item.score / 100) * 100}%` : '0%'
          return (
            <motion.div key={item.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-4">
              <div className="w-36 shrink-0 text-right">
                <span className="text-xs font-medium"
                  style={{ color: item.isYou ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: item.isYou ? 'DM Mono, monospace' : 'Inter, sans-serif', fontWeight: item.isYou ? 700 : 400 }}>
                  {item.name}
                </span>
              </div>
              <div className="flex-1 h-7 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <motion.div className="h-full rounded-full flex items-center justify-end pr-3"
                  initial={{ width: 0 }} animate={{ width: targetW }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 + i * 0.08 }}
                  style={{
                    background: item.isYou
                      ? 'linear-gradient(90deg, var(--accent-hover), var(--accent), #FF6B6A)'
                      : `linear-gradient(90deg, ${color}60, ${color})`,
                    boxShadow: item.isYou ? '0 0 12px rgba(226,75,74,0.4)' : 'none',
                    minWidth: 40,
                  }}>
                  <span className="text-xs font-bold" style={{ color: '#fff', fontFamily: 'DM Mono, monospace' }}>{item.score}</span>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-5 pt-4 flex flex-wrap items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { color: 'var(--accent)', label: 'You' },
          { color: 'var(--green)', label: '80+ viral' },
          { color: 'var(--blue)', label: '60–79 good' },
          { color: 'var(--amber)', label: '40–59 avg' },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} /> {l.label}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
