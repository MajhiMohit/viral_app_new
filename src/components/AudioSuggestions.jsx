import { motion } from 'framer-motion'

const VIBE_COLORS = {
  Energetic: '#E8453C', Chill: '#3D8EE8', Hype: '#E8453C',
  Romantic: '#D97CA0', Motivational: '#1DB87A', Dark: '#888796',
  Upbeat: '#C07820', Aesthetic: '#9B5CF6',
}

export default function AudioSuggestions({ data }) {
  const { audio_suggestions } = data
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
      style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(232,69,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎵</div>
        <div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#EEECEA' }}>Trending Audio</h3>
          <p style={{ fontSize: 11, color: '#4A4A58', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>Matched to your content vibe</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {audio_suggestions?.map((audio, i) => {
          const vibeColor = VIBE_COLORS[audio.vibe] || '#888796'
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ x: 4, background: '#18181C', borderColor: '#303038' }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: '#18181C', border: '1px solid #242428', cursor: 'default', transition: 'all 0.2s ease' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: 'rgba(232,69,60,0.1)',
                color: '#E8453C', fontFamily: 'DM Mono, monospace', fontWeight: 600, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#EEECEA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{audio.name}</p>
                <p style={{ fontSize: 11, color: '#4A4A58', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{audio.genre}</p>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontFamily: 'DM Mono, monospace', flexShrink: 0, background: `${vibeColor}15`, color: vibeColor, border: `1px solid ${vibeColor}30` }}>
                {audio.vibe}
              </span>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#242428', border: '1px solid #303038', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#4A4A58', fontSize: 9 }}>▶</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
