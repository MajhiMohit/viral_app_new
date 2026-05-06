import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Download, Wand2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import { useAnalysisStore } from '../hooks/useViralityAnalysis'
import ScoreHero from '../components/ScoreHero'
import MetricCard from '../components/MetricCard'
import HookAnalysis from '../components/HookAnalysis'
import CaptionOptimizer from '../components/CaptionOptimizer'
import HashtagPanel from '../components/HashtagPanel'
import AudioSuggestions from '../components/AudioSuggestions'
import CompetitorChart from '../components/CompetitorChart'
import ResultsSkeleton from '../components/ResultsSkeleton'

const METRIC_CARDS = [
  {
    key: 'hook',
    label: 'Hook Strength',
    icon: '🎣',
    scoreKey: 'hook_score',
    insightKey: 'hook_insight',
    fixKey: 'fixes',
    fixIndex: 0,
  },
  {
    key: 'pacing',
    label: 'Pacing & Rhythm',
    icon: '⚡',
    scoreKey: 'pacing_score',
    insightKey: 'pacing_insight',
    fixKey: 'fixes',
    fixIndex: 1,
  },
  {
    key: 'thumbnail',
    label: 'Thumbnail Appeal',
    icon: '🖼️',
    scoreKey: 'thumbnail_score',
    insightKey: 'thumbnail_insight',
    fixKey: 'fixes',
    fixIndex: 2,
  },
  {
    key: 'caption',
    label: 'Caption Power',
    icon: '✍️',
    scoreKey: 'caption_score',
    insightKey: 'caption_insight',
    fixKey: null,
    fixIndex: null,
  },
]

function ScoreDiff({ current, previous, label }) {
  if (!previous) return null
  const diff = current - previous
  if (diff === 0) return null
  const isUp = diff > 0
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full ml-2"
      style={{
        background: isUp ? 'rgba(29,158,117,0.12)' : 'rgba(226,75,74,0.12)',
        color: isUp ? '#1D9E75' : '#E24B4A',
        fontFamily: 'DM Mono, monospace',
      }}
    >
      {isUp ? `+${diff}` : diff} vs prev
    </span>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { analysisData, previousData, loading, file, analyze, platform } = useAnalysisStore()

  // Redirect if no data and not loading
  useEffect(() => {
    if (!loading && !analysisData && !file) {
      navigate('/')
    }
  }, [loading, analysisData, file, navigate])

  const handleReanalyze = async () => {
    await analyze(true)
  }

  const handleFixItForMe = async () => {
    await analyze(true)
  }

  const handleExportPDF = async () => {
    const el = document.getElementById('results-content')
    if (!el) return
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#0A0A0B', scale: 1.5 })
      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 1.5, canvas.height / 1.5] })
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 1.5, canvas.height / 1.5)
      pdf.save(`goviral-report-${Date.now()}.pdf`)
    } catch (e) {
      console.error('PDF export failed:', e)
    }
  }

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="max-w-[960px] mx-auto px-4 py-8"
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm transition-all duration-200"
          style={{ color: '#9090A0' }}
          onMouseEnter={e => e.currentTarget.style.color = '#F0F0F2'}
          onMouseLeave={e => e.currentTarget.style.color = '#9090A0'}
        >
          <ArrowLeft size={15} />
          New Analysis
        </button>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReanalyze}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: '#1C1C1F',
              color: '#9090A0',
              border: '1px solid #2A2A2E',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Re-analyze
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFixItForMe}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'rgba(226,75,74,0.1)',
              color: '#E24B4A',
              border: '1px solid rgba(226,75,74,0.25)',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <Wand2 size={13} />
            Fix It For Me
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#1C1C1F', color: '#9090A0', border: '1px solid #2A2A2E' }}
          >
            <Download size={13} />
            Export PDF
          </motion.button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && <ResultsSkeleton />}

      {/* Results */}
      {!loading && analysisData && (
        <div id="results-content" className="space-y-6">
          {/* Platform + diff header */}
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: '#1C1C1F', color: '#9090A0', border: '1px solid #2A2A2E', fontFamily: 'DM Mono, monospace' }}>
              {platform}
            </span>
            {previousData && (
              <span className="text-xs" style={{ color: '#606070' }}>
                Previous score: <span style={{ fontFamily: 'DM Mono, monospace', color: '#9090A0' }}>{previousData.virality_score}</span>
                <ScoreDiff current={analysisData.virality_score} previous={previousData?.virality_score} />
              </span>
            )}
          </div>

          {/* Score Hero */}
          <ScoreHero data={analysisData} />

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRIC_CARDS.map((card, i) => (
              <MetricCard
                key={card.key}
                label={card.label}
                icon={card.icon}
                score={analysisData[card.scoreKey]}
                insight={analysisData[card.insightKey]}
                fix={card.fixKey && analysisData[card.fixKey]?.[card.fixIndex]}
                delay={i * 0.07}
              />
            ))}
          </div>

          {/* Hook Analysis */}
          <HookAnalysis data={analysisData} />

          {/* Caption + Hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaptionOptimizer data={analysisData} />
            <HashtagPanel data={analysisData} />
          </div>

          {/* Audio Suggestions */}
          <AudioSuggestions data={analysisData} />

          {/* Competitor Chart */}
          <CompetitorChart data={analysisData} />

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(226,75,74,0.08) 0%, rgba(226,75,74,0.03) 100%)', border: '1px solid rgba(226,75,74,0.15)' }}
          >
            <p className="text-lg font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
              Ready to go viral? 🚀
            </p>
            <p className="text-sm mb-4" style={{ color: '#9090A0' }}>
              Apply these changes and re-analyze to track your improvement score.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#E24B4A', color: '#fff' }}
            >
              Analyze Another Post
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
