import { motion } from 'framer-motion'
import { Sparkles, Tag } from 'lucide-react'

const FORMULA_COLORS = {
  'Question Hook': '#378ADD',
  'Shock Hook': '#E24B4A',
  'Story Hook': '#1D9E75',
  'Pattern Interrupt': '#BA7517',
  'Curiosity Gap': '#9B5CF6',
}

export default function HookAnalysis({ data }) {
  const { hook_score, hook_formula, hook_insight, hook_rewrites } = data
  const formulaColor = FORMULA_COLORS[hook_formula] || '#E24B4A'

  const scoreColor = hook_score >= 80 ? '#1D9E75' : hook_score >= 60 ? '#378ADD' : hook_score >= 40 ? '#BA7517' : '#E24B4A'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl p-6"
      style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(226,75,74,0.12)' }}>
            <span className="text-base">🎣</span>
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
            Hook Analysis
          </h3>
          <span className="text-xs" style={{ color: '#606070', fontFamily: 'DM Mono, monospace' }}>
            First 3 seconds
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Formula tag */}
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: `${formulaColor}15`, color: formulaColor, border: `1px solid ${formulaColor}30` }}
          >
            <Tag size={10} />
            {hook_formula}
          </span>
          {/* Score */}
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: 'DM Mono, monospace', color: scoreColor }}
          >
            {hook_score}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1 rounded-full mb-6" style={{ background: '#2A2A2E' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${hook_score}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})` }}
        />
      </div>

      {/* Insight */}
      <p className="text-sm leading-relaxed mb-6" style={{ color: '#9090A0' }}>
        {hook_insight}
      </p>

      {/* Rewrites */}
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: '#606070', fontFamily: 'DM Mono, monospace' }}>
          <Sparkles size={11} color="#E24B4A" />
          3 Stronger Hook Rewrites
        </p>
        <div className="space-y-2">
          {hook_rewrites?.map((rewrite, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{ background: '#1C1C1F', border: '1px solid #2A2A2E' }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: '#E24B4A', color: '#fff', fontFamily: 'DM Mono, monospace' }}
              >
                {i + 1}
              </span>
              <span style={{ color: '#D0D0DA', lineHeight: 1.6 }}>"{rewrite}"</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
