import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import HistoryPanel from '../components/HistoryPanel'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'

const PLATFORM_ICONS = {
  TikTok: '🎵',
  Instagram: '📸',
  'YouTube Shorts': '▶️',
  X: '𝕏',
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="max-w-[960px] mx-auto px-4 py-12"
    >
      {/* Hero Text */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
          style={{
            background: 'rgba(226,75,74,0.1)',
            border: '1px solid rgba(226,75,74,0.25)',
            color: '#E24B4A',
            fontFamily: 'DM Mono, monospace',
          }}
        >
          <Zap size={13} fill="#E24B4A" />
          AI Virality Score · Powered by Claude
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl font-black leading-[1.05] mb-4"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Will Your Content
          <br />
          <span className="gradient-text">Go Viral?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg max-w-xl mx-auto"
          style={{ color: '#9090A0' }}
        >
          Upload your video or image. Get a real-time AI virality score,
          hook analysis, caption rewrite, and hashtag strategy — in seconds.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-8 mt-8"
        >
          {[
            { label: 'Creators analyzed', value: '50K+' },
            { label: 'Avg score boost', value: '+34%' },
            { label: 'Viral posts found', value: '12K' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold" style={{ fontFamily: 'DM Mono, monospace', color: '#E24B4A' }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: '#606070' }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl p-6 sm:p-8 mb-6"
        style={{
          background: '#141416',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Upload Zone */}
        <div className="mb-6">
          <UploadZone />
        </div>

        {/* Caption input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: '#606070', fontFamily: 'DM Mono, monospace' }}>
            Caption (optional — improves analysis)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Paste your caption here..."
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
            style={{
              background: '#1C1C1F',
              border: '1px solid #2A2A2E',
              color: '#F0F0F2',
              fontFamily: 'Inter, sans-serif',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#E24B4A')}
            onBlur={(e) => (e.target.style.borderColor = '#2A2A2E')}
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
              style={{ background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.2)', color: '#E24B4A' }}
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze button */}
        <motion.button
          whileHover={{ scale: file && !loading ? 1.02 : 1 }}
          whileTap={{ scale: file && !loading ? 0.98 : 1 }}
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300"
          style={{
            background: !file || loading
              ? '#1C1C1F'
              : 'linear-gradient(135deg, #C73B3A 0%, #E24B4A 50%, #FF6B6A 100%)',
            color: !file || loading ? '#606070' : '#fff',
            cursor: !file || loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Syne, sans-serif',
            boxShadow: file && !loading ? '0 8px 32px rgba(226,75,74,0.3)' : 'none',
          }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 rounded-full border-2"
                style={{ borderColor: '#9090A0', borderTopColor: '#F0F0F2' }}
              />
              Analyzing with Claude AI...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze {PLATFORM_ICONS[platform]} Virality Score
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>

        {!file && (
          <p className="text-center text-xs mt-3" style={{ color: '#606070' }}>
            Upload a file above to get started
          </p>
        )}
      </motion.div>

      {/* Features grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
      >
        {[
          { icon: '🎣', label: 'Hook Score', desc: 'First 3-second analysis' },
          { icon: '✍️', label: 'Caption AI', desc: 'Rewrite + optimization' },
          { icon: '#', label: 'Hashtags', desc: '12-15 targeted tags' },
          { icon: '📊', label: 'Benchmark', desc: 'vs top 1% creators' },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.05 }}
            className="p-4 rounded-2xl text-center"
            style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
              {f.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#606070' }}>{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* History */}
      {history?.length > 0 && <HistoryPanel />}
    </motion.div>
  )
}
