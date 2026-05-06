import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Film, ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'
import { extractVideoFrames, createPreviewURL } from '../lib/imageUtils'

const VIDEO_MAX = 50 * 1024 * 1024
const IMAGE_MAX = 10 * 1024 * 1024

const FILE_TYPES = ['MP4', 'MOV', 'JPG', 'PNG', 'WEBP']

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
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const removeFile = () => {
    setFile(null); setPreviewURL(null); setVideoFrames([]); setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isVideo = file?.type?.startsWith('video/')

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="upload-pulse"
            style={{
              background: dragging ? 'rgba(232,69,60,0.04)' : '#0D0D10',
              border: `1.5px dashed ${dragging ? '#E8453C' : '#E8453C'}`,
              borderRadius: 14,
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              transition: 'all 0.2s ease',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".mp4,.mov,.jpg,.jpeg,.png,.webp"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f) }}
            />

            {/* Upload Icon */}
            <motion.div
              animate={{ scale: dragging ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: 56, height: 56, borderRadius: 12,
                background: '#E8453C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Upload size={24} color="white" />
            </motion.div>

            <div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#EEECEA', marginBottom: 6 }}>
                {dragging ? 'Drop to analyze' : 'Upload your content'}
              </p>
              <p style={{ fontSize: 14, color: '#888796' }}>Drag & drop or click to browse</p>
            </div>

            {/* File type pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {FILE_TYPES.map((t) => (
                <span key={t} style={{
                  padding: '4px 12px', borderRadius: 999,
                  fontSize: 11, fontFamily: 'DM Mono, monospace',
                  background: '#18181C', border: '1px solid #303038', color: '#4A4A58',
                }}>
                  {t}
                </span>
              ))}
              <span style={{
                padding: '4px 12px', borderRadius: 999,
                fontSize: 11, fontFamily: 'DM Mono, monospace',
                background: '#18181C', border: '1px solid #303038', color: '#4A4A58',
              }}>
                Max 50MB
              </span>
            </div>

            {validationError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10,
                background: 'rgba(232,69,60,0.08)', border: '1px solid rgba(232,69,60,0.2)',
                color: '#E8453C', fontSize: 13,
              }}>
                <AlertCircle size={13} /> {validationError}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              position: 'relative',
              background: '#0D0D10',
              border: '1px solid #242428',
            }}
          >
            {/* Progress bar */}
            {processing && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#242428' }}>
                <div style={{
                  height: '100%', background: '#E8453C',
                  width: `${progress}%`, transition: 'width 0.3s ease',
                }} />
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={removeFile}
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <X size={13} color="#EEECEA" />
            </button>

            {isVideo
              ? <video src={previewURL} controls style={{ width: '100%', maxHeight: 320, display: 'block', background: '#000' }} />
              : <img src={previewURL} alt="Preview" style={{ width: '100%', objectFit: 'contain', maxHeight: 320, display: 'block', background: '#0D0D10' }} />
            }

            <div style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', background: '#111114',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: isVideo ? 'rgba(61,142,232,0.1)' : 'rgba(29,184,122,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isVideo
                    ? <Film size={16} color="#3D8EE8" />
                    : <ImageIcon size={16} color="#1DB87A" />
                  }
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#EEECEA', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#4A4A58', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB · {isVideo ? 'Video' : 'Image'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1DB87A' }}>
                <CheckCircle2 size={13} /> Ready
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
