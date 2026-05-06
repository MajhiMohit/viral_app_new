import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function getColor(score) {
  if (score >= 80) return '#1DB87A'
  if (score >= 60) return '#3D8EE8'
  if (score >= 40) return '#C07820'
  return '#E8453C'
}

export default function CompetitorChart({ data }) {
  const { virality_score, competitors } = data
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t) }, [])

  const allItems = [...(competitors || []), { name: 'Your Content', score: virality_score, isYou: true }].sort((a, b) => b.score - a.score)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(232,69,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📊</div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#EEECEA' }}>Competitor Benchmark</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {allItems.map((item, i) => {
          const color = item.isYou ? '#E8453C' : getColor(item.score)
          return (
            <motion.div key={item.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 130, textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: item.isYou ? 700 : 400, fontFamily: item.isYou ? 'DM Mono, monospace' : 'Inter, sans-serif', color: item.isYou ? '#E8453C' : '#888796' }}>
                  {item.name}
                </span>
              </div>
              <div style={{ flex: 1, height: 26, borderRadius: 999, background: '#18181C', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: mounted ? `${item.score}%` : '0%' }}
                  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 + i * 0.07 }}
                  style={{ height: '100%', borderRadius: 999, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                    background: item.isYou ? 'linear-gradient(90deg, #C73B3A, #E8453C)' : `linear-gradient(90deg, ${color}60, ${color})`,
                    boxShadow: item.isYou ? '0 0 12px rgba(232,69,60,0.35)' : 'none' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'DM Mono, monospace' }}>{item.score}</span>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #242428', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {[['#E8453C','You'],['#1DB87A','80+ Viral'],['#3D8EE8','60–79 Good'],['#C07820','40–59 Avg']].map(([c, l], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#4A4A58' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} /> {l}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
