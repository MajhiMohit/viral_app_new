import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORM_LIMITS = { TikTok: 2200, Instagram: 2200, 'YouTube Shorts': 1000, X: 280 }

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{ background: copied ? 'rgba(29,158,117,0.12)' : 'var(--bg-elevated)', color: copied ? 'var(--green)' : 'var(--text-secondary)', border: `1px solid ${copied ? 'rgba(29,158,117,0.3)' : 'var(--border)'}` }}>
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={11} /></motion.span>
          : <motion.span key="h" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy size={11} /></motion.span>
        }
      </AnimatePresence>
      {copied ? 'Copied!' : 'Copy'}
    </motion.button>
  )
}

export default function CaptionOptimizer({ data }) {
  const { platform } = useAnalysisStore()
  const { caption_insight, optimized_caption, caption_score } = data
  const limit = PLATFORM_LIMITS[platform] || 2200
  const originalCaption = useAnalysisStore(s => s.caption)
  const scoreColor = caption_score >= 80 ? 'var(--green)' : caption_score >= 60 ? 'var(--blue)' : caption_score >= 40 ? 'var(--amber)' : 'var(--red)'
  const emojiCount = (optimized_caption?.match(/\p{Emoji}/gu) || []).length
  const wordCount = optimized_caption?.split(/\s+/).filter(Boolean).length || 0
  const hasCTA = /follow|subscribe|share|like|comment|click|link|check|visit|dm|save/i.test(optimized_caption || '')

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
            <span className="text-base">✍️</span>
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Caption Optimizer</h3>
        </div>
        <span className="text-2xl font-bold" style={{ fontFamily: 'DM Mono, monospace', color: scoreColor }}>{caption_score}</span>
      </div>

      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{caption_insight}</p>

      <div className="grid grid-cols-1 gap-3 mb-5">
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>Original</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', minHeight: 50 }}>
            {originalCaption || <span className="italic" style={{ color: 'var(--text-muted)' }}>No caption provided</span>}
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(29,158,117,0.04)', border: '1px solid rgba(29,158,117,0.15)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>✦ AI Optimized</p>
            <CopyButton text={optimized_caption || ''} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', minHeight: 50 }}>{optimized_caption}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{(optimized_caption || '').length} / {limit} chars</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Emoji Density', value: emojiCount > 0 ? `${emojiCount} emoji` : 'None', ok: emojiCount > 0 && emojiCount <= 5 },
          { label: 'Word Count', value: `${wordCount} words`, ok: wordCount >= 15 },
          { label: 'CTA Present', value: hasCTA ? 'Yes' : 'Missing', ok: hasCTA },
          { label: 'Char Limit', value: (optimized_caption || '').length <= limit ? 'OK' : 'Too long', ok: (optimized_caption || '').length <= limit },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
            style={{ background: m.ok ? 'rgba(29,158,117,0.08)' : 'rgba(226,75,74,0.08)', border: `1px solid ${m.ok ? 'rgba(29,158,117,0.2)' : 'rgba(226,75,74,0.2)'}` }}>
            <span style={{ color: m.ok ? 'var(--green)' : 'var(--red)' }}>{m.ok ? '✓' : '✗'}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{m.label}:</span>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace' }}>{m.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
