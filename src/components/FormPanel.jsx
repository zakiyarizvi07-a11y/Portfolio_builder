import { useState, useRef, useCallback } from 'react'
import { processUploadedImage } from '../utils/imageHelpers.js'
import FieldGroup from './FieldGroup.jsx'
import BannerEditor from './BannerEditor.jsx'
import SectionEditor from './SectionEditor.jsx'
import LayoutPanel from './LayoutPanel.jsx'
import DesignPanel from './DesignPanel.jsx'
import './FormPanel.css'

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: '👤' },
  { id: 'sections', label: 'Sections', icon: '📑' },
  { id: 'layout',   label: 'Layout',   icon: '📐' },
  { id: 'design',   label: 'Design',   icon: '🎨' },
]

export default function FormPanel({
  data, design, presets,
  onUpdateField,
  onAddSection, onRemoveSection, onMoveSection, onToggleSectionVisibility, onRenameSection,
  onAddListItem, onUpdateListItem, onRemoveListItem, onMoveListItem,
  onUpdateDesign, onBatchUpdateDesign, onApplyPreset, onApplyLayoutPreset,
}) {
  const [activeTab, setActiveTab] = useState('profile')
  const [photoError, setPhotoError] = useState('')
  const photoInputRef = useRef(null)

  const handlePhotoChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPhotoError('')
    try {
      const dataUrl = await processUploadedImage(file, { maxWidth: 512, maxHeight: 512, quality: 0.86 })
      onUpdateField('photo', dataUrl)
    } catch (err) {
      setPhotoError(err.message)
    }
  }, [onUpdateField])

  return (
    <div className="form-panel">
      {/* Tabs */}
      <nav className="section-tabs" role="tablist" aria-label="Editor tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            aria-controls={`tab-${t.id}`}
            className={`section-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="section-tab-icon">{t.icon}</span>
            <span className="section-tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      <div className="form-sections">

        {/* ── Tab 1: Profile & Banner ── */}
        <section
          id="tab-profile"
          role="tabpanel"
          className={`form-section${activeTab === 'profile' ? ' active' : ''}`}
          aria-hidden={activeTab !== 'profile'}
        >
          {/* Profile Photo */}
          <div className="photo-upload-group">
            <div className="photo-preview-wrap">
              {data.photo ? (
                <img src={data.photo} alt="Profile preview" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="photo-upload-actions">
              <p className="photo-upload-label">Profile Photo</p>
              <p className="photo-upload-hint">Displayed as a circle. Embedded directly in your exported HTML.</p>
              <div className="photo-btns">
                <button
                  type="button"
                  className="photo-upload-btn"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {data.photo ? 'Change photo' : 'Upload photo'}
                </button>
                {data.photo && (
                  <button
                    type="button"
                    className="photo-remove-btn"
                    onClick={() => onUpdateField('photo', '')}
                  >
                    Remove
                  </button>
                )}
              </div>
              {photoError && <p className="field-error" role="alert">{photoError}</p>}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="photo-file-input"
                aria-label="Upload profile photo"
              />
            </div>
          </div>

          <FieldGroup label="Full Name" hint="Shown prominently in your portfolio header" required>
            <input
              type="text"
              className="field-input"
              value={data.name}
              onChange={e => onUpdateField('name', e.target.value)}
              placeholder="e.g. Alex Rivera"
              maxLength={60}
              autoComplete="name"
            />
          </FieldGroup>

          <FieldGroup label="Role / Headline" hint="Your title or what you specialize in">
            <input
              type="text"
              className="field-input"
              value={data.role}
              onChange={e => onUpdateField('role', e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer & Designer"
              maxLength={90}
            />
          </FieldGroup>

          <div className="sec-grid-2">
            <FieldGroup label="Location" hint="Optional">
              <input
                type="text"
                className="field-input"
                value={data.location}
                onChange={e => onUpdateField('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                maxLength={60}
              />
            </FieldGroup>
            <FieldGroup label="Status Badge" hint="Optional">
              <input
                type="text"
                className="field-input"
                value={data.availability || ''}
                onChange={e => onUpdateField('availability', e.target.value)}
                placeholder="e.g. Open to roles"
                maxLength={40}
              />
            </FieldGroup>
          </div>

          {/* Banner Editor */}
          <BannerEditor
            banner={data.banner}
            onChange={v => onUpdateField('banner', v)}
          />

          {/* Social Links */}
          <div className="profile-subhead">Social &amp; Profile Links</div>

          <FieldGroup label="GitHub" icon="github">
            <input type="url" className="field-input" value={data.github}
              onChange={e => onUpdateField('github', e.target.value)}
              placeholder="https://github.com/yourusername" />
          </FieldGroup>
          <FieldGroup label="LinkedIn" icon="linkedin">
            <input type="url" className="field-input" value={data.linkedin}
              onChange={e => onUpdateField('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourusername" />
          </FieldGroup>
          <FieldGroup label="Twitter / X" icon="twitter">
            <input type="url" className="field-input" value={data.twitter}
              onChange={e => onUpdateField('twitter', e.target.value)}
              placeholder="https://twitter.com/yourusername" />
          </FieldGroup>
          <FieldGroup label="Personal Website" icon="globe">
            <input type="url" className="field-input" value={data.website}
              onChange={e => onUpdateField('website', e.target.value)}
              placeholder="https://yourwebsite.com" />
          </FieldGroup>
        </section>

        {/* ── Tab 2: Sections ── */}
        <section
          id="tab-sections"
          role="tabpanel"
          className={`form-section${activeTab === 'sections' ? ' active' : ''}`}
          aria-hidden={activeTab !== 'sections'}
        >
          <SectionEditor
            data={data}
            onUpdateField={onUpdateField}
            onAddSection={onAddSection}
            onRemoveSection={onRemoveSection}
            onMoveSection={onMoveSection}
            onToggleSectionVisibility={onToggleSectionVisibility}
            onRenameSection={onRenameSection}
            onAddListItem={onAddListItem}
            onUpdateListItem={onUpdateListItem}
            onRemoveListItem={onRemoveListItem}
            onMoveListItem={onMoveListItem}
          />
        </section>

        {/* ── Tab 3: Layout ── */}
        <section
          id="tab-layout"
          role="tabpanel"
          className={`form-section design-section${activeTab === 'layout' ? ' active' : ''}`}
          aria-hidden={activeTab !== 'layout'}
        >
          <LayoutPanel
            design={design}
            banner={data.banner}
            onUpdateDesign={onUpdateDesign}
            onApplyLayoutPreset={onApplyLayoutPreset}
            onUpdateBanner={v => onUpdateField('banner', v)}
            onJumpToSections={() => setActiveTab('sections')}
          />
        </section>

        {/* ── Tab 4: Design ── */}
        <section
          id="tab-design"
          role="tabpanel"
          className={`form-section design-section${activeTab === 'design' ? ' active' : ''}`}
          aria-hidden={activeTab !== 'design'}
        >
          <DesignPanel
            design={design}
            presets={presets}
            onUpdateDesign={onUpdateDesign}
            onBatchUpdateDesign={onBatchUpdateDesign}
            onApplyPreset={onApplyPreset}
          />
        </section>

      </div>

      {/* Bottom quick nav */}
      <div className="section-nav">
        <button
          type="button"
          className="section-nav-btn"
          onClick={() => {
            const idx = TABS.findIndex(t => t.id === activeTab)
            if (idx > 0) setActiveTab(TABS[idx - 1].id)
          }}
          disabled={activeTab === TABS[0].id}
        >
          ← Prev
        </button>
        <div className="section-dots" aria-hidden="true">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              className={`dot${t.id === activeTab ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              title={t.label}
              tabIndex={-1}
            />
          ))}
        </div>
        <button
          type="button"
          className="section-nav-btn"
          onClick={() => {
            const idx = TABS.findIndex(t => t.id === activeTab)
            if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id)
          }}
          disabled={activeTab === TABS[TABS.length - 1].id}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
