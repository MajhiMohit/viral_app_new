import { motion } from 'framer-motion'

const VIBE_COLORS = {
  Energetic: 'var(--accent)', Chill: 'var(--blue)', Hype: 'var(--accent)',
  Romantic: '#D97CA0', Motivational: 'var(--green)', Dark: 'var(--text-muted)',
  Upbeat: 'var(--amber)', Aesthetic: '#9B5CF6',
}

export default function AudioSuggestions({ data }) {
  const { audio_suggestions } = data
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
          <span className="text-base">🎵</span>
        </div>
        <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Trending Audio</h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— Matched to your content vibe</span>
      </div>
      <div className="space-y-3">
        {audio_suggestions?.map((audio, i) => {
          const vibeColor = VIBE_COLORS[audio.vibe] || 'var(--text-secondary)'
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              className="flex items-center gap-4 p-4 rounded-xl cursor-default"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{audio.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{audio.genre}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                style={{ background: `${vibeColor}15`, color: vibeColor, border: `1px solid ${vibeColor}30`, fontFamily: 'DM Mono, monospace' }}>
                {audio.vibe}
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▶</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
