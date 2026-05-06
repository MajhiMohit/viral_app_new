import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

const TYPE_META = {
  trending:  { label: 'Trending',  color: '#E8453C', bg: 'rgba(232,69,60,0.1)',   border: 'rgba(232,69,60,0.2)' },
  niche:     { label: 'Niche',     color: '#3D8EE8', bg: 'rgba(61,142,232,0.1)',  border: 'rgba(61,142,232,0.2)' },
  evergreen: { label: 'Evergreen', color: '#888796', bg: '#18181C',               border: '#303038' },
}

function HashTag({ tag, type }) {
  const [copied, setCopied] = useState(false)
  const meta = TYPE_META[type] || TYPE_META.evergreen
  const copy = async () => { await navigator.clipboard.writeText(`#${tag}`); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={copy}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 999, fontSize: 11,
        fontFamily: 'DM Mono, monospace', cursor: 'pointer', transition: 'all 0.2s ease',
        background: copied ? 'rgba(29,184,122,0.1)' : meta.bg,
        color: copied ? '#1DB87A' : meta.color,
        border: `1px solid ${copied ? 'rgba(29,184,122,0.25)' : meta.border}`,
      }}>
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={9} /></motion.span>
          : <motion.span key="h" initial={{ scale: 0 }} animate={{ scale: 1 }}>#</motion.span>}
      </AnimatePresence>
      {tag}
    </motion.button>
  )
}

export default function HashtagPanel({ data }) {
  const { hashtags } = data
  const [allCopied, setAllCopied] = useState(false)
  const grouped = { trending: [], niche: [], evergreen: [] }
  hashtags?.forEach(h => { (grouped[h.type] || grouped.evergreen).push(h) })

  const copyAll = async () => {
    await navigator.clipboard.writeText(hashtags?.map(h => `#${h.tag}`).join(' ') || '')
    setAllCopied(true); setTimeout(() => setAllCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(232,69,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#E8453C', fontFamily: 'DM Mono, monospace' }}>#</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#EEECEA' }}>Hashtag Strategy</h3>
          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontFamily: 'DM Mono, monospace', background: '#18181C', color: '#4A4A58', border: '1px solid #303038' }}>
            {hashtags?.length || 0} tags
          </span>
        </div>
        <button onClick={copyAll} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono, monospace',
          cursor: 'pointer', transition: 'all 0.2s ease',
          background: allCopied ? 'rgba(29,184,122,0.1)' : '#18181C',
          color: allCopied ? '#1DB87A' : '#888796',
          border: allCopied ? '1px solid rgba(29,184,122,0.25)' : '1px solid #303038',
        }}>
          {allCopied ? <Check size={12} /> : <Copy size={12} />}
          {allCopied ? 'Copied!' : 'Copy All'}
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {Object.entries(TYPE_META).map(([type, meta]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: meta.color }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
            {meta.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(grouped).map(([type, tags]) => tags.length > 0 && (
          <div key={type}>
            <p style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.12em', color: TYPE_META[type].color, textTransform: 'uppercase', marginBottom: 8 }}>
              {TYPE_META[type].label}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map((h, i) => <HashTag key={i} tag={h.tag} type={h.type} />)}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
