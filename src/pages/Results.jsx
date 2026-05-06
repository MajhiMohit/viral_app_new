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
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const METRIC_CARDS = [
  { key: 'hook',      label: 'Hook Strength',    icon: '🎣', scoreKey: 'hook_score',      insightKey: 'hook_insight',      fixIndex: 0 },
  { key: 'pacing',    label: 'Pacing & Rhythm',  icon: '⚡', scoreKey: 'pacing_score',    insightKey: 'pacing_insight',    fixIndex: 1 },
  { key: 'thumbnail', label: 'Thumbnail Appeal', icon: '🖼️', scoreKey: 'thumbnail_score', insightKey: 'thumbnail_insight', fixIndex: 2 },
  { key: 'caption',   label: 'Caption Power',    icon: '✍️', scoreKey: 'caption_score',   insightKey: 'caption_insight',   fixIndex: null },
]

function ScoreDiff({ current, previous }) {
  if (!previous) return null
  const diff = current - previous
  if (diff === 0) return null
  return (
    <Badge variant={diff > 0 ? 'success' : 'danger'} size="sm">
      {diff > 0 ? `+${diff}` : diff} vs prev
    </Badge>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { analysisData, previousData, loading, file, analyze, platform } = useAnalysisStore()

  useEffect(() => {
    if (!loading && !analysisData && !file) navigate('/')
  }, [loading, analysisData, file, navigate])

  const handleReanalyze = () => analyze(true)
  const handleFixItForMe = () => analyze(true)

  const handleExportPDF = async () => {
    const el = document.getElementById('results-content')
    if (!el) return
    try {
      const canvas = await html2canvas(el, { scale: 1.5 })
      const img = canvas.toDataURL('image/jpeg', 0.85)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 1.5, canvas.height / 1.5] })
      pdf.addImage(img, 'JPEG', 0, 0, canvas.width / 1.5, canvas.height / 1.5)
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
      transition={{ duration: 0.3 }}
      className="max-w-[960px] mx-auto px-4 py-8"
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={14} />}
          onClick={() => navigate('/')}
        >
          New Analysis
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
            disabled={loading}
            onClick={handleReanalyze}
          >
            Re-analyze
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Wand2 size={13} />}
            disabled={loading}
            onClick={handleFixItForMe}
          >
            Fix It For Me
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={13} />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* ── Skeleton ── */}
      {loading && <ResultsSkeleton />}

      {/* ── Results ── */}
      {!loading && analysisData && (
        <div id="results-content" className="space-y-6">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="default" size="sm">{platform}</Badge>
            {previousData && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Previous:&nbsp;
                <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text-secondary)' }}>
                  {previousData.virality_score}
                </span>
              </span>
            )}
            <ScoreDiff current={analysisData.virality_score} previous={previousData?.virality_score} />
          </div>

          <ScoreHero data={analysisData} />

          {/* 4 metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRIC_CARDS.map((card, i) => (
              <MetricCard
                key={card.key}
                label={card.label}
                icon={card.icon}
                score={analysisData[card.scoreKey]}
                insight={analysisData[card.insightKey]}
                fix={card.fixIndex !== null ? analysisData.fixes?.[card.fixIndex] : null}
                delay={i * 0.07}
              />
            ))}
          </div>

          <HookAnalysis data={analysisData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaptionOptimizer data={analysisData} />
            <HashtagPanel data={analysisData} />
          </div>

          <AudioSuggestions data={analysisData} />
          <CompetitorChart data={analysisData} />

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--accent-subtle) 0%, transparent 100%)',
              border: '1px solid var(--accent-border)',
            }}
          >
            <p
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
            >
              Ready to go viral? 🚀
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Apply these changes and re-analyze to track your improvement.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
            >
              Analyze Another Post
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
