import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ChevronRight } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORM_LIMITS = {
  TikTok: 2200,
  Instagram: 2200,
  'YouTube Shorts': 1000,
  X: 280,
}

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        background: copied ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.05)',
        color: copied ? '#1D9E75' : '#9090A0',
        border: `1px solid ${copied ? 'rgba(29,158,117,0.3)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={11} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy size={11} />
          </motion.span>
        )}
      </AnimatePresence>
      {copied ? 'Copied!' : label}
    </motion.button>
  )
}

export default function CaptionOptimizer({ data }) {
  const { platform } = useAnalysisStore()
  const { caption_insight, optimized_caption, caption_score } = data
  const limit = PLATFORM_LIMITS[platform] || 2200
  const originalCaption = useAnalysisStore(s => s.caption)

  const scoreColor = caption_score >= 80 ? '#1D9E75' : caption_score >= 60 ? '#378ADD' : caption_score >= 40 ? '#BA7517' : '#E24B4A'

  // Simple metrics
  const emojiCount = (optimized_caption?.match(/\p{Emoji}/gu) || []).length
  const wordCount = optimized_caption?.split(/\s+/).filter(Boolean).length || 0
  const hasCTA = /follow|subscribe|share|like|comment|click|link|check|visit|dm|save/i.test(optimized_caption || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl p-6"
      style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(226,75,74,0.12)' }}>
            <span className="text-base">✍️</span>
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
            Caption Optimizer
          </h3>
        </div>
        <span className="text-2xl font-bold" style={{ fontFamily: 'DM Mono, monospace', color: scoreColor }}>
          {caption_score}
        </span>
      </div>

      {/* Insight */}
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#9090A0' }}>
        {caption_insight}
      </p>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Original */}
        <div className="rounded-xl p-4" style={{ background: '#1C1C1F', border: '1px solid #2A2A2E' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#606070', fontFamily: 'DM Mono, monospace' }}>
            Original
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#9090A0', minHeight: 60 }}>
            {originalCaption || <span className="italic" style={{ color: '#606070' }}>No caption provided</span>}
          </p>
        </div>

        {/* Optimized */}
        <div className="rounded-xl p-4 relative" style={{ background: 'rgba(29,158,117,0.04)', border: '1px solid rgba(29,158,117,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#1D9E75', fontFamily: 'DM Mono, monospace' }}>
              ✦ AI Optimized
            </p>
            <CopyButton text={optimized_caption || ''} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#D0D0DA', minHeight: 60 }}>
            {optimized_caption}
          </p>
          <p className="text-xs mt-3" style={{ color: '#606070', fontFamily: 'DM Mono, monospace' }}>
            {(optimized_caption || '').length} / {limit} chars
          </p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Emoji Density', value: emojiCount > 0 ? `${emojiCount} emoji` : 'None', ok: emojiCount > 0 && emojiCount <= 5 },
          { label: 'Word Count', value: `${wordCount} words`, ok: wordCount >= 15 },
          { label: 'CTA Present', value: hasCTA ? 'Yes' : 'Missing', ok: hasCTA },
          { label: 'Char Limit', value: (optimized_caption || '').length <= limit ? 'Within limit' : 'Too long', ok: (optimized_caption || '').length <= limit },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{
              background: m.ok ? 'rgba(29,158,117,0.08)' : 'rgba(226,75,74,0.08)',
              border: `1px solid ${m.ok ? 'rgba(29,158,117,0.2)' : 'rgba(226,75,74,0.2)'}`,
            }}>
            <span style={{ color: m.ok ? '#1D9E75' : '#E24B4A' }}>{m.ok ? '✓' : '✗'}</span>
            <span style={{ color: '#9090A0' }}>{m.label}:</span>
            <span style={{ color: '#F0F0F2', fontFamily: 'DM Mono, monospace' }}>{m.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
