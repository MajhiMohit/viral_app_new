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

const METRICS = [
  { key: 'hook',      label: 'Hook Strength',    icon: '🎣', scoreKey: 'hook_score',      insightKey: 'hook_insight',      fixIndex: 0 },
  { key: 'pacing',    label: 'Pacing & Rhythm',  icon: '⚡', scoreKey: 'pacing_score',    insightKey: 'pacing_insight',    fixIndex: 1 },
  { key: 'thumbnail', label: 'Thumbnail Appeal', icon: '🖼️', scoreKey: 'thumbnail_score', insightKey: 'thumbnail_insight', fixIndex: 2 },
  { key: 'caption',   label: 'Caption Power',    icon: '✍️', scoreKey: 'caption_score',   insightKey: 'caption_insight',   fixIndex: null },
]

const BTN = ({ icon, label, onClick, disabled, accent }) => (
  <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} disabled={disabled}
    style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 16px', borderRadius: 10, fontSize: 13, fontFamily: 'DM Mono, monospace',
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
      background: accent ? 'rgba(232,69,60,0.1)' : '#18181C',
      color: accent ? '#E8453C' : '#888796',
      border: accent ? '1px solid rgba(232,69,60,0.25)' : '1px solid #303038',
    }}>
    {icon} {label}
  </motion.button>
)

export default function Results() {
  const navigate = useNavigate()
  const { analysisData, previousData, loading, file, analyze, platform } = useAnalysisStore()

  useEffect(() => {
    if (!loading && !analysisData && !file) navigate('/')
  }, [loading, analysisData, file, navigate])

  const handleExportPDF = async () => {
    const el = document.getElementById('results-content')
    if (!el) return
    try {
      const canvas = await html2canvas(el, { scale: 1.5 })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 1.5, canvas.height / 1.5] })
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, canvas.width / 1.5, canvas.height / 1.5)
      pdf.save(`goviral-report-${Date.now()}.pdf`)
    } catch (e) { console.error('PDF export failed:', e) }
  }

  return (
    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: '#08080A' }}>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
            color: '#888796', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', transition: 'color 0.2s',
          }}>
            <ArrowLeft size={14} /> New Analysis
          </button>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {previousData && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#4A4A58', padding: '7px 14px', borderRadius: 10, background: '#18181C', border: '1px solid #303038' }}>
                Prev: <span style={{ color: '#888796' }}>{previousData.virality_score}</span>
                {(() => { const d = analysisData?.virality_score - previousData.virality_score; return d !== 0 ? <span style={{ color: d > 0 ? '#1DB87A' : '#E8453C' }}>{d > 0 ? `+${d}` : d}</span> : null })()}
              </span>
            )}
            <BTN icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />} label="Re-analyze" onClick={() => analyze(true)} disabled={loading} />
            <BTN icon={<Wand2 size={13} />} label="Fix It For Me" onClick={() => analyze(true)} disabled={loading} accent />
            <BTN icon={<Download size={13} />} label="Export PDF" onClick={handleExportPDF} />
          </div>
        </div>

        {/* Platform badge */}
        {analysisData && (
          <div style={{ marginBottom: 20 }}>
            <span style={{ padding: '4px 14px', borderRadius: 999, fontSize: 11, fontFamily: 'DM Mono, monospace', background: '#18181C', color: '#888796', border: '1px solid #303038' }}>
              {platform}
            </span>
          </div>
        )}

        {loading && <ResultsSkeleton />}

        {!loading && analysisData && (
          <div id="results-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ScoreHero data={analysisData} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {METRICS.map((m, i) => (
                <MetricCard key={m.key} label={m.label} icon={m.icon}
                  score={analysisData[m.scoreKey]} insight={analysisData[m.insightKey]}
                  fix={m.fixIndex !== null ? analysisData.fixes?.[m.fixIndex] : null}
                  delay={i * 0.07} />
              ))}
            </div>

            <HookAnalysis data={analysisData} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <CaptionOptimizer data={analysisData} />
              <HashtagPanel data={analysisData} />
            </div>

            <AudioSuggestions data={analysisData} />
            <CompetitorChart data={analysisData} />

            {/* CTA footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ borderRadius: 20, padding: '2.5rem', textAlign: 'center', background: 'rgba(232,69,60,0.05)', border: '1px solid rgba(232,69,60,0.15)' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: '#EEECEA', marginBottom: 8 }}>
                Ready to go viral? 🚀
              </p>
              <p style={{ fontSize: 14, color: '#888796', marginBottom: 24 }}>
                Apply these changes and re-analyze to track your improvement.
              </p>
              <button onClick={() => navigate('/')} style={{
                padding: '12px 28px', borderRadius: 12, background: '#E8453C',
                color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: '0 0 24px rgba(232,69,60,0.3)',
              }}>
                Analyze Another Post
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
