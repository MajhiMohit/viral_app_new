/**
 * Convert a File to base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Extract a frame from a video file at a given time (seconds)
 * Returns { base64, mediaType: 'image/jpeg' }
 */
export function extractVideoFrame(file, timeSeconds = 0) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    video.src = url
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    video.addEventListener('loadedmetadata', () => {
      // Clamp time to video duration
      const clampedTime = Math.min(timeSeconds, video.duration - 0.1)
      video.currentTime = clampedTime
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataURL = canvas.toDataURL('image/jpeg', 0.85)
      const base64 = dataURL.split(',')[1]
      URL.revokeObjectURL(url)
      resolve({ base64, mediaType: 'image/jpeg', dataURL })
    })

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video for frame extraction'))
    })

    video.load()
  })
}

/**
 * Extract multiple frames from video at given timestamps
 */
export async function extractVideoFrames(file, timestamps = [0, 1, 3]) {
  const frames = []
  for (const t of timestamps) {
    try {
      const frame = await extractVideoFrame(file, t)
      frames.push({ time: t, ...frame })
    } catch {
      // skip failed frames
    }
  }
  return frames
}

/**
 * Get MIME type for Claude API
 */
export function getMediaType(file) {
  const map = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/webp': 'image/webp',
    'image/gif': 'image/gif',
  }
  return map[file.type] || 'image/jpeg'
}

/**
 * Create object URL for preview
 */
export function createPreviewURL(file) {
  return URL.createObjectURL(file)
}
