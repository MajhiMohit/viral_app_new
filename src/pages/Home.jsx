import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, AlertCircle, Play, ImageIcon, Zap, Hash, Mic2 } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import HistoryPanel from '../components/HistoryPanel'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORM_ICONS = { TikTok: '🎵', Instagram: '📸', 'YouTube Shorts': '▶️', X: '𝕏' }

const FEATURES = [
  {
    icon: <Zap size={20} />, label: 'Virality Score', desc: 'AI-powered 0–100 rating',
    iconBg: 'rgba(232,69,60,0.12)', iconColor: '#E8453C',
  },
  {
    icon: <Play size={20} />, label: 'Hook Analysis', desc: 'First 3-second scoring',
    iconBg: 'rgba(61,142,232,0.12)', iconColor: '#3D8EE8',
  },
  {
    icon: <Hash size={20} />, label: 'Hashtag Strategy', desc: '12–15 targeted tags',
    iconBg: 'rgba(29,184,122,0.12)', iconColor: '#1DB87A',
  },
  {
    icon: <Mic2 size={20} />, label: 'Audio Trends', desc: 'Matched sound suggestions',
    iconBg: 'rgba(192,120,32,0.12)', iconColor: '#C07820',
  },
]

const STATS = [
  { value: '50K+', label: 'Creators analyzed' },
  { value: '+34%', label: 'Avg score boost' },
  { value: '12K', label: 'Viral posts found' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload Content', desc: 'Drop a video (MP4/MOV) or image (JPG/PNG/WEBP) up to 50MB.' },
  { step: '02', title: 'AI Analysis', desc: 'Claude analyzes hook, pacing, thumbnail, caption, and trend alignment.' },
  { step: '03', title: 'Get Your Score', desc: 'Receive a 0–100 virality score with specific, actionable fixes.' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function Home() {
  const navigate = useNavigate()
  const { file, caption, setCaption, platform, loading, error, analyze, clearError, history } = useAnalysisStore()

  const handleAnalyze = async () => {
    clearError()
    await analyze()
    navigate('/results')
  }

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: '#08080A' }}
    >
      {/* ── HERO ─────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Red glow + dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 800px 400px at 50% -100px, rgba(232,69,60,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="hero-grid" />

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '72px 2rem 64px', position: 'relative', textAlign: 'center' }}>

          {/* Badge */}
          <motion.div {...fadeUp(0)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999, fontSize: 12,
              fontFamily: 'DM Mono, monospace', fontWeight: 500,
              background: 'rgba(232,69,60,0.1)', color: '#E8453C',
              border: '1px solid rgba(232,69,60,0.25)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8453C', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              AI Virality Score · Powered by Claude
            </span>
          </motion.div>

          {/* Heading — NEVER changes color */}
          <motion.h1
            {...fadeUp(0.08)}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              marginBottom: 20,
            }}
          >
            <span style={{ color: '#EEECEA', display: 'block' }}>Will Your Content</span>
            <span style={{ color: '#E8453C', display: 'block' }}>Go Viral?</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} style={{ fontSize: 16, color: '#888796', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Upload your video or image and get a real-time AI virality score,
            hook analysis, caption rewrite, and hashtag strategy — in seconds.
          </motion.p>

          {/* Stats row */}
          <motion.div {...fadeUp(0.24)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '0 40px' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#E8453C', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#888796', marginTop: 4 }}>{s.label}</div>
                </div>
                {i < STATS.length - 1 && (
                  <div style={{ width: 1, height: 32, background: '#242428' }} />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 2rem 80px' }}>

        {/* ── UPLOAD CARD ──────────────────────────────── */}
        <motion.div {...fadeUp(0.3)} style={{
          background: '#111114',
          border: '1px solid #242428',
          borderRadius: 20,
          padding: '2rem',
          marginBottom: 24,
          boxShadow: '0 0 80px rgba(232,69,60,0.06)',
        }}>
          <UploadZone />

          {/* Caption */}
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.12em', color: '#4A4A58', marginBottom: 8, textTransform: 'uppercase' }}>
              Caption <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#4A4A58' }}>(optional)</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Paste your caption here to improve analysis accuracy..."
              rows={3}
              style={{
                width: '100%',
                background: '#0D0D10',
                border: '1px solid #242428',
                borderRadius: 12,
                color: '#EEECEA',
                fontSize: 14,
                padding: '14px 16px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#E8453C'}
              onBlur={e => e.target.style.borderColor = '#242428'}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  marginTop: 16, padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(232,69,60,0.08)', border: '1px solid rgba(232,69,60,0.2)',
                  color: '#E8453C', fontSize: 14,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <motion.button
            whileHover={file && !loading ? { scale: 1.015, boxShadow: '0 0 32px rgba(232,69,60,0.4)' } : {}}
            whileTap={file && !loading ? { scale: 0.985 } : {}}
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '16px 24px',
              borderRadius: 14,
              border: file && !loading ? 'none' : '1px solid #242428',
              background: file && !loading ? '#E8453C' : '#1A1A1E',
              color: file && !loading ? '#FFFFFF' : '#4A4A58',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              cursor: file && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: file && !loading ? '0 0 24px rgba(232,69,60,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                />
                Analyzing with Claude AI...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze {PLATFORM_ICONS[platform] || ''} Virality Score
                <ArrowRight size={17} />
              </>
            )}
          </motion.button>

          {!file && (
            <p style={{ textAlign: 'center', fontSize: 12, marginTop: 10, color: '#4A4A58' }}>
              Upload a file above to get started
            </p>
          )}
        </motion.div>

        {/* ── FEATURE CARDS ──────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 64 }}
          className="grid-cols-2 md:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.1 + i * 0.06)}
              whileHover={{ y: -3, background: '#18181C', borderColor: '#303038' }}
              style={{
                background: '#111114',
                border: '1px solid #242428',
                borderRadius: 16,
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'default',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: f.iconBg, color: f.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                {f.icon}
              </div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#EEECEA', marginBottom: 4 }}>
                {f.label}
              </p>
              <p style={{ fontSize: 13, color: '#888796' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── HOW IT WORKS ───────────────────────────── */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            textAlign: 'center', fontSize: 11, fontFamily: 'DM Mono, monospace',
            fontWeight: 600, letterSpacing: '0.15em', color: '#4A4A58',
            textTransform: 'uppercase', marginBottom: 32,
          }}>
            How It Works
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="grid-cols-1 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} style={{
                background: '#111114',
                border: '1px solid #242428',
                borderRadius: 16,
                padding: '1.5rem',
              }}>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontWeight: 800,
                  fontSize: '3rem', color: '#242428', lineHeight: 1, marginBottom: 12,
                }}>
                  {s.step}
                </div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#EEECEA', marginBottom: 8 }}>
                  {s.title}
                </p>
                <p style={{ fontSize: 13, color: '#888796', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* History */}
        {history?.length > 0 && <HistoryPanel />}
      </div>
    </motion.div>
  )
}
