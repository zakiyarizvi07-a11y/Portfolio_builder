import { LAYOUT_PRESETS, DEFAULT_DESIGN } from '../data.js'
import './LayoutPanel.css'

function LayoutWireframe({ id }) {
  if (id === 'centered') {
    return (
      <svg viewBox="0 0 64 44" className="layout-wireframe" aria-hidden="true">
        <rect x="2" y="2" width="60" height="12" rx="2" fill="currentColor" opacity="0.25"/>
        <circle cx="32" cy="14" r="5" fill="currentColor"/>
        <rect x="20" y="22" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="14" y="29" width="36" height="4" rx="1.5" fill="currentColor" opacity="0.35"/>
        <rect x="14" y="36" width="36" height="4" rx="1.5" fill="currentColor" opacity="0.35"/>
      </svg>
    )
  }
  if (id === 'left') {
    return (
      <svg viewBox="0 0 64 44" className="layout-wireframe" aria-hidden="true">
        <rect x="2" y="2" width="60" height="12" rx="2" fill="currentColor" opacity="0.25"/>
        <circle cx="14" cy="14" r="5" fill="currentColor"/>
        <rect x="9" y="22" width="26" height="3" rx="1.5" fill="currentColor" opacity="0.8"/>
        <rect x="9" y="29" width="46" height="4" rx="1.5" fill="currentColor" opacity="0.35"/>
        <rect x="9" y="36" width="46" height="4" rx="1.5" fill="currentColor" opacity="0.35"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 44" className="layout-wireframe" aria-hidden="true">
      <rect x="3" y="4" width="18" height="36" rx="3" fill="currentColor" opacity="0.22"/>
      <circle cx="12" cy="13" r="4.5" fill="currentColor"/>
      <rect x="6" y="21" width="12" height="2.5" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="26" y="5" width="34" height="8" rx="2" fill="currentColor" opacity="0.35"/>
      <rect x="26" y="17" width="34" height="10" rx="2" fill="currentColor" opacity="0.35"/>
      <rect x="26" y="31" width="34" height="9" rx="2" fill="currentColor" opacity="0.35"/>
    </svg>
  )
}

export default function LayoutPanel({ design, banner, onUpdateDesign, onApplyLayoutPreset, onUpdateBanner, onJumpToSections }) {
  const activePreset = LAYOUT_PRESETS.find(p => p.id === design.layoutPreset) || LAYOUT_PRESETS[0]

  const resetPlacement = () => {
    onApplyLayoutPreset(activePreset)
    onUpdateDesign('projectsLayout', DEFAULT_DESIGN.projectsLayout)
  }

  return (
    <div className="design-panel">

      {/* Layout Presets */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Layout Preset</span>
          <button
            type="button"
            className="design-reset-btn"
            onClick={() => onApplyLayoutPreset(LAYOUT_PRESETS[0])}
          >
            Reset
          </button>
        </div>
        <div className="layout-preset-grid">
          {LAYOUT_PRESETS.map(p => {
            const active = design.layoutPreset === p.id
            return (
              <button
                key={p.id}
                type="button"
                className={`layout-preset-card${active ? ' active' : ''}`}
                onClick={() => onApplyLayoutPreset(p)}
                aria-pressed={active}
              >
                <LayoutWireframe id={p.id} />
                <span className="layout-preset-name">{p.name}</span>
                <span className="layout-preset-desc">{p.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Key Element Placement */}
      <div className="design-group">
        <div className="design-group-header">
          <span className="design-group-label">Element Placement</span>
          <button type="button" className="design-reset-btn" onClick={resetPlacement}>
            Reset
          </button>
        </div>

        <div className="layout-controls">
          <div className="layout-control-item">
            <span className="design-field-label">Profile Photo</span>
            <div className="spacing-row" role="group" aria-label="Profile photo placement">
              {[
                { id: 'overlap', label: 'Overlap' },
                { id: 'inside',  label: 'Inside' },
                { id: 'hidden',  label: 'Hidden' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`spacing-btn${design.photoPlacement === opt.id ? ' active' : ''}`}
                  onClick={() => onUpdateDesign('photoPlacement', opt.id)}
                  aria-pressed={design.photoPlacement === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {design.layoutPreset !== 'sidebar' && (
            <div className="layout-control-item">
              <span className="design-field-label">Name &amp; Role Alignment</span>
              <div className="mode-toggle" role="group" aria-label="Header alignment">
                {[
                  { id: 'center', label: 'Centered' },
                  { id: 'left',   label: 'Left-Aligned' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`spacing-btn${design.headerAlign === opt.id ? ' active' : ''}`}
                    onClick={() => onUpdateDesign('headerAlign', opt.id)}
                    aria-pressed={design.headerAlign === opt.id}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="layout-control-item">
            <span className="design-field-label">Projects Arrangement</span>
            <div className="mode-toggle" role="group" aria-label="Projects layout">
              {[
                { id: 'stack', label: 'Single Column' },
                { id: 'grid',  label: '2-Column Grid' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`spacing-btn${design.projectsLayout === opt.id ? ' active' : ''}`}
                  onClick={() => onUpdateDesign('projectsLayout', opt.id)}
                  aria-pressed={design.projectsLayout === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="layout-control-item">
            <span className="design-field-label">Banner Visibility</span>
            <div className="mode-toggle" role="group" aria-label="Banner visibility">
              <button
                type="button"
                className={`spacing-btn${banner?.type !== 'none' ? ' active' : ''}`}
                onClick={() => {
                  if (banner?.type === 'none') {
                    onUpdateBanner({ ...banner, type: banner.customImage ? 'upload' : 'preset' })
                  }
                }}
              >
                Shown
              </button>
              <button
                type="button"
                className={`spacing-btn${banner?.type === 'none' ? ' active' : ''}`}
                onClick={() => onUpdateBanner({ ...banner, type: 'none' })}
              >
                Hidden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section order shortcut */}
      <div className="design-group">
        <div className="layout-tip-box">
          <p>Want to change the order of About, Projects, Experience, or hide specific sections?</p>
          <button type="button" className="layout-jump-btn" onClick={onJumpToSections}>
            Manage Section Order →
          </button>
        </div>
      </div>

    </div>
  )
}
