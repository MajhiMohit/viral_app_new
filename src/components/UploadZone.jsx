import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Film, Image, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAnalysisStore } from '../hooks/useViralityAnalysis'
import { extractVideoFrames, createPreviewURL } from '../lib/imageUtils'

const ACCEPTED = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
}

const VIDEO_MAX = 50 * 1024 * 1024  // 50MB
const IMAGE_MAX = 10 * 1024 * 1024  // 10MB

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
    if (!Object.keys(ACCEPTED).includes(f.type)) return 'Unsupported format.'
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

  const onInputChange = (e) => {
    const f = e.target.files[0]
    if (f) processFile(f)
  }

  const removeFile = () => {
    setFile(null)
    setPreviewURL(null)
    setVideoFrames([])
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isVideo = file?.type?.startsWith('video/')

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl p-12 flex flex-col items-center justify-center gap-5 transition-all duration-300 upload-pulse"
            style={{
              border: `2px dashed ${dragging ? '#E24B4A' : 'rgba(226,75,74,0.3)'}`,
              background: dragging
                ? 'rgba(226,75,74,0.05)'
                : 'linear-gradient(135deg, rgba(20,20,22,0.9) 0%, rgba(28,28,31,0.9) 100%)',
              minHeight: 280,
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".mp4,.mov,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={onInputChange}
            />
            <motion.div
              animate={{ scale: dragging ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(226,75,74,0.12)', border: '1px solid rgba(226,75,74,0.2)' }}
            >
              <Upload size={32} color="#E24B4A" />
            </motion.div>

            <div className="text-center">
              <p className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#F0F0F2' }}>
                {dragging ? 'Drop to analyze' : 'Upload your content'}
              </p>
              <p style={{ color: '#9090A0', fontSize: 14 }}>
                Drag & drop or click to browse
              </p>
              <p className="mt-1" style={{ color: '#606070', fontSize: 12 }}>
                MP4 · MOV · JPG · PNG · WEBP &nbsp;·&nbsp; Max 50MB video / 10MB image
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(55,138,221,0.1)', color: '#378ADD', border: '1px solid rgba(55,138,221,0.2)' }}>
                <Film size={12} /> Video
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75', border: '1px solid rgba(29,158,117,0.2)' }}>
                <Image size={12} /> Image
              </div>
            </div>

            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(226,75,74,0.1)', color: '#E24B4A', border: '1px solid rgba(226,75,74,0.2)' }}
              >
                <AlertCircle size={14} />
                {validationError}
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
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#141416' }}
          >
            {/* Progress bar */}
            {processing && (
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#2A2A2E' }}>
                <motion.div
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg, #E24B4A, #FF8C7A)', width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={removeFile}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(10,10,11,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <X size={14} color="#F0F0F2" />
            </button>

            {/* Preview */}
            {isVideo ? (
              <video
                src={previewURL}
                controls
                className="w-full"
                style={{ maxHeight: 360, background: '#000', display: 'block' }}
              />
            ) : (
              <img
                src={previewURL}
                alt="Preview"
                className="w-full object-contain"
                style={{ maxHeight: 360, background: '#000', display: 'block' }}
              />
            )}

            {/* File info */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: isVideo ? 'rgba(55,138,221,0.12)' : 'rgba(29,158,117,0.12)' }}>
                  {isVideo ? <Film size={16} color="#378ADD" /> : <Image size={16} color="#1D9E75" />}
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: '#F0F0F2' }}>
                    {file.name}
                  </p>
                  <p className="text-xs" style={{ color: '#9090A0' }}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB · {isVideo ? 'Video' : 'Image'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#1D9E75' }}>
                <CheckCircle2 size={13} />
                Ready
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
