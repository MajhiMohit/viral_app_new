import { motion } from 'framer-motion'

const VIBE_COLORS = {
  Energetic: '#E24B4A',
  Chill: '#378ADD',
  Hype: '#E24B4A',
  Romantic: '#D97CA0',
  Motivational: '#1D9E75',
  Dark: '#9090A0',
  Upbeat: '#BA7517',
  Aesthetic: '#9B5CF6',
}

export default function AudioSuggestions({ data }) {
  const { audio_suggestions } = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl p-6"
      style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(226,75,74,0.12)' }}>
          <span className="text-base">🎵</span>
        </div>
        <h3 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
          Trending Audio
        </h3>
        <span className="text-xs" style={{ color: '#606070' }}>— Matched to your content vibe</span>
      </div>

      <div className="space-y-3">
        {audio_suggestions?.map((audio, i) => {
          const vibeColor = VIBE_COLORS[audio.vibe] || '#9090A0'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              className="flex items-center gap-4 p-4 rounded-xl cursor-default"
              style={{ background: '#1C1C1F', border: '1px solid #2A2A2E' }}
            >
              {/* Track number */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: 'rgba(226,75,74,0.1)', color: '#E24B4A', fontFamily: 'DM Mono, monospace' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#F0F0F2' }}>
                  {audio.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9090A0' }}>
                  {audio.genre}
                </p>
              </div>

              {/* Vibe tag */}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                style={{
                  background: `${vibeColor}15`,
                  color: vibeColor,
                  border: `1px solid ${vibeColor}30`,
                  fontFamily: 'DM Mono, monospace',
                }}
              >
                {audio.vibe}
              </span>

              {/* Play icon (decorative) */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span style={{ color: '#606070', fontSize: 10 }}>▶</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
