/**
 * Reads an uploaded image file and optimizes its dimensions for browser draft
 * storage and fast offline HTML export. Falls back to raw DataURL if needed.
 */
export function processUploadedImage(file, { maxWidth = 800, maxHeight = 800, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose a valid image file (JPEG, PNG, or WebP).'))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Image file must be under 10 MB.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      // SVG or very small files (< 120 KB) can be kept as-is
      if (file.type === 'image/svg+xml' || file.size < 120 * 1024) {
        resolve(dataUrl)
        return
      }

      const img = new Image()
      img.onerror = () => resolve(dataUrl)
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(dataUrl)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const out = canvas.toDataURL(mime, quality)
        // Only use re-encoded output if it's actually smaller
        resolve(out.length < dataUrl.length ? out : dataUrl)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}
