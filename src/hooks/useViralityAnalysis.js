import { create } from 'zustand'
import { analyzeContent } from '../lib/claude'
import { fileToBase64, extractVideoFrame, getMediaType } from '../lib/imageUtils'

// History helpers
const HISTORY_KEY = 'goviral_history'
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
function saveHistory(history) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)) } catch {}
}

export const useAnalysisStore = create((set, get) => ({
  // State
  analysisData: null,
  previousData: null,
  loading: false,
  error: null,
  file: null,
  caption: '',
  platform: 'TikTok',
  previewURL: null,
  videoFrames: [],
  history: loadHistory(),

  // Actions
  setFile: (file) => set({ file }),
  setCaption: (caption) => set({ caption }),
  setPlatform: (platform) => set({ platform }),
  setPreviewURL: (url) => set({ previewURL: url }),
  setVideoFrames: (frames) => set({ videoFrames: frames }),
  clearError: () => set({ error: null }),
  setPreviousData: (data) => set({ previousData: data }),

  analyze: async (isRewrite = false) => {
    const { file, caption, platform, analysisData } = get()
    if (!file) return

    set({ loading: true, error: null })
    if (isRewrite && analysisData) {
      set({ previousData: analysisData })
    }

    try {
      let base64Image, mediaType

      const isVideo = file.type.startsWith('video/')

      if (isVideo) {
        const frame = await extractVideoFrame(file, 0)
        base64Image = frame.base64
        mediaType = 'image/jpeg'
      } else {
        base64Image = await fileToBase64(file)
        mediaType = getMediaType(file)
      }

      const result = await analyzeContent({
        base64Image,
        mediaType,
        caption,
        platform,
        isRewrite,
      })

      set({ analysisData: result, loading: false })

      // Save to history
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        platform,
        fileName: file.name,
        virality_score: result.virality_score,
        hook_score: result.hook_score,
        thumbnail_score: result.thumbnail_score,
      }
      const history = [newEntry, ...loadHistory()].slice(0, 5)
      saveHistory(history)
      set({ history })
    } catch (err) {
      set({
        error: err.message || 'Analysis failed. Please check your API key and try again.',
        loading: false,
      })
    }
  },

  reset: () => set({
    analysisData: null,
    previousData: null,
    file: null,
    caption: '',
    previewURL: null,
    videoFrames: [],
    error: null,
  }),
}))
