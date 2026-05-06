import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Film, ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'
import { extractVideoFrames, createPreviewURL } from '../lib/imageUtils'

const VIDEO_MAX = 50 * 1024 * 1024
const IMAGE_MAX = 10 * 1024 * 1024

export default function UploadZone() {
  const { setFile, setPreviewURL, setVideoFrames, file, previewURL } = useAnalysisStore()
  const [dragging, setDragging] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef()

  const validateFile = (f) => {
    const isVideo = f.type.startsWith('video/')
    const isImage = f.type.startsWith('image/')
    if (!isVideo && !isImage) return 'Unsupported file type. Use MP4, MOV, JPG, PNG, or WEBP.'
    if (isVideo && f.size > VIDEO_MAX) return 'Video must be under 50MB.'
    if (isImage && f.size > IMAGE_MAX) return 'Image must be under 10MB.'
    return null
  }

  const processFile = useCallback(async (f) => {
    const err = validateFile(f)
    if (err) { setValidationError(err); return }
    setValidationError(null)
    setProcessing(true)
    setProgress(20)
    const url = createPreviewURL(f)
    setPreviewURL(url)
    setProgress(50)
    if (f.type.startsWith('video/')) {
      const frames = await extractVideoFrames(f, [0, 1, 3])
      setVideoFrames(frames)
    }
    setProgress(100)
    setFile(f)
    setTimeout(() => setProcessing(false), 400)
  }, [setFile, setPreviewURL, setVideoFrames])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const removeFile = () => {
    setFile(null); setPreviewURL(null); setVideoFrames([]); setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isVideo = file?.type?.startsWith('video/')

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl p-10 flex flex-col items-center justify-center gap-5 transition-all duration-300 upload-pulse"
            style={{
              border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--accent-border)'}`,
              background: dragging ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
              minHeight: 260,
            }}
          >
            <input ref={inputRef} type="file" accept=".mp4,.mov,.jpg,.jpeg,.png,.webp"
              className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f) }} />

            <motion.div
              animate={{ scale: dragging ? 1.12 : 1, rotate: dragging ? 8 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}
            >
              <Upload size={26} color="var(--accent)" />
            </motion.div>

            <div className="text-center">
              <p className="text-lg font-bold mb-1.5"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                {dragging ? 'Drop to analyze' : 'Upload your content'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Drag & drop or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                MP4 · MOV · JPG · PNG · WEBP &nbsp;·&nbsp; Max 50MB video / 10MB image
              </p>
            </div>

            <div className="flex items-center gap-3">
              {[
                { icon: <Film size={12} />, label: 'Video', color: 'var(--blue)' },
                { icon: <ImageIcon size={12} />, label: 'Image', color: 'var(--green)' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: `${t.color}12`, color: t.color, border: `1px solid ${t.color}25` }}>
                  {t.icon} {t.label}
                </div>
              ))}
            </div>

            {validationError && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(226,75,74,0.08)', color: 'var(--red)', border: '1px solid var(--accent-border)' }}>
                <AlertCircle size={14} /> {validationError}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="rounded-2xl overflow-hidden relative"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
          >
            {processing && (
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'var(--border)' }}>
                <motion.div className="h-full"
                  style={{ background: 'linear-gradient(90deg, var(--accent-hover), var(--accent))', width: `${progress}%` }}
                  transition={{ duration: 0.3 }} />
              </div>
            )}
            <button onClick={removeFile}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <X size={13} color="#fff" />
            </button>
            {isVideo
              ? <video src={previewURL} controls className="w-full" style={{ maxHeight: 340, background: '#000', display: 'block' }} />
              : <img src={previewURL} alt="Preview" className="w-full object-contain" style={{ maxHeight: 340, background: 'var(--bg-base)', display: 'block' }} />
            }
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: isVideo ? 'rgba(55,138,221,0.1)' : 'rgba(29,158,117,0.1)' }}>
                  {isVideo ? <Film size={15} color="var(--blue)" /> : <ImageIcon size={15} color="var(--green)" />}
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB · {isVideo ? 'Video' : 'Image'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--green)' }}>
                <CheckCircle2 size={13} /> Ready
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
