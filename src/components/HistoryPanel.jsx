import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

function getScoreColor(score) {
  if (score >= 80) return 'var(--green)'
  if (score >= 60) return 'var(--blue)'
  if (score >= 40) return 'var(--amber)'
  return 'var(--red)'
}

const HISTORY_KEY = 'goviral_history'

export default function HistoryPanel() {
  const { history } = useAnalysisStore()
  const [cleared, setCleared] = useState(false)

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY)
    useAnalysisStore.setState({ history: [] })
    setCleared(true)
    setTimeout(() => setCleared(false), 2000)
  }

  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <Clock size={28} color="var(--text-muted)" className="mx-auto mb-3" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No analysis history yet</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Your last 5 posts will appear here</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock size={15} color="var(--text-secondary)" />
          <h3 className="font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            Recent History
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            {history.length}/5
          </span>
        </div>
        <button onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
          style={{ color: cleared ? 'var(--green)' : 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          <Trash2 size={11} />
          {cleared ? 'Cleared!' : 'Clear'}
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {history.map((item, i) => {
            const color = getScoreColor(item.virality_score)
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                  style={{ background: `${color}12`, color, fontFamily: 'DM Mono, monospace' }}>
                  {item.virality_score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.fileName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
