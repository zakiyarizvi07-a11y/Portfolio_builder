import { FONT_OPTIONS, SPACING_OPTIONS, getGradient, normalizeHex } from '../data.js'

const BANNER_HEIGHTS = {
  short:  { desktop: 140, mobile: 110, sidebar: 105 },
  medium: { desktop: 200, mobile: 145, sidebar: 135 },
  tall:   { desktop: 265, mobile: 180, sidebar: 165 },
}

/**
 * Generates CSS shared by both PreviewPanel (scoped) and exported standalone HTML.
 */
export function buildPortfolioCSS(design, banner, { scope = '', forceMobile = false } = {}) {
  const s = scope ? `${scope} ` : ''
  const rootSel = scope ? scope : '.pf-root'

  const accent     = normalizeHex(design.accent, '#4f46e5')
  const accentGrad = normalizeHex(design.accentGrad, '#7c3aed')
  const bg         = normalizeHex(design.bg, '#f8fafc')
  const surface    = normalizeHex(design.surface, '#ffffff')
  const text       = normalizeHex(design.text, '#0f172a')
  const textMuted  = normalizeHex(design.textMuted, '#475569')

  const isDark     = design.mode === 'dark'
  const gradient   = getGradient({ accent, accentGrad })
  const accentSoft = accent + (isDark ? '29' : '18')
  const accentMed  = accent + (isDark ? '44' : '2c')
  const border     = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(15, 23, 42, 0.09)'
  const cardShadow = isDark
    ? '0 4px 20px rgba(0, 0, 0, 0.35)'
    : '0 2px 12px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.04)'

  const font    = FONT_OPTIONS.find(f => f.id === design.font) || FONT_OPTIONS[0]
  const spacing = SPACING_OPTIONS.find(sp => sp.id === design.spacing) || SPACING_OPTIONS[1]
  const sp      = spacing.scale

  const bHeight = BANNER_HEIGHTS[banner?.height || 'medium'] || BANNER_HEIGHTS.medium
  const secGap  = Math.round(38 * sp)
  const cardPad = Math.round(22 * sp)
  const mainPad = Math.round(36 * sp)

  const mobileRules = `
    ${s}.pf-shell--sidebar {
      grid-template-columns: 1fr;
      padding: 0 0 ${Math.round(36 * sp)}px;
      gap: ${Math.round(24 * sp)}px;
    }
    ${s}.pf-shell--sidebar .pf-sidebar-card {
      position: static;
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-top: none;
    }
    ${s}.pf-shell--sidebar .pf-main {
      padding: 0 18px;
    }
    ${s}.pf-container {
      padding: 0 18px;
    }
    ${s}.pf-banner-wrap {
      height: ${bHeight.mobile}px;
    }
    ${s}.pf-projects--grid {
      grid-template-columns: 1fr;
    }
    ${s}.pf-profile-row {
      flex-direction: column;
      align-items: ${design.headerAlign === 'left' ? 'flex-start' : 'center'};
      text-align: ${design.headerAlign === 'left' ? 'left' : 'center'};
    }
    ${s}.pf-name {
      font-size: 26px;
    }
    ${s}.pf-avatar--overlap {
      width: 92px;
      height: 92px;
      margin-top: -46px;
    }
    ${s}.pf-proj-top {
      flex-direction: column;
      gap: 8px;
    }
    ${s}.pf-exp-top {
      flex-direction: column;
      gap: 4px;
    }
    ${s}.pf-contact-actions {
      flex-direction: column;
      align-items: stretch;
    }
    ${s}.pf-contact-btn {
      justify-content: center;
    }
  `

  return `
    ${rootSel} {
      font-family: ${font.family};
      font-size: 15.5px;
      line-height: 1.65;
      color: ${text};
      background-color: ${bg};
      min-height: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 220ms ease, color 220ms ease;
    }

    ${rootSel} *, ${rootSel} *::before, ${rootSel} *::after {
      box-sizing: border-box;
    }

    ${s}h1, ${s}h2, ${s}h3, ${s}p, ${s}ul {
      margin: 0;
    }

    ${s}a {
      color: ${accent};
      text-decoration: none;
    }

    ${s}a:hover {
      text-decoration: underline;
    }

    /* ── Banner ── */
    ${s}.pf-banner-wrap {
      position: relative;
      width: 100%;
      height: ${bHeight.desktop}px;
      overflow: hidden;
      background: ${gradient};
      transition: height 220ms ease;
    }

    ${s}.pf-banner-wrap--sidebar {
      height: ${bHeight.sidebar}px;
    }

    ${s}.pf-banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: object-position 150ms ease, transform 150ms ease;
    }

    ${s}.pf-banner-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.28) 100%);
      pointer-events: none;
    }

    ${s}.pf-accent-bar {
      height: 8px;
      width: 100%;
      background: ${gradient};
    }

    /* ── Containers ── */
    ${s}.pf-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 0 28px;
    }

    ${s}.pf-shell--sidebar {
      max-width: 1080px;
      margin: 0 auto;
      padding: ${Math.round(32 * sp)}px 24px ${Math.round(48 * sp)}px;
      display: grid;
      grid-template-columns: 310px minmax(0, 1fr);
      gap: ${Math.round(32 * sp)}px;
      align-items: start;
    }

    /* ── Profile Header (Centered & Left) ── */
    ${s}.pf-profile-head {
      padding-top: ${Math.round(24 * sp)}px;
      padding-bottom: ${Math.round(28 * sp)}px;
      border-bottom: 1px solid ${border};
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    ${s}.pf-profile-head--has-overlap {
      padding-top: 0;
    }

    ${s}.pf-profile-head--center {
      align-items: center;
      text-align: center;
    }

    ${s}.pf-profile-head--left {
      align-items: flex-start;
      text-align: left;
    }

    ${s}.pf-profile-row {
      display: flex;
      align-items: center;
      gap: 20px;
      width: 100%;
    }

    ${s}.pf-profile-row--center {
      flex-direction: column;
      text-align: center;
    }

    ${s}.pf-avatar {
      width: 104px;
      height: 104px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid ${bg};
      background: ${gradient};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, ${isDark ? '0.45' : '0.14'});
      flex-shrink: 0;
      position: relative;
      z-index: 2;
    }

    ${s}.pf-avatar--overlap {
      width: 112px;
      height: 112px;
      margin-top: -56px;
    }

    ${s}.pf-avatar--sidebar-overlap {
      width: 96px;
      height: 96px;
      margin-top: -48px;
      border-color: ${surface};
    }

    ${s}.pf-avatar--sidebar-inside {
      width: 92px;
      height: 92px;
      border-color: ${surface};
    }

    ${s}.pf-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    ${s}.pf-avatar-initials {
      font-size: 34px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    ${s}.pf-identity {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    ${s}.pf-name {
      font-size: 32px;
      font-weight: 800;
      color: ${text};
      letter-spacing: -0.025em;
      line-height: 1.15;
    }

    ${s}.pf-role {
      font-size: 16.5px;
      font-weight: 500;
      color: ${textMuted};
      line-height: 1.45;
    }

    ${s}.pf-meta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px 14px;
      margin-top: 4px;
    }

    ${s}.pf-meta-row--center {
      justify-content: center;
    }

    ${s}.pf-location {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 13.5px;
      color: ${textMuted};
    }

    ${s}.pf-availability {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 999px;
      background: ${accentSoft};
      color: ${accent};
    }

    ${s}.pf-availability-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${accent};
    }

    ${s}.pf-socials {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    ${s}.pf-socials--center {
      justify-content: center;
    }

    ${s}.pf-social-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 8px;
      background: ${surface};
      border: 1px solid ${border};
      color: ${text};
      font-size: 13px;
      font-weight: 600;
      transition: border-color 180ms ease, transform 180ms ease, color 180ms ease;
      text-decoration: none;
    }

    ${s}.pf-social-btn:hover {
      border-color: ${accent};
      color: ${accent};
      transform: translateY(-1px);
      text-decoration: none;
    }

    /* ── Sidebar Card ── */
    ${s}.pf-sidebar-card {
      position: sticky;
      top: 24px;
      background: ${surface};
      border: 1px solid ${border};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: ${cardShadow};
    }

    ${s}.pf-sidebar-body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    ${s}.pf-sidebar-body--center {
      align-items: center;
      text-align: center;
    }

    ${s}.pf-sidebar-body--has-overlap {
      padding-top: 0;
    }

    ${s}.pf-sidebar-card .pf-name {
      font-size: 24px;
    }

    ${s}.pf-sidebar-card .pf-role {
      font-size: 14.5px;
    }

    ${s}.pf-sidebar-card .pf-social-btn {
      background: ${bg};
      padding: 6px 10px;
      font-size: 12.5px;
    }

    /* ── Main Content & Sections ── */
    ${s}.pf-main {
      padding: ${mainPad}px 0 ${Math.round(48 * sp)}px;
      display: flex;
      flex-direction: column;
      gap: ${secGap}px;
      min-width: 0;
    }

    ${s}.pf-shell--sidebar .pf-main {
      padding: 0;
    }

    ${s}.pf-section {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    ${s}.pf-section-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: ${accent};
      padding-bottom: 10px;
      border-bottom: 1px solid ${border};
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ${s}.pf-section-title::before {
      content: '';
      width: 14px;
      height: 3px;
      border-radius: 2px;
      background: ${gradient};
      flex-shrink: 0;
    }

    /* ── About ── */
    ${s}.pf-bio {
      font-size: 15.5px;
      line-height: 1.75;
      color: ${text};
      white-space: pre-line;
    }

    /* ── Skills ── */
    ${s}.pf-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    ${s}.pf-skill-tag {
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      background: ${accentSoft};
      color: ${accent};
      border: 1px solid ${accentMed};
    }

    /* ── Cards (Projects, Experience, Education, Achievements) ── */
    ${s}.pf-card-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    ${s}.pf-projects--grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    ${s}.pf-card {
      padding: ${cardPad}px;
      border-radius: 14px;
      background: ${surface};
      border: 1px solid ${border};
      box-shadow: ${cardShadow};
      transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    ${s}.pf-card--project {
      border-top: 3px solid ${accent};
    }

    ${s}.pf-card:hover {
      transform: translateY(-2px);
      border-color: ${accentMed};
    }

    ${s}.pf-proj-top,
    ${s}.pf-exp-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    ${s}.pf-card-title {
      font-size: 17px;
      font-weight: 700;
      color: ${text};
      letter-spacing: -0.01em;
      line-height: 1.3;
    }

    ${s}.pf-card-sub {
      font-size: 14px;
      font-weight: 600;
      color: ${accent};
    }

    ${s}.pf-card-meta {
      font-size: 12.5px;
      font-weight: 600;
      color: ${textMuted};
      white-space: nowrap;
    }

    ${s}.pf-card-desc {
      font-size: 14.5px;
      line-height: 1.65;
      color: ${textMuted};
      white-space: pre-line;
    }

    ${s}.pf-proj-links {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    ${s}.pf-proj-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 7px;
      background: ${accentSoft};
      color: ${accent};
      text-decoration: none;
      transition: background 160ms ease;
    }

    ${s}.pf-proj-link:hover {
      background: ${accentMed};
      text-decoration: none;
    }

    ${s}.pf-tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }

    ${s}.pf-tech-tag {
      font-size: 11.5px;
      font-weight: 600;
      padding: 2px 9px;
      border-radius: 5px;
      border: 1px solid ${border};
      color: ${textMuted};
      background: ${bg};
    }

    /* ── Languages ── */
    ${s}.pf-lang-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 10px;
    }

    ${s}.pf-lang-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      background: ${surface};
      border: 1px solid ${border};
    }

    ${s}.pf-lang-name {
      font-size: 14.5px;
      font-weight: 700;
      color: ${text};
    }

    ${s}.pf-lang-level {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 9px;
      border-radius: 999px;
      background: ${accentSoft};
      color: ${accent};
    }

    /* ── Contact ── */
    ${s}.pf-contact-box {
      padding: ${cardPad}px;
      border-radius: 14px;
      background: ${surface};
      border: 1px solid ${border};
      box-shadow: ${cardShadow};
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    ${s}.pf-contact-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    ${s}.pf-contact-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 20px;
      border-radius: 10px;
      background: ${gradient};
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    ${s}.pf-contact-btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
      text-decoration: none;
    }

    ${s}.pf-contact-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      background: ${bg};
      border: 1px solid ${border};
      color: ${text};
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
    }

    ${s}.pf-contact-secondary:hover {
      border-color: ${accent};
      color: ${accent};
      text-decoration: none;
    }

    /* ── Footer ── */
    ${s}.pf-footer {
      text-align: center;
      padding: 24px 20px 32px;
      border-top: 1px solid ${border};
      font-size: 12.5px;
      color: ${textMuted};
    }

    ${forceMobile ? mobileRules : `@media (max-width: 760px) { ${mobileRules} }`}

    @media (prefers-reduced-motion: reduce) {
      ${rootSel}, ${s}*, ${s}*::before, ${s}*::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `
}
