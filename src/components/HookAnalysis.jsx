import { motion } from 'framer-motion'
import { Sparkles, Tag } from 'lucide-react'

const FORMULA_COLORS = {
  'Question Hook': 'var(--blue)',
  'Shock Hook': 'var(--accent)',
  'Story Hook': 'var(--green)',
  'Pattern Interrupt': 'var(--amber)',
  'Curiosity Gap': '#9B5CF6',
}

export default function HookAnalysis({ data }) {
  const { hook_score, hook_formula, hook_insight, hook_rewrites } = data
  const formulaColor = FORMULA_COLORS[hook_formula] || 'var(--accent)'
  const scoreColor = hook_score >= 80 ? 'var(--green)' : hook_score >= 60 ? 'var(--blue)' : hook_score >= 40 ? 'var(--amber)' : 'var(--red)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-subtle)' }}>
            <span className="text-base">🎣</span>
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            Hook Analysis
          </h3>
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
            First 3 seconds
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: `${formulaColor}15`, color: formulaColor, border: `1px solid ${formulaColor}30` }}>
            <Tag size={10} /> {hook_formula}
          </span>
          <span className="text-2xl font-bold" style={{ fontFamily: 'DM Mono, monospace', color: scoreColor }}>
            {hook_score}
          </span>
        </div>
      </div>

      <div className="h-1 rounded-full mb-6" style={{ background: 'var(--bg-elevated)' }}>
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${hook_score}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})` }} />
      </div>

      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{hook_insight}</p>

      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
          <Sparkles size={11} color="var(--accent)" /> 3 Stronger Hook Rewrites
        </p>
        <div className="space-y-2">
          {hook_rewrites?.map((rewrite, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'DM Mono, monospace' }}>
                {i + 1}
              </span>
              <span style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>"{rewrite}"</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
