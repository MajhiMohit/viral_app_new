import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

const TYPE_STYLES = {
  trending: { bg: 'rgba(226,75,74,0.1)', color: '#E24B4A', border: 'rgba(226,75,74,0.25)', label: 'Trending' },
  niche:    { bg: 'rgba(55,138,221,0.1)', color: '#378ADD', border: 'rgba(55,138,221,0.25)', label: 'Niche' },
  evergreen:{ bg: 'rgba(100,100,120,0.1)', color: '#9090A0', border: 'rgba(100,100,120,0.25)', label: 'Evergreen' },
}

function HashtagChip({ tag, type }) {
  const [copied, setCopied] = useState(false)
  const styles = TYPE_STYLES[type] || TYPE_STYLES.evergreen

  const copy = async () => {
    await navigator.clipboard.writeText(`#${tag}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
      style={{
        background: copied ? 'rgba(29,158,117,0.12)' : styles.bg,
        color: copied ? '#1D9E75' : styles.color,
        border: `1px solid ${copied ? 'rgba(29,158,117,0.3)' : styles.border}`,
        fontFamily: 'DM Mono, monospace',
      }}
    >
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={10} /></motion.span>
          : <motion.span key="h" initial={{ scale: 0 }} animate={{ scale: 1 }}>#</motion.span>
        }
      </AnimatePresence>
      {tag}
    </motion.button>
  )
}

export default function HashtagPanel({ data }) {
  const { hashtags } = data
  const [allCopied, setAllCopied] = useState(false)

  const grouped = { trending: [], niche: [], evergreen: [] }
  hashtags?.forEach(h => {
    if (grouped[h.type]) grouped[h.type].push(h)
    else grouped.evergreen.push(h)
  })

  const copyAll = async () => {
    const all = hashtags?.map(h => `#${h.tag}`).join(' ') || ''
    await navigator.clipboard.writeText(all)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-6"
      style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(226,75,74,0.12)' }}>
            <span className="text-base">#</span>
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
            Hashtag Strategy
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1C1C1F', color: '#9090A0' }}>
            {hashtags?.length || 0} tags
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={copyAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{
            background: allCopied ? 'rgba(29,158,117,0.12)' : '#1C1C1F',
            color: allCopied ? '#1D9E75' : '#9090A0',
            border: `1px solid ${allCopied ? 'rgba(29,158,117,0.3)' : '#2A2A2E'}`,
          }}
        >
          {allCopied ? <Check size={12} /> : <Copy size={12} />}
          {allCopied ? 'Copied All!' : 'Copy All'}
        </motion.button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-5">
        {Object.entries(TYPE_STYLES).map(([type, style]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs" style={{ color: style.color }}>
            <div className="w-2 h-2 rounded-full" style={{ background: style.color }} />
            {style.label}
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([type, tags]) => (
          tags.length > 0 && (
            <div key={type}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: TYPE_STYLES[type].color, fontFamily: 'DM Mono, monospace' }}>
                {TYPE_STYLES[type].label}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((h, i) => (
                  <HashtagChip key={i} tag={h.tag} type={h.type} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </motion.div>
  )
}
