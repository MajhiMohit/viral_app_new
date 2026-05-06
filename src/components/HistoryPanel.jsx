import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, TrendingUp } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

function getColor(score) {
  if (score >= 80) return '#1DB87A'
  if (score >= 60) return '#3D8EE8'
  if (score >= 40) return '#C07820'
  return '#E8453C'
}

export default function HistoryPanel() {
  const { history } = useAnalysisStore()
  const [cleared, setCleared] = useState(false)

  const clearHistory = () => {
    localStorage.removeItem('goviral_history')
    useAnalysisStore.setState({ history: [] })
    setCleared(true); setTimeout(() => setCleared(false), 2000)
  }

  if (!history || history.length === 0) {
    return (
      <div style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
        <Clock size={28} color="#303038" style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: 13, color: '#4A4A58' }}>No analysis history yet</p>
        <p style={{ fontSize: 11, color: '#4A4A58', marginTop: 4 }}>Your last 5 posts will appear here</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={15} color="#888796" />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#EEECEA' }}>Recent History</span>
          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontFamily: 'DM Mono, monospace', background: '#18181C', color: '#4A4A58', border: '1px solid #303038' }}>
            {history.length}/5
          </span>
        </div>
        <button onClick={clearHistory} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, fontSize: 12,
          fontFamily: 'DM Mono, monospace', cursor: 'pointer', transition: 'all 0.2s ease',
          background: cleared ? 'rgba(29,184,122,0.08)' : '#18181C',
          color: cleared ? '#1DB87A' : '#4A4A58',
          border: cleared ? '1px solid rgba(29,184,122,0.2)' : '1px solid #303038',
        }}>
          <Trash2 size={11} /> {cleared ? 'Cleared!' : 'Clear'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence>
          {history.map((item, i) => {
            const color = getColor(item.virality_score)
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ delay: i * 0.04 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: '#18181C', border: '1px solid #303038' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}12`, color, fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.virality_score}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#EEECEA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.fileName}</p>
                  <p style={{ fontSize: 11, color: '#4A4A58', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
                    {item.platform} · {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <TrendingUp size={13} color={color} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
