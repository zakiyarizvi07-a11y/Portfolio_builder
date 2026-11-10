import { useState, useEffect, useMemo } from 'react'
import { sanitizeUrl } from '../data.js'
import { getBannerSrc } from '../utils/banners.js'
import { buildPortfolioCSS } from '../utils/portfolioStyles.js'
import './PreviewPanel.css'

function getInitials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function Icon({ type, size = 15 }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': 'true' }
  if (type === 'github') return <svg {...s} fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
  if (type === 'linkedin') return <svg {...s} fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  if (type === 'twitter') return <svg {...s} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  if (type === 'globe') return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  if (type === 'email') return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  if (type === 'phone') return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  if (type === 'location') return <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  if (type === 'external') return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  return null
}

function PortfolioDocument({ data, design, viewport }) {
  const bannerSrc = getBannerSrc(data.banner)
  const hasBanner = data.banner?.type !== 'none' && Boolean(bannerSrc)
  const showAvatar = design.photoPlacement !== 'hidden'
  const isSidebar = design.layoutPreset === 'sidebar'
  const isCentered = !isSidebar && design.headerAlign === 'center'
  const overlapAvatar = showAvatar && hasBanner && design.photoPlacement === 'overlap'
  const initials = getInitials(data.name)

  const socials = [
    data.github   && { key: 'github',   url: sanitizeUrl(data.github),   type: 'github',   label: 'GitHub' },
    data.linkedin && { key: 'linkedin', url: sanitizeUrl(data.linkedin), type: 'linkedin', label: 'LinkedIn' },
    data.twitter  && { key: 'twitter',  url: sanitizeUrl(data.twitter),  type: 'twitter',  label: 'Twitter / X' },
    data.website  && { key: 'website',  url: sanitizeUrl(data.website),  type: 'globe',    label: 'Website' },
  ].filter(s => s && s.url)

  const safeEmail = data.email ? sanitizeUrl(`mailto:${data.email}`) : ''

  const bannerImgStyle = {
    objectPosition: `${data.banner?.posX ?? 50}% ${data.banner?.posY ?? 50}%`,
    transform: `scale(${(data.banner?.zoom ?? 100) / 100})`,
    transformOrigin: `${data.banner?.posX ?? 50}% ${data.banner?.posY ?? 50}%`,
  }

  const scopedCSS = useMemo(
    () => buildPortfolioCSS(design, data.banner, { scope: '.pf-preview-scope', forceMobile: viewport === 'mobile' }),
    [design, data.banner, viewport]
  )

  const renderAvatar = (extraClass = '') => {
    if (!showAvatar) return null
    return (
      <div className={`pf-avatar ${extraClass}`}>
        {data.photo ? (
          <img src={data.photo} alt={data.name || 'Profile'} className="pf-avatar-img" />
        ) : (
          <span className="pf-avatar-initials">{initials}</span>
        )}
      </div>
    )
  }

  const renderSocials = (centered = false) => {
    if (!socials.length && !safeEmail) return null
    return (
      <nav className={`pf-socials${centered ? ' pf-socials--center' : ''}`} aria-label="Social links">
        {socials.map(s => (
          <a key={s.key} href={s.url} className="pf-social-btn" target="_blank" rel="noopener noreferrer">
            <Icon type={s.type} size={15} />
            <span>{s.label}</span>
          </a>
        ))}
        {safeEmail && (
          <a href={safeEmail} className="pf-social-btn">
            <Icon type="email" size={15} />
            <span>Email</span>
          </a>
        )}
      </nav>
    )
  }

  const visibleSections = (data.sections || []).filter(sec => sec.visible !== false)

  const renderSection = (sec) => {
    switch (sec.type) {
      case 'about':
        if (!data.bio) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <p className="pf-bio">{data.bio}</p>
          </section>
        )

      case 'projects': {
        const items = (data.projects || []).filter(p => p.title || p.description)
        if (!items.length) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className={design.projectsLayout === 'grid' ? 'pf-projects--grid' : 'pf-card-list'}>
              {items.map(p => {
                const codeUrl = sanitizeUrl(p.link)
                const demoUrl = sanitizeUrl(p.demo)
                const techTags = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : []
                return (
                  <article key={p.id} className="pf-card pf-card--project">
                    <div className="pf-proj-top">
                      <div>
                        <h3 className="pf-card-title">{p.title || 'Untitled Project'}</h3>
                        {p.year && <span className="pf-card-meta">{p.year}</span>}
                      </div>
                      {(codeUrl || demoUrl) && (
                        <div className="pf-proj-links">
                          {codeUrl && (
                            <a href={codeUrl} className="pf-proj-link" target="_blank" rel="noopener noreferrer">
                              <Icon type="github" size={13} /> Code
                            </a>
                          )}
                          {demoUrl && (
                            <a href={demoUrl} className="pf-proj-link" target="_blank" rel="noopener noreferrer">
                              <Icon type="external" size={13} /> Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {p.description && <p className="pf-card-desc">{p.description}</p>}
                    {techTags.length > 0 && (
                      <div className="pf-tech-list">
                        {techTags.map((t, i) => <span key={`${t}-${i}`} className="pf-tech-tag">{t}</span>)}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )
      }

      case 'experience': {
        const items = (data.experience || []).filter(e => e.role || e.company)
        if (!items.length) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className="pf-card-list">
              {items.map(e => (
                <article key={e.id} className="pf-card">
                  <div className="pf-exp-top">
                    <div>
                      <h3 className="pf-card-title">{e.role || 'Role'}</h3>
                      {(e.company || e.location) && (
                        <p className="pf-card-sub">{[e.company, e.location].filter(Boolean).join(' · ')}</p>
                      )}
                    </div>
                    {e.period && <span className="pf-card-meta">{e.period}</span>}
                  </div>
                  {e.description && <p className="pf-card-desc">{e.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )
      }

      case 'education': {
        const items = (data.education || []).filter(e => e.degree || e.school)
        if (!items.length) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className="pf-card-list">
              {items.map(e => (
                <article key={e.id} className="pf-card">
                  <div className="pf-exp-top">
                    <div>
                      <h3 className="pf-card-title">{e.degree || 'Degree'}</h3>
                      {e.school && <p className="pf-card-sub">{e.school}</p>}
                    </div>
                    {e.period && <span className="pf-card-meta">{e.period}</span>}
                  </div>
                  {e.details && <p className="pf-card-desc">{e.details}</p>}
                </article>
              ))}
            </div>
          </section>
        )
      }

      case 'skills': {
        const items = (data.skills || []).filter(Boolean)
        if (!items.length) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className="pf-skills">
              {items.map(skill => <span key={skill} className="pf-skill-tag">{skill}</span>)}
            </div>
          </section>
        )
      }

      case 'achievements': {
        const items = (data.achievements || []).filter(a => a.title)
        if (!items.length) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className="pf-card-list">
              {items.map(a => (
                <article key={a.id} className="pf-card">
                  <div className="pf-exp-top">
                    <div>
                      <h3 className="pf-card-title">{a.title}</h3>
                      {a.issuer && <p className="pf-card-sub">{a.issuer}</p>}
                    </div>
                    {a.year && <span className="pf-card-meta">{a.year}</span>}
                  </div>
                  {a.description && <p className="pf-card-desc">{a.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )
      }

      case 'languages': {
        const items = (data.languages || []).filter(l => l.name)
        if (!items.length) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className="pf-lang-grid">
              {items.map(l => (
                <div key={l.id} className="pf-lang-item">
                  <span className="pf-lang-name">{l.name}</span>
                  {l.level && <span className="pf-lang-level">{l.level}</span>}
                </div>
              ))}
            </div>
          </section>
        )
      }

      case 'contact': {
        const safePhone = data.phone ? sanitizeUrl(`tel:${data.phone}`) : ''
        if (!data.contactNote && !safeEmail && !safePhone) return null
        return (
          <section key={sec.id} className="pf-section">
            <h2 className="pf-section-title">{sec.title}</h2>
            <div className="pf-contact-box">
              {data.contactNote && <p className="pf-card-desc">{data.contactNote}</p>}
              {(safeEmail || safePhone) && (
                <div className="pf-contact-actions">
                  {safeEmail && (
                    <a href={safeEmail} className="pf-contact-btn">
                      <Icon type="email" size={16} /> {data.email}
                    </a>
                  )}
                  {safePhone && (
                    <a href={safePhone} className="pf-contact-secondary">
                      <Icon type="phone" size={15} /> {data.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="pf-preview-scope">
      <style>{scopedCSS}</style>

      {isSidebar ? (
        <div className="pf-shell--sidebar">
          <aside className="pf-sidebar-card" aria-label="Profile">
            {hasBanner ? (
              <div className="pf-banner-wrap pf-banner-wrap--sidebar">
                <img src={bannerSrc} alt="" className="pf-banner-img" style={bannerImgStyle} />
                <div className="pf-banner-scrim" />
              </div>
            ) : (
              <div className="pf-accent-bar" />
            )}
            <div className={`pf-sidebar-body pf-sidebar-body--center${overlapAvatar ? ' pf-sidebar-body--has-overlap' : ''}`}>
              {renderAvatar(overlapAvatar ? 'pf-avatar--sidebar-overlap' : 'pf-avatar--sidebar-inside')}
              <div className="pf-identity">
                <h1 className="pf-name">{data.name || 'Your Name'}</h1>
                {data.role && <p className="pf-role">{data.role}</p>}
              </div>
              {(data.location || data.availability) && (
                <div className="pf-meta-row pf-meta-row--center">
                  {data.availability && (
                    <span className="pf-availability">
                      <span className="pf-availability-dot" />
                      {data.availability}
                    </span>
                  )}
                  {data.location && (
                    <span className="pf-location">
                      <Icon type="location" /> {data.location}
                    </span>
                  )}
                </div>
              )}
              {renderSocials(true)}
            </div>
          </aside>

          <div className="pf-main">
            {visibleSections.map(renderSection)}
          </div>
        </div>
      ) : (
        <>
          {hasBanner ? (
            <div className="pf-banner-wrap">
              <img src={bannerSrc} alt="" className="pf-banner-img" style={bannerImgStyle} />
              <div className="pf-banner-scrim" />
            </div>
          ) : (
            <div className="pf-accent-bar" />
          )}

          <div className="pf-container">
            <header className={`pf-profile-head ${isCentered ? 'pf-profile-head--center' : 'pf-profile-head--left'}${overlapAvatar ? ' pf-profile-head--has-overlap' : ''}`}>
              {overlapAvatar && renderAvatar('pf-avatar--overlap')}
              <div className={`pf-profile-row${isCentered ? ' pf-profile-row--center' : ''}`}>
                {!overlapAvatar && showAvatar && renderAvatar('')}
                <div className="pf-identity">
                  <h1 className="pf-name">{data.name || 'Your Name'}</h1>
                  {data.role && <p className="pf-role">{data.role}</p>}
                  {(data.location || data.availability) && (
                    <div className={`pf-meta-row${isCentered ? ' pf-meta-row--center' : ''}`}>
                      {data.availability && (
                        <span className="pf-availability">
                          <span className="pf-availability-dot" />
                          {data.availability}
                        </span>
                      )}
                      {data.location && (
                        <span className="pf-location">
                          <Icon type="location" /> {data.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {renderSocials(isCentered)}
            </header>

            <div className="pf-main">
              {visibleSections.map(renderSection)}
            </div>
          </div>
        </>
      )}

      <footer className="pf-footer">
        <p>© {new Date().getFullYear()} {data.name || 'Portfolio'}</p>
      </footer>
    </div>
  )
}

export default function PreviewPanel({ data, design, isFullScreen, onToggleFullScreen, onDownload }) {
  const [viewport, setViewport] = useState('desktop') // 'desktop' | 'mobile'

  useEffect(() => {
    if (!isFullScreen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onToggleFullScreen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFullScreen, onToggleFullScreen])

  const renderToolbar = (fullMode) => (
    <div className="preview-toolbar">
      <div className="preview-label">
        <span className="preview-label-dot" />
        <span>{fullMode ? 'Full-Screen Preview' : 'Live Preview'}</span>
      </div>

      <div className="preview-controls">
        <div className="viewport-toggle" role="group" aria-label="Preview viewport size">
          <button
            className={`vp-btn${viewport === 'desktop' ? ' active' : ''}`}
            onClick={() => setViewport('desktop')}
            aria-pressed={viewport === 'desktop'}
            title="Desktop preview"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span>Desktop</span>
          </button>
          <button
            className={`vp-btn${viewport === 'mobile' ? ' active' : ''}`}
            onClick={() => setViewport('mobile')}
            aria-pressed={viewport === 'mobile'}
            title="Mobile preview (390px)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <span>Mobile</span>
          </button>
        </div>

        {fullMode ? (
          <>
            <button className="fs-download-btn" onClick={onDownload}>
              Download HTML
            </button>
            <button
              className="fs-exit-btn"
              onClick={() => onToggleFullScreen(false)}
              aria-label="Exit full-screen preview"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Exit Full Screen
            </button>
          </>
        ) : (
          <button
            className="fs-open-btn"
            onClick={() => onToggleFullScreen(true)}
            title="Open full-screen preview"
            aria-label="Open full-screen preview"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            <span>Full Screen</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="preview-panel">
        {renderToolbar(false)}
        <div className="preview-scroll">
          <div className={`portfolio-frame${viewport === 'mobile' ? ' mobile-frame' : ''}`}>
            <PortfolioDocument data={data} design={design} viewport={viewport} />
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div
          className="fullscreen-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen portfolio preview"
        >
          {renderToolbar(true)}
          <div className="fullscreen-scroll">
            <div className={`fullscreen-stage${viewport === 'mobile' ? ' mobile-frame' : ''}`}>
              <PortfolioDocument data={data} design={design} viewport={viewport} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
