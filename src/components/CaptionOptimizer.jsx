import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORM_LIMITS = { TikTok: 2200, Instagram: 2200, 'YouTube Shorts': 1000, X: 280 }

function CopyBtn({ text, small = false }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <button onClick={copy} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: small ? '4px 10px' : '6px 14px',
      borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono, monospace',
      cursor: 'pointer', transition: 'all 0.2s ease',
      background: copied ? 'rgba(29,184,122,0.1)' : '#18181C',
      color: copied ? '#1DB87A' : '#888796',
      border: copied ? '1px solid rgba(29,184,122,0.25)' : '1px solid #303038',
    }}>
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={11} /></motion.span>
          : <motion.span key="h" initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy size={11} /></motion.span>}
      </AnimatePresence>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function CaptionOptimizer({ data }) {
  const { platform } = useAnalysisStore()
  const { caption_insight, optimized_caption, caption_score } = data
  const limit = PLATFORM_LIMITS[platform] || 2200
  const originalCaption = useAnalysisStore(s => s.caption)
  const scoreColor = caption_score >= 80 ? '#1DB87A' : caption_score >= 60 ? '#3D8EE8' : caption_score >= 40 ? '#C07820' : '#E8453C'
  const emojiCount = (optimized_caption?.match(/\p{Emoji}/gu) || []).length
  const wordCount = optimized_caption?.split(/\s+/).filter(Boolean).length || 0
  const hasCTA = /follow|subscribe|share|like|comment|click|link|check|visit|dm|save/i.test(optimized_caption || '')

  const METRICS = [
    { label: 'Emojis', value: emojiCount > 0 ? `${emojiCount}` : 'None', ok: emojiCount > 0 && emojiCount <= 5 },
    { label: 'Words', value: `${wordCount}`, ok: wordCount >= 15 },
    { label: 'CTA', value: hasCTA ? 'Yes' : 'Missing', ok: hasCTA },
    { label: 'Length', value: (optimized_caption || '').length <= limit ? 'OK' : 'Long', ok: (optimized_caption || '').length <= limit },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(232,69,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✍️</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#EEECEA' }}>Caption Optimizer</h3>
        </div>
        <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 24, color: scoreColor }}>{caption_score}</span>
      </div>

      <p style={{ fontSize: 13, color: '#888796', lineHeight: 1.6, marginBottom: 16 }}>{caption_insight}</p>

      {/* Original */}
      <div style={{ borderRadius: 12, padding: '14px 16px', background: '#18181C', border: '1px solid #303038', marginBottom: 10 }}>
        <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.12em', color: '#4A4A58', textTransform: 'uppercase', marginBottom: 8 }}>Original</p>
        <p style={{ fontSize: 13, color: '#888796', lineHeight: 1.5, minHeight: 40 }}>
          {originalCaption || <span style={{ fontStyle: 'italic', color: '#4A4A58' }}>No caption provided</span>}
        </p>
      </div>

      {/* Optimized */}
      <div style={{ borderRadius: 12, padding: '14px 16px', background: 'rgba(29,184,122,0.04)', border: '1px solid rgba(29,184,122,0.15)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.12em', color: '#1DB87A', textTransform: 'uppercase' }}>✦ AI Optimized</p>
          <CopyBtn text={optimized_caption || ''} small />
        </div>
        <p style={{ fontSize: 13, color: '#EEECEA', lineHeight: 1.6, minHeight: 40 }}>{optimized_caption}</p>
        <p style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#4A4A58', marginTop: 8 }}>
          {(optimized_caption || '').length} / {limit} chars
        </p>
      </div>

      {/* Metric pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {METRICS.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999, fontSize: 11,
            background: m.ok ? 'rgba(29,184,122,0.06)' : 'rgba(232,69,60,0.06)',
            border: `1px solid ${m.ok ? 'rgba(29,184,122,0.18)' : 'rgba(232,69,60,0.18)'}`,
          }}>
            <span style={{ color: m.ok ? '#1DB87A' : '#E8453C', fontSize: 10 }}>{m.ok ? '✓' : '✗'}</span>
            <span style={{ color: '#888796' }}>{m.label}:</span>
            <span style={{ fontFamily: 'DM Mono, monospace', color: '#EEECEA' }}>{m.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
