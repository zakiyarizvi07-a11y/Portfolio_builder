import { getGradient } from '../data.js'
import './Header.css'

export default function Header({
  design, saveStatus, saveError, downloadToast,
  onReset, onDownload, onOpenFullScreen,
  showPreviewMobile, onTogglePreview,
}) {
  const gradient = getGradient(design)

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo" style={{ background: gradient }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
        </div>
        <span className="header-title">Portfolio Builder</span>
        {saveStatus === 'saving' && (
          <span className="save-badge saving" aria-live="polite">Saving…</span>
        )}
        {saveStatus === 'saved' && (
          <span className="save-badge saved" aria-live="polite">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Draft saved
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="save-badge error" role="alert" title={saveError}>
            {saveError || 'Draft not saved'}
          </span>
        )}
      </div>

      <nav className="header-nav" aria-label="Main actions">
        {downloadToast && (
          <div className="export-toast" role="status" aria-live="polite">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Exported <strong>{downloadToast}</strong>
          </div>
        )}

        <div className="header-actions">
          {/* Mobile editor/preview switch */}
          <button
            type="button"
            className="btn-icon mobile-only"
            onClick={onTogglePreview}
            aria-label={showPreviewMobile ? 'Show editor' : 'Show preview'}
            title={showPreviewMobile ? 'Show editor' : 'Show preview'}
          >
            {showPreviewMobile ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={onOpenFullScreen}
            title="Full-screen preview"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            <span className="btn-label">Full Screen</span>
          </button>

          <button type="button" className="btn-ghost" onClick={onReset} title="Reset to sample content and default design">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
            </svg>
            <span className="btn-label">Reset</span>
          </button>

          <button
            type="button"
            className={`btn-primary${downloadToast ? ' done' : ''}`}
            onClick={onDownload}
            title="Download self-contained portfolio HTML file"
          >
            {downloadToast ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="btn-label">Downloaded!</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span className="btn-label">Download HTML</span>
              </>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
