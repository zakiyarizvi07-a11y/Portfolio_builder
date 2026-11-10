/**
 * Generates a complete, self-contained HTML file using the shared portfolio CSS.
 * All user text is escaped, URLs are sanitized, and images are embedded as data URIs.
 */
import { sanitizeUrl } from '../data.js'
import { getBannerSrc } from './banners.js'
import { buildPortfolioCSS } from './portfolioStyles.js'

export function generatePortfolioHTML(data, design) {
  const bannerSrc = getBannerSrc(data.banner)
  const hasBanner = data.banner?.type !== 'none' && Boolean(bannerSrc)
  const showAvatar = design.photoPlacement !== 'hidden'
  const isSidebar = design.layoutPreset === 'sidebar'
  const isCentered = !isSidebar && design.headerAlign === 'center'
  const overlapAvatar = showAvatar && hasBanner && design.photoPlacement === 'overlap'

  const initials = data.name
    ? data.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const socials = [
    data.github   && { url: sanitizeUrl(data.github),   icon: githubIcon(15),   label: 'GitHub' },
    data.linkedin && { url: sanitizeUrl(data.linkedin), icon: linkedinIcon(15), label: 'LinkedIn' },
    data.twitter  && { url: sanitizeUrl(data.twitter),  icon: twitterIcon(15),  label: 'Twitter / X' },
    data.website  && { url: sanitizeUrl(data.website),  icon: globeIcon(15),    label: 'Website' },
  ].filter(s => s && s.url)

  const bannerImgStyle = hasBanner
    ? `object-position: ${data.banner.posX ?? 50}% ${data.banner.posY ?? 50}%; transform: scale(${(data.banner.zoom ?? 100) / 100}); transform-origin: ${data.banner.posX ?? 50}% ${data.banner.posY ?? 50}%;`
    : ''

  const avatarHtml = (extraClass = '') => {
    if (!showAvatar) return ''
    return `<div class="pf-avatar ${extraClass}">
      ${data.photo
        ? `<img src="${escapeAttr(data.photo)}" alt="${escapeAttr(data.name || 'Profile photo')}" class="pf-avatar-img" />`
        : `<span class="pf-avatar-initials">${escapeHtml(initials)}</span>`
      }
    </div>`
  }

  const socialsHtml = (centered = false) => {
    const safeEmail = data.email ? sanitizeUrl(`mailto:${data.email}`) : ''
    if (!socials.length && !safeEmail) return ''
    return `<nav class="pf-socials${centered ? ' pf-socials--center' : ''}" aria-label="Social and contact links">
      ${socials.map(s => `<a href="${escapeAttr(s.url)}" class="pf-social-btn" target="_blank" rel="noopener noreferrer">${s.icon}<span>${escapeHtml(s.label)}</span></a>`).join('\n      ')}
      ${safeEmail ? `<a href="${escapeAttr(safeEmail)}" class="pf-social-btn">${emailIcon(15)}<span>Email</span></a>` : ''}
    </nav>`
  }

  const visibleSections = (data.sections || []).filter(sec => sec.visible !== false)
  const sectionsMarkup = visibleSections
    .map(sec => renderSectionHtml(sec, data, design))
    .filter(Boolean)
    .join('\n\n')

  const css = buildPortfolioCSS(design, data.banner, { scope: '', forceMobile: false })
  const titleText = escapeHtml(data.name ? `${data.name} — Portfolio` : 'Personal Portfolio')
  const descMeta = escapeAttr(data.bio || `${data.name || 'Personal'} portfolio`)
  const year = new Date().getFullYear()

  let bodyMarkup = ''

  if (isSidebar) {
    bodyMarkup = `
<div class="pf-shell--sidebar">
  <aside class="pf-sidebar-card" aria-label="Profile">
    ${hasBanner
      ? `<div class="pf-banner-wrap pf-banner-wrap--sidebar">
           <img src="${escapeAttr(bannerSrc)}" alt="" class="pf-banner-img" style="${bannerImgStyle}" />
           <div class="pf-banner-scrim"></div>
         </div>`
      : `<div class="pf-accent-bar"></div>`
    }
    <div class="pf-sidebar-body pf-sidebar-body--center${overlapAvatar ? ' pf-sidebar-body--has-overlap' : ''}">
      ${avatarHtml(overlapAvatar ? 'pf-avatar--sidebar-overlap' : 'pf-avatar--sidebar-inside')}
      <div class="pf-identity">
        <h1 class="pf-name">${escapeHtml(data.name || 'Your Name')}</h1>
        ${data.role ? `<p class="pf-role">${escapeHtml(data.role)}</p>` : ''}
      </div>
      ${(data.location || data.availability) ? `
      <div class="pf-meta-row pf-meta-row--center">
        ${data.availability ? `<span class="pf-availability"><span class="pf-availability-dot"></span>${escapeHtml(data.availability)}</span>` : ''}
        ${data.location ? `<span class="pf-location">${pinIcon()} ${escapeHtml(data.location)}</span>` : ''}
      </div>` : ''}
      ${socialsHtml(true)}
    </div>
  </aside>

  <main class="pf-main">
    ${sectionsMarkup}
  </main>
</div>`
  } else {
    const insideLeftRow = !isCentered && showAvatar && !overlapAvatar
    bodyMarkup = `
${hasBanner
  ? `<div class="pf-banner-wrap">
       <img src="${escapeAttr(bannerSrc)}" alt="" class="pf-banner-img" style="${bannerImgStyle}" />
       <div class="pf-banner-scrim"></div>
     </div>`
  : `<div class="pf-accent-bar"></div>`
}
<div class="pf-container">
  <header class="pf-profile-head ${isCentered ? 'pf-profile-head--center' : 'pf-profile-head--left'}${overlapAvatar ? ' pf-profile-head--has-overlap' : ''}">
    ${overlapAvatar ? avatarHtml('pf-avatar--overlap') : ''}
    <div class="pf-profile-row${isCentered ? ' pf-profile-row--center' : ''}">
      ${(!overlapAvatar && showAvatar) ? avatarHtml('') : ''}
      <div class="pf-identity">
        <h1 class="pf-name">${escapeHtml(data.name || 'Your Name')}</h1>
        ${data.role ? `<p class="pf-role">${escapeHtml(data.role)}</p>` : ''}
        ${(data.location || data.availability) ? `
        <div class="pf-meta-row${isCentered ? ' pf-meta-row--center' : ''}">
          ${data.availability ? `<span class="pf-availability"><span class="pf-availability-dot"></span>${escapeHtml(data.availability)}</span>` : ''}
          ${data.location ? `<span class="pf-location">${pinIcon()} ${escapeHtml(data.location)}</span>` : ''}
        </div>` : ''}
      </div>
    </div>
    ${socialsHtml(isCentered && !insideLeftRow)}
  </header>

  <main class="pf-main">
    ${sectionsMarkup}
  </main>
</div>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${descMeta}" />
  <title>${titleText}</title>
  <style>
    body { margin: 0; }
${css}
  </style>
</head>
<body class="pf-root">
${bodyMarkup}
<footer class="pf-footer">
  <p>&copy; ${year} ${escapeHtml(data.name || 'Portfolio')}</p>
</footer>
</body>
</html>`
}

// ─── Section Renderers ───────────────────────────────────────────────────────
function renderSectionHtml(sec, data, design) {
  const title = escapeHtml(sec.title)

  switch (sec.type) {
    case 'about': {
      if (!data.bio) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <p class="pf-bio">${escapeHtml(data.bio)}</p>
    </section>`
    }

    case 'projects': {
      const items = (data.projects || []).filter(p => p.title || p.description)
      if (!items.length) return ''
      const gridClass = design.projectsLayout === 'grid' ? 'pf-projects--grid' : 'pf-card-list'
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="${gridClass}">
        ${items.map(p => {
          const codeUrl = sanitizeUrl(p.link)
          const demoUrl = sanitizeUrl(p.demo)
          return `<article class="pf-card pf-card--project">
          <div class="pf-proj-top">
            <div>
              <h3 class="pf-card-title">${escapeHtml(p.title || 'Untitled Project')}</h3>
              ${p.year ? `<span class="pf-card-meta">${escapeHtml(p.year)}</span>` : ''}
            </div>
            ${(codeUrl || demoUrl) ? `<div class="pf-proj-links">
              ${codeUrl ? `<a href="${escapeAttr(codeUrl)}" class="pf-proj-link" target="_blank" rel="noopener noreferrer">${githubIcon(13)} Code</a>` : ''}
              ${demoUrl ? `<a href="${escapeAttr(demoUrl)}" class="pf-proj-link" target="_blank" rel="noopener noreferrer">${externalIcon(13)} Demo</a>` : ''}
            </div>` : ''}
          </div>
          ${p.description ? `<p class="pf-card-desc">${escapeHtml(p.description)}</p>` : ''}
          ${p.tech ? `<div class="pf-tech-list">${p.tech.split(',').map(t => t.trim()).filter(Boolean).map(t => `<span class="pf-tech-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        </article>`
        }).join('\n        ')}
      </div>
    </section>`
    }

    case 'experience': {
      const items = (data.experience || []).filter(e => e.role || e.company)
      if (!items.length) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="pf-card-list">
        ${items.map(e => `<article class="pf-card">
          <div class="pf-exp-top">
            <div>
              <h3 class="pf-card-title">${escapeHtml(e.role || 'Role')}</h3>
              ${(e.company || e.location) ? `<p class="pf-card-sub">${escapeHtml([e.company, e.location].filter(Boolean).join(' · '))}</p>` : ''}
            </div>
            ${e.period ? `<span class="pf-card-meta">${escapeHtml(e.period)}</span>` : ''}
          </div>
          ${e.description ? `<p class="pf-card-desc">${escapeHtml(e.description)}</p>` : ''}
        </article>`).join('\n        ')}
      </div>
    </section>`
    }

    case 'education': {
      const items = (data.education || []).filter(e => e.degree || e.school)
      if (!items.length) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="pf-card-list">
        ${items.map(e => `<article class="pf-card">
          <div class="pf-exp-top">
            <div>
              <h3 class="pf-card-title">${escapeHtml(e.degree || 'Degree')}</h3>
              ${e.school ? `<p class="pf-card-sub">${escapeHtml(e.school)}</p>` : ''}
            </div>
            ${e.period ? `<span class="pf-card-meta">${escapeHtml(e.period)}</span>` : ''}
          </div>
          ${e.details ? `<p class="pf-card-desc">${escapeHtml(e.details)}</p>` : ''}
        </article>`).join('\n        ')}
      </div>
    </section>`
    }

    case 'skills': {
      const items = (data.skills || []).filter(Boolean)
      if (!items.length) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="pf-skills">
        ${items.map(s => `<span class="pf-skill-tag">${escapeHtml(s)}</span>`).join('\n        ')}
      </div>
    </section>`
    }

    case 'achievements': {
      const items = (data.achievements || []).filter(a => a.title)
      if (!items.length) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="pf-card-list">
        ${items.map(a => `<article class="pf-card">
          <div class="pf-exp-top">
            <div>
              <h3 class="pf-card-title">${escapeHtml(a.title)}</h3>
              ${a.issuer ? `<p class="pf-card-sub">${escapeHtml(a.issuer)}</p>` : ''}
            </div>
            ${a.year ? `<span class="pf-card-meta">${escapeHtml(a.year)}</span>` : ''}
          </div>
          ${a.description ? `<p class="pf-card-desc">${escapeHtml(a.description)}</p>` : ''}
        </article>`).join('\n        ')}
      </div>
    </section>`
    }

    case 'languages': {
      const items = (data.languages || []).filter(l => l.name)
      if (!items.length) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="pf-lang-grid">
        ${items.map(l => `<div class="pf-lang-item">
          <span class="pf-lang-name">${escapeHtml(l.name)}</span>
          ${l.level ? `<span class="pf-lang-level">${escapeHtml(l.level)}</span>` : ''}
        </div>`).join('\n        ')}
      </div>
    </section>`
    }

    case 'contact': {
      const safeEmail = data.email ? sanitizeUrl(`mailto:${data.email}`) : ''
      const safePhone = data.phone ? sanitizeUrl(`tel:${data.phone}`) : ''
      if (!data.contactNote && !safeEmail && !safePhone) return ''
      return `<section class="pf-section">
      <h2 class="pf-section-title">${title}</h2>
      <div class="pf-contact-box">
        ${data.contactNote ? `<p class="pf-card-desc" style="margin:0">${escapeHtml(data.contactNote)}</p>` : ''}
        ${(safeEmail || safePhone) ? `<div class="pf-contact-actions">
          ${safeEmail ? `<a href="${escapeAttr(safeEmail)}" class="pf-contact-btn">${emailIcon(16)} ${escapeHtml(data.email)}</a>` : ''}
          ${safePhone ? `<a href="${escapeAttr(safePhone)}" class="pf-contact-secondary">${phoneIcon(15)} ${escapeHtml(data.phone)}</a>` : ''}
        </div>` : ''}
      </div>
    </section>`
    }

    default:
      return ''
  }
}

// ─── Escaping ────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(str) {
  return escapeHtml(str)
}

// ─── Inline SVGs ─────────────────────────────────────────────────────────────
function githubIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`
}

function linkedinIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
}

function twitterIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
}

function globeIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
}

function emailIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
}

function phoneIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
}

function pinIcon() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
}

function externalIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
}
