import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

function getScoreColor(score) {
  if (score >= 80) return '#1D9E75'
  if (score >= 60) return '#378ADD'
  if (score >= 40) return '#BA7517'
  return '#E24B4A'
}

export default function CompetitorChart({ data }) {
  const { virality_score, competitors } = data
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(t)
  }, [])

  const maxScore = 100

  const allItems = [
    ...(competitors || []),
    { name: 'Your Content', score: virality_score, isYou: true },
  ].sort((a, b) => b.score - a.score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl p-6"
      style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(226,75,74,0.12)' }}>
          <span className="text-base">📊</span>
        </div>
        <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
          Competitor Benchmark
        </h3>
      </div>

      <div className="space-y-4">
        {allItems.map((item, i) => {
          const color = item.isYou ? '#E24B4A' : getScoreColor(item.score)
          const targetWidth = mounted ? `${(item.score / maxScore) * 100}%` : '0%'

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-4"
            >
              {/* Label */}
              <div className="w-36 shrink-0 text-right">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: item.isYou ? '#E24B4A' : '#9090A0',
                    fontFamily: item.isYou ? 'DM Mono, monospace' : 'Inter, sans-serif',
                    fontWeight: item.isYou ? 700 : 400,
                  }}
                >
                  {item.name}
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1 h-7 rounded-full overflow-hidden" style={{ background: '#1C1C1F' }}>
                <motion.div
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  initial={{ width: 0 }}
                  animate={{ width: targetWidth }}
                  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 + i * 0.08 }}
                  style={{
                    background: item.isYou
                      ? 'linear-gradient(90deg, #C73B3A, #E24B4A, #FF6B6A)'
                      : `linear-gradient(90deg, ${color}60, ${color})`,
                    boxShadow: item.isYou ? '0 0 12px rgba(226,75,74,0.4)' : 'none',
                    minWidth: 40,
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: '#fff', fontFamily: 'DM Mono, monospace' }}
                  >
                    {item.score}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 flex items-center gap-4"
        style={{ borderTop: '1px solid #2A2A2E' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9090A0' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#E24B4A' }} />
          You
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9090A0' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#1D9E75' }} />
          80+ (viral)
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9090A0' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#378ADD' }} />
          60–79 (good)
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9090A0' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#BA7517' }} />
          40–59 (avg)
        </div>
      </div>
    </motion.div>
  )
}
