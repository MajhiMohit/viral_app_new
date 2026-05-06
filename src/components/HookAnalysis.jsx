import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const FORMULA_COLORS = {
  'Question Hook':    '#3D8EE8',
  'Shock Hook':       '#E8453C',
  'Story Hook':       '#1DB87A',
  'Pattern Interrupt':'#C07820',
  'Curiosity Gap':    '#9B5CF6',
}

export default function HookAnalysis({ data }) {
  const { hook_score, hook_formula, hook_insight, hook_rewrites } = data
  const formulaColor = FORMULA_COLORS[hook_formula] || '#E8453C'
  const scoreColor = hook_score >= 80 ? '#1DB87A' : hook_score >= 60 ? '#3D8EE8' : hook_score >= 40 ? '#C07820' : '#E8453C'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(232,69,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎣</div>
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#EEECEA' }}>Hook Analysis</h3>
            <p style={{ fontSize: 11, color: '#4A4A58', fontFamily: 'DM Mono, monospace' }}>First 3 seconds</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontFamily: 'DM Mono, monospace', background: `${formulaColor}15`, color: formulaColor, border: `1px solid ${formulaColor}30` }}>
            {hook_formula}
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 24, color: scoreColor }}>
            {hook_score}
          </span>
        </div>
      </div>

      {/* Bar */}
      <div style={{ height: 3, background: '#242428', borderRadius: 999, marginBottom: 16, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${hook_score}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${scoreColor}70, ${scoreColor})`, borderRadius: 999 }}
        />
      </div>

      <p style={{ fontSize: 14, color: '#888796', lineHeight: 1.6, marginBottom: 20 }}>{hook_insight}</p>

      {/* Rewrites */}
      <div>
        <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.15em', color: '#4A4A58', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={10} color="#E8453C" /> 3 Stronger Hook Rewrites
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hook_rewrites?.map((rewrite, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
              style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 12, background: '#18181C', border: '1px solid #303038', fontSize: 14 }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: '50%', background: '#E8453C',
                color: '#fff', fontFamily: 'DM Mono, monospace', fontWeight: 600, fontSize: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </span>
              <span style={{ color: '#EEECEA', lineHeight: 1.6 }}>"{rewrite}"</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
