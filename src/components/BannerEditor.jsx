import { useRef, useState } from 'react'
import { BANNER_PRESETS, getBannerSrc } from '../utils/banners.js'
import { processUploadedImage } from '../utils/imageHelpers.js'
import './BannerEditor.css'

export default function BannerEditor({ banner, onChange }) {
  const fileRef = useRef(null)
  const [error, setError] = useState('')

  const update = (patch) => onChange({ ...banner, ...patch })
  const bannerSrc = getBannerSrc(banner)
  const isActive = banner?.type !== 'none' && Boolean(bannerSrc)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    try {
      const dataUrl = await processUploadedImage(file, { maxWidth: 1440, maxHeight: 600, quality: 0.84 })
      update({ type: 'upload', customImage: dataUrl, posX: 50, posY: 50, zoom: 100 })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="banner-editor">
      <div className="banner-editor-head">
        <div>
          <p className="photo-upload-label">Banner Image</p>
          <p className="photo-upload-hint">Choose a built-in pattern or upload a wide image</p>
        </div>
        {isActive && (
          <button
            type="button"
            className="design-reset-btn"
            onClick={() => update({ type: 'none' })}
          >
            Hide Banner
          </button>
        )}
      </div>

      {/* Built-in banner thumbnails + Upload + None */}
      <div className="banner-choices" role="group" aria-label="Banner choices">
        {BANNER_PRESETS.map(p => {
          const selected = banner?.type === 'preset' && banner?.presetId === p.id
          return (
            <button
              key={p.id}
              type="button"
              className={`banner-thumb-btn${selected ? ' active' : ''}`}
              onClick={() => update({ type: 'preset', presetId: p.id })}
              title={p.name}
              aria-pressed={selected}
            >
              <img src={p.src} alt="" className="banner-thumb-img" />
              <span className="banner-thumb-label">{p.name}</span>
            </button>
          )
        })}

        <button
          type="button"
          className={`banner-thumb-btn banner-upload-tile${banner?.type === 'upload' ? ' active' : ''}`}
          onClick={() => fileRef.current?.click()}
          title="Upload your own banner image"
        >
          {banner?.type === 'upload' && banner?.customImage ? (
            <img src={banner.customImage} alt="Uploaded banner" className="banner-thumb-img" />
          ) : (
            <span className="banner-upload-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </span>
          )}
          <span className="banner-thumb-label">
            {banner?.customImage ? 'Custom' : 'Upload'}
          </span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        className="photo-file-input"
        aria-label="Upload custom banner image"
      />

      {error && <p className="field-error" role="alert">{error}</p>}

      {/* Crop & Focal Position controls */}
      {isActive && (
        <div className="banner-crop-box">
          <div className="banner-crop-top">
            <span className="banner-crop-title">Crop &amp; Focal Position</span>
            <button
              type="button"
              className="design-reset-btn"
              onClick={() => update({ posX: 50, posY: 50, zoom: 100, height: 'medium' })}
            >
              Reset Crop
            </button>
          </div>

          <div className="banner-mini-preview">
            <img
              src={bannerSrc}
              alt="Banner crop preview"
              style={{
                objectPosition: `${banner.posX ?? 50}% ${banner.posY ?? 50}%`,
                transform: `scale(${(banner.zoom ?? 100) / 100})`,
                transformOrigin: `${banner.posX ?? 50}% ${banner.posY ?? 50}%`,
              }}
            />
          </div>

          <div className="banner-focal-pills" role="group" aria-label="Quick focal position">
            {[
              { label: 'Top',    x: 50, y: 15 },
              { label: 'Center', x: 50, y: 50 },
              { label: 'Bottom', x: 50, y: 85 },
            ].map(pos => (
              <button
                key={pos.label}
                type="button"
                className={`focal-pill${banner.posX === pos.x && banner.posY === pos.y ? ' active' : ''}`}
                onClick={() => update({ posX: pos.x, posY: pos.y })}
              >
                {pos.label}
              </button>
            ))}
          </div>

          <div className="banner-sliders">
            <label className="slider-row">
              <span>Horizontal</span>
              <input
                type="range"
                min="0"
                max="100"
                value={banner.posX ?? 50}
                onChange={e => update({ posX: Number(e.target.value) })}
              />
              <span className="slider-val">{banner.posX ?? 50}%</span>
            </label>
            <label className="slider-row">
              <span>Vertical</span>
              <input
                type="range"
                min="0"
                max="100"
                value={banner.posY ?? 50}
                onChange={e => update({ posY: Number(e.target.value) })}
              />
              <span className="slider-val">{banner.posY ?? 50}%</span>
            </label>
            <label className="slider-row">
              <span>Zoom</span>
              <input
                type="range"
                min="100"
                max="160"
                step="5"
                value={banner.zoom ?? 100}
                onChange={e => update({ zoom: Number(e.target.value) })}
              />
              <span className="slider-val">{banner.zoom ?? 100}%</span>
            </label>
          </div>

          <div className="banner-height-row">
            <span className="slider-label">Banner Height</span>
            <div className="spacing-row" role="group" aria-label="Banner height">
              {[
                { id: 'short',  label: 'Short' },
                { id: 'medium', label: 'Medium' },
                { id: 'tall',   label: 'Tall' },
              ].map(h => (
                <button
                  key={h.id}
                  type="button"
                  className={`spacing-btn${(banner.height || 'medium') === h.id ? ' active' : ''}`}
                  onClick={() => update({ height: h.id })}
                  aria-pressed={(banner.height || 'medium') === h.id}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
