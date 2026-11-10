import { useState, useEffect, useCallback, useRef } from 'react'
import {
  DEFAULT_DATA, DEFAULT_DESIGN, DESIGN_PRESETS, SECTION_CATALOG,
  loadDraft, saveDraft, clearDraft, generateId, getGradient, normalizeHex,
} from './data.js'
import FormPanel from './components/FormPanel.jsx'
import PreviewPanel from './components/PreviewPanel.jsx'
import Header from './components/Header.jsx'
import { generatePortfolioHTML } from './utils/generateHTML.js'
import './styles/app.css'

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA)
  const [design, setDesign] = useState(DEFAULT_DESIGN)
  const [showPreviewMobile, setShowPreviewMobile] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'
  const [saveError, setSaveError] = useState('')
  const [downloadToast, setDownloadToast] = useState('')
  const saveTimer = useRef(null)
  const isFirstMount = useRef(true)

  // ── Apply CSS vars for builder chrome theming ─────────────────────────────
  useEffect(() => {
    const r = document.documentElement
    const accent = normalizeHex(design.accent, '#4f46e5')
    const gradient = getGradient({ accent, accentGrad: normalizeHex(design.accentGrad, '#7c3aed') })
    r.style.setProperty('--accent', accent)
    r.style.setProperty('--accent-light', accent + '20')
    r.style.setProperty('--accent-dark', accent)
    r.style.setProperty('--gradient', gradient)
    r.style.setProperty('--surface', '#ffffff')
    r.style.setProperty('--surface-alt', '#f8fafc')
    r.style.setProperty('--text', '#0f172a')
    r.style.setProperty('--text-muted', '#64748b')
    r.style.setProperty('--border', '#e2e8f0')
    r.style.setProperty('--card-bg', '#ffffff')
  }, [design.accent, design.accentGrad])

  // ── Load saved draft on mount ─────────────────────────────────────────────
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      if (draft.data) {
        setData(prev => ({
          ...prev,
          ...draft.data,
          banner: { ...prev.banner, ...(draft.data.banner || {}) },
          sections: Array.isArray(draft.data.sections) ? draft.data.sections : prev.sections,
        }))
      }
      if (draft.design) {
        setDesign(prev => ({ ...prev, ...draft.design }))
      }
    }
  }, [])

  // ── Auto-save draft (debounced 650ms) ─────────────────────────────────────
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    setSaveStatus('saving')
    setSaveError('')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    let clearBadgeTimer = null
    saveTimer.current = setTimeout(() => {
      const res = saveDraft(data, design)
      if (res.ok) {
        setSaveStatus('saved')
        clearBadgeTimer = setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
        setSaveError(res.error || 'Could not save draft')
      }
    }, 650)
    return () => {
      clearTimeout(saveTimer.current)
      if (clearBadgeTimer) clearTimeout(clearBadgeTimer)
    }
  }, [data, design])

  // ── Content Field Callbacks ───────────────────────────────────────────────
  const updateField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  // ── Section Management Callbacks ──────────────────────────────────────────
  const addSection = useCallback((type) => {
    const meta = SECTION_CATALOG.find(c => c.type === type)
    if (!meta) return null
    const id = generateId('sec')
    setData(prev => {
      if (prev.sections.some(s => s.type === type)) return prev
      return {
        ...prev,
        sections: [...prev.sections, { id, type, title: meta.defaultTitle, visible: true }],
      }
    })
    return id
  }, [])

  const removeSection = useCallback((id) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id),
    }))
  }, [])

  const moveSection = useCallback((id, dir) => {
    setData(prev => {
      const list = [...prev.sections]
      const idx = list.findIndex(s => s.id === id)
      const to = idx + dir
      if (idx < 0 || to < 0 || to >= list.length) return prev
      ;[list[idx], list[to]] = [list[to], list[idx]]
      return { ...prev, sections: list }
    })
  }, [])

  const toggleSectionVisibility = useCallback((id) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, visible: s.visible === false } : s),
    }))
  }, [])

  const renameSection = useCallback((id, title) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, title } : s),
    }))
  }, [])

  // ── Shared List-Item Callbacks (projects, experience, education, achievements, languages)
  const addListItem = useCallback((key, template) => {
    setData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: generateId(key.slice(0, 3)), ...template }],
    }))
  }, [])

  const updateListItem = useCallback((key, id, field, value) => {
    setData(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(item => item.id === id ? { ...item, [field]: value } : item),
    }))
  }, [])

  const removeListItem = useCallback((key, id) => {
    setData(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(item => item.id !== id),
    }))
  }, [])

  const moveListItem = useCallback((key, id, dir) => {
    setData(prev => {
      const list = [...(prev[key] || [])]
      const idx = list.findIndex(item => item.id === id)
      const to = idx + dir
      if (idx < 0 || to < 0 || to >= list.length) return prev
      ;[list[idx], list[to]] = [list[to], list[idx]]
      return { ...prev, [key]: list }
    })
  }, [])

  // ── Design & Layout Callbacks ─────────────────────────────────────────────
  const updateDesign = useCallback((key, value) => {
    setDesign(prev => ({ ...prev, [key]: value }))
  }, [])

  const batchUpdateDesign = useCallback((patch) => {
    setDesign(prev => ({ ...prev, ...patch }))
  }, [])

  const applyPreset = useCallback((preset) => {
    setDesign(prev => ({
      ...prev,
      ...preset.design,
      preset: preset.id,
    }))
  }, [])

  const applyLayoutPreset = useCallback((layoutPreset) => {
    setDesign(prev => ({
      ...prev,
      ...layoutPreset.defaults,
    }))
  }, [])

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    if (!window.confirm('Reset all content, images, sections, layout, and design back to the sample portfolio? Your saved draft will be cleared.')) return
    setData(DEFAULT_DATA)
    setDesign(DEFAULT_DESIGN)
    clearDraft()
    setSaveStatus('idle')
    setSaveError('')
  }, [])

  // ── Download HTML ─────────────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    const html = generatePortfolioHTML(data, design)
    const slug = (data.name || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const filename = `${slug ? `${slug}-portfolio` : 'my-portfolio'}.html`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setDownloadToast(filename)
    setTimeout(() => setDownloadToast(''), 3200)
  }, [data, design])

  return (
    <div className="app-shell">
      <Header
        design={design}
        saveStatus={saveStatus}
        saveError={saveError}
        downloadToast={downloadToast}
        onReset={handleReset}
        onDownload={handleDownload}
        onOpenFullScreen={() => setIsFullScreen(true)}
        showPreviewMobile={showPreviewMobile}
        onTogglePreview={() => setShowPreviewMobile(v => !v)}
      />

      <main className="app-main">
        <div className={`form-pane${showPreviewMobile ? ' hidden-mobile' : ''}`}>
          <FormPanel
            data={data}
            design={design}
            presets={DESIGN_PRESETS}
            onUpdateField={updateField}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onMoveSection={moveSection}
            onToggleSectionVisibility={toggleSectionVisibility}
            onRenameSection={renameSection}
            onAddListItem={addListItem}
            onUpdateListItem={updateListItem}
            onRemoveListItem={removeListItem}
            onMoveListItem={moveListItem}
            onUpdateDesign={updateDesign}
            onBatchUpdateDesign={batchUpdateDesign}
            onApplyPreset={applyPreset}
            onApplyLayoutPreset={applyLayoutPreset}
          />
        </div>

        <div className={`preview-pane${showPreviewMobile ? ' visible-mobile' : ''}`}>
          <PreviewPanel
            data={data}
            design={design}
            isFullScreen={isFullScreen}
            onToggleFullScreen={setIsFullScreen}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </div>
  )
}
