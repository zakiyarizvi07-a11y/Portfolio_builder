import { useState, useEffect } from 'react'
import { FONT_OPTIONS, SPACING_OPTIONS, DEFAULT_DESIGN, normalizeHex } from '../data.js'
import './DesignPanel.css'

function ColorField({ label, value, onChange, hint }) {
  const [textVal, setTextVal] = useState(value)

  useEffect(() => {
    setTextVal(value)
  }, [value])

  const handleTextChange = (e) => {
    let raw = e.target.value.trim()
    if (raw && !raw.startsWith('#')) raw = '#' + raw
    if (/^#[0-9a-fA-F]{0,6}$/.test(raw)) {
      setTextVal(raw)
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) {
        onChange(normalizeHex(raw, value))
      }
    }
  }

  const handleBlur = () => {
    setTextVal(value)
  }

  return (
    <div className="design-field">
      <label className="design-field-label">{label}</label>
      {hint && <span className="design-field-hint">{hint}</span>}
      <div className="color-row">
        <div className="color-swatch-wrap">
          <input
            type="color"
            className="color-picker"
            value={normalizeHex(value)}
            onChange={e => onChange(e.target.value)}
            aria-label={label}
          />
          <span className="color-preview" style={{ background: normalizeHex(value) }} />
        </div>
        <input
          type="text"
          className="color-hex"
          value={textVal}
          onChange={handleTextChange}
          onBlur={handleBlur}
          maxLength={7}
          spellCheck={false}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  )
}

export default function DesignPanel({ design, presets, onUpdateDesign, onBatchUpdateDesign, onApplyPreset }) {
  const activePreset = presets.find(p => p.id === design.preset) || presets[0]

  const resetAppearance = () => {
    const mode = activePreset.design.mode || DEFAULT_DESIGN.mode
    handleModeSwitch(mode)
  }

  const handleModeSwitch = (targetMode) => {
    if (targetMode === 'dark') {
      onBatchUpdateDesign({
        mode: 'dark',
        bg: activePreset.design.mode === 'dark' ? activePreset.design.bg : '#0b1120',
        surface: activePreset.design.mode === 'dark' ? activePreset.design.surface : '#162032',
        text: activePreset.design.mode === 'dark' ? activePreset.design.text : '#f1f5f9',
        textMuted: activePreset.design.mode === 'dark' ? activePreset.design.textMuted : '#94a3b8',
      })
    } else {
      onBatchUpdateDesign({
        mode: 'light',
        bg: activePreset.design.mode === 'light' ? activePreset.design.bg : '#f8fafc',
        surface: activePreset.design.mode === 'light' ? activePreset.design.surface : '#ffffff',
        text: activePreset.design.mode === 'light' ? activePreset.design.text : '#0f172a',
        textMuted: activePreset.design.mode === 'light' ? activePreset.design.textMuted : '#475569',
      })
    }
  }

  const resetColors = () => {
    const d = activePreset.design
    onBatchUpdateDesign({
      accent: d.accent,
      accentGrad: d.accentGrad,
      bg: d.bg,
      surface: d.surface,
      text: d.text,
      textMuted: d.textMuted,
    })
  }

  const resetFont = () => {
    onUpdateDesign('font', activePreset.design.font || DEFAULT_DESIGN.font)
  }

  const resetSpacing = () => {
    onUpdateDesign('spacing', activePreset.design.spacing || DEFAULT_DESIGN.spacing)
  }

  return (
    <div className="design-panel">

      {/* Presets */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Design Presets</span>
        </div>
        <div className="preset-grid">
          {presets.map(preset => (
            <button
              key={preset.id}
              type="button"
              className={`preset-btn${design.preset === preset.id ? ' active' : ''}`}
              onClick={() => onApplyPreset(preset)}
              title={`${preset.name} — ${preset.description}`}
              aria-pressed={design.preset === preset.id}
            >
              <span
                className="preset-swatch"
                style={{ background: `linear-gradient(135deg, ${preset.swatch[0]}, ${preset.swatch[1]})` }}
              />
              <span className="preset-name">{preset.name}</span>
              {design.preset === preset.id && (
                <svg className="preset-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Appearance mode */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Appearance</span>
          <button type="button" className="design-reset-btn" onClick={resetAppearance} title="Reset appearance to preset">
            Reset to preset
          </button>
        </div>
        <div className="mode-toggle" role="group" aria-label="Appearance mode">
          {[
            { id: 'light', label: 'Light', icon: '☀️' },
            { id: 'dark',  label: 'Dark',  icon: '🌙' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              className={`mode-btn${design.mode === m.id ? ' active' : ''}`}
              onClick={() => handleModeSwitch(m.id)}
              aria-pressed={design.mode === m.id}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Colors</span>
          <button type="button" className="design-reset-btn" onClick={resetColors} title="Reset colors to preset">
            Reset to preset
          </button>
        </div>
        <div className="design-fields">
          <ColorField
            label="Accent Color"
            hint="Buttons, section headings, and gradient start"
            value={design.accent}
            onChange={v => onUpdateDesign('accent', v)}
          />
          <ColorField
            label="Secondary Accent"
            hint="Gradient end color"
            value={design.accentGrad}
            onChange={v => onUpdateDesign('accentGrad', v)}
          />
          <ColorField
            label="Background Color"
            value={design.bg}
            onChange={v => onUpdateDesign('bg', v)}
          />
          <ColorField
            label="Card Surface Color"
            value={design.surface}
            onChange={v => onUpdateDesign('surface', v)}
          />
          <ColorField
            label="Primary Text Color"
            value={design.text}
            onChange={v => onUpdateDesign('text', v)}
          />
          <ColorField
            label="Muted Text Color"
            value={design.textMuted}
            onChange={v => onUpdateDesign('textMuted', v)}
          />
        </div>
      </div>

      {/* Font */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Typography</span>
          <button type="button" className="design-reset-btn" onClick={resetFont} title="Reset font to preset">
            Reset to preset
          </button>
        </div>
        <div className="font-grid">
          {FONT_OPTIONS.map(f => (
            <button
              key={f.id}
              type="button"
              className={`font-btn${design.font === f.id ? ' active' : ''}`}
              onClick={() => onUpdateDesign('font', f.id)}
              style={{ fontFamily: f.family }}
              aria-pressed={design.font === f.id}
              title={f.name}
            >
              <span className="font-sample">{f.sample}</span>
              <span className="font-name">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Spacing</span>
          <button type="button" className="design-reset-btn" onClick={resetSpacing} title="Reset spacing to preset">
            Reset to preset
          </button>
        </div>
        <div className="spacing-row" role="group" aria-label="Spacing">
          {SPACING_OPTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              className={`spacing-btn${design.spacing === s.id ? ' active' : ''}`}
              onClick={() => onUpdateDesign('spacing', s.id)}
              aria-pressed={design.spacing === s.id}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
