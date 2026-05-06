import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, AlertCircle, Play, ImageIcon, Zap, TrendingUp, Hash, Mic2 } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import HistoryPanel from '../components/HistoryPanel'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORM_ICONS = { TikTok: '🎵', Instagram: '📸', 'YouTube Shorts': '▶️', X: '𝕏' }

const FEATURES = [
  { icon: <Zap size={18} />, label: 'Virality Score', desc: 'AI-powered 0–100 rating', color: 'var(--accent)' },
  { icon: <Play size={18} />, label: 'Hook Analysis', desc: 'First 3-second scoring', color: 'var(--blue)' },
  { icon: <Hash size={18} />, label: 'Hashtag Strategy', desc: '12–15 targeted tags', color: 'var(--green)' },
  { icon: <Mic2 size={18} />, label: 'Audio Trends', desc: 'Matched sound suggestions', color: 'var(--amber)' },
]

const STATS = [
  { value: '50K+', label: 'Creators analyzed' },
  { value: '+34%', label: 'Avg score boost' },
  { value: '12K', label: 'Viral posts found' },
]

/* Staggered container */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

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
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="max-w-[960px] mx-auto px-4 py-14"
    >
      {/* ──────────────────────────────────
          HERO
      ────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center mb-16"
      >
        <motion.div variants={item} className="flex justify-center mb-6">
          <Badge variant="primary" size="md" dot pulse>
            AI Virality Score · Powered by Claude
          </Badge>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-[clamp(2.4rem,6vw,4.2rem)] font-black leading-[1.04] tracking-tight mb-5"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
        >
          Will Your Content
          <br />
          <span className="gradient-text">Go Viral?</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg max-w-md mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Upload your video or image and get a real-time AI virality score,
          hook analysis, caption rewrite, and hashtag strategy — in seconds.
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-10 mt-10"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}
              >
                {s.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ──────────────────────────────────
          UPLOAD CARD
      ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card elevated padding="p-8" className="mb-6" hover={false}>
          {/* Upload zone */}
          <div className="mb-6">
            <UploadZone />
          </div>

          {/* Caption */}
          <div className="mb-6">
            <Input
              label="Caption"
              placeholder="Paste your caption here to improve analysis accuracy..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              textarea
              rows={3}
              hint="Optional — helps Claude generate better hashtags and caption rewrites"
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 flex items-start gap-3 p-4 rounded-xl text-sm"
                style={{
                  background: 'rgba(226,75,74,0.08)',
                  border: '1px solid rgba(226,75,74,0.2)',
                  color: 'var(--red)',
                }}
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!file}
            loading={loading}
            icon={!loading && <Sparkles size={17} />}
            iconRight={!loading && <ArrowRight size={16} />}
            onClick={handleAnalyze}
          >
            {loading
              ? 'Analyzing with Claude AI...'
              : `Analyze ${PLATFORM_ICONS[platform] || ''} Virality Score`}
          </Button>

          {!file && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs mt-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Upload a video or image above to get started
            </motion.p>
          )}
        </Card>
      </motion.div>

      {/* ──────────────────────────────────
          FEATURE GRID
      ────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {FEATURES.map((f, i) => (
          <motion.div key={i} variants={item}>
            <Card padding="p-5" className="text-center h-full">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${f.color}15`, color: f.color }}
              >
                {f.icon}
              </div>
              <p
                className="text-sm font-bold mb-1"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
              >
                {f.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ──────────────────────────────────
          HOW IT WORKS
      ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest text-center mb-8"
          style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
        >
          How It Works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Upload Content', desc: 'Drop a video (MP4/MOV) or image (JPG/PNG/WEBP) up to 50MB' },
            { step: '02', title: 'AI Analysis', desc: 'Claude analyzes hook, pacing, thumbnail, caption, and trend alignment' },
            { step: '03', title: 'Get Your Score', desc: 'Receive a 0–100 virality score with specific, actionable fixes' },
          ].map((s, i) => (
            <Card key={i} padding="p-5" hover={false}>
              <span
                className="text-3xl font-black block mb-3"
                style={{ fontFamily: 'DM Mono, monospace', color: 'var(--border-strong)' }}
              >
                {s.step}
              </span>
              <p className="font-bold text-sm mb-1.5" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                {s.title}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* History */}
      {history?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <HistoryPanel />
        </motion.div>
      )}
    </motion.div>
  )
}
