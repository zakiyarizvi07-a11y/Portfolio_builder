// Built-in offline SVG banners encoded as data URIs (zero external requests)

function toSvgDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`
}

export const BANNER_PRESETS = [
  {
    id: 'waves',
    name: 'Ocean Waves',
    src: toSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#312e81"/>
            <stop offset="50%" stop-color="#4f46e5"/>
            <stop offset="100%" stop-color="#7c3aed"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#g1)"/>
        <path d="M0 280 Q 300 200 600 260 T 1200 220 L 1200 400 L 0 400 Z" fill="rgba(255,255,255,0.08)"/>
        <path d="M0 320 Q 350 250 700 310 T 1200 280 L 1200 400 L 0 400 Z" fill="rgba(255,255,255,0.1)"/>
        <circle cx="960" cy="90" r="140" fill="rgba(255,255,255,0.06)"/>
      </svg>
    `),
  },
  {
    id: 'horizon',
    name: 'Emerald Horizon',
    src: toSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="55%" stop-color="#0d9488"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#g2)"/>
        <circle cx="220" cy="110" r="180" fill="rgba(255,255,255,0.07)"/>
        <circle cx="980" cy="300" r="220" fill="rgba(255,255,255,0.06)"/>
        <path d="M0 340 L 420 220 L 820 310 L 1200 180 L 1200 400 L 0 400 Z" fill="rgba(0,0,0,0.12)"/>
      </svg>
    `),
  },
  {
    id: 'grid',
    name: 'Minimal Grid',
    src: toSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <pattern id="gridPat" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="1200" height="400" fill="url(#g3)"/>
        <rect width="1200" height="400" fill="url(#gridPat)"/>
        <circle cx="600" cy="200" r="260" fill="rgba(99,102,241,0.18)"/>
      </svg>
    `),
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    src: toSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#be123c"/>
            <stop offset="50%" stop-color="#e11d48"/>
            <stop offset="100%" stop-color="#f97316"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#g4)"/>
        <circle cx="880" cy="140" r="110" fill="rgba(255,255,255,0.14)"/>
        <path d="M0 300 Q 450 220 900 290 T 1200 260 L 1200 400 L 0 400 Z" fill="rgba(0,0,0,0.12)"/>
        <path d="M0 350 Q 500 280 1200 330 L 1200 400 L 0 400 Z" fill="rgba(0,0,0,0.15)"/>
      </svg>
    `),
  },
  {
    id: 'dots',
    name: 'Studio Dots',
    src: toSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
          <pattern id="dotPat" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="2" fill="rgba(255,255,255,0.18)"/>
          </pattern>
        </defs>
        <rect width="1200" height="400" fill="url(#g5)"/>
        <rect width="1200" height="400" fill="url(#dotPat)"/>
        <ellipse cx="300" cy="80" rx="340" ry="180" fill="rgba(167,139,250,0.18)"/>
        <ellipse cx="950" cy="340" rx="320" ry="160" fill="rgba(56,189,248,0.14)"/>
      </svg>
    `),
  },
]

export function getBannerSrc(banner) {
  if (!banner || banner.type === 'none') return ''
  if (banner.type === 'upload') return banner.customImage || ''
  const preset = BANNER_PRESETS.find(b => b.id === banner.presetId) || BANNER_PRESETS[0]
  return preset.src
}
