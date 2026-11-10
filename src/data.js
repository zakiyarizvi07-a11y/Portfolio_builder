// ─── Section Catalog (all 8 supported portfolio sections) ──────────────────
export const SECTION_CATALOG = [
  { type: 'about',        defaultTitle: 'About Me',     icon: '👤', hint: 'Short intro and career focus' },
  { type: 'projects',     defaultTitle: 'Projects',     icon: '🚀', hint: 'Selected work with links & tech' },
  { type: 'experience',   defaultTitle: 'Experience',   icon: '💼', hint: 'Roles, companies, and impact' },
  { type: 'education',    defaultTitle: 'Education',    icon: '🎓', hint: 'Degrees, bootcamps, or coursework' },
  { type: 'skills',       defaultTitle: 'Skills',       icon: '🛠️', hint: 'Tools, languages, and frameworks' },
  { type: 'achievements', defaultTitle: 'Achievements', icon: '🏆', hint: 'Awards, certifications, or milestones' },
  { type: 'languages',    defaultTitle: 'Languages',    icon: '🌐', hint: 'Spoken languages & proficiency' },
  { type: 'contact',      defaultTitle: 'Get in Touch', icon: '✉️', hint: 'Email, phone, and call to action' },
]

export const DEFAULT_SECTIONS = [
  { id: 'sec-about',      type: 'about',      title: 'About Me',     visible: true },
  { id: 'sec-projects',   type: 'projects',   title: 'Projects',     visible: true },
  { id: 'sec-experience', type: 'experience', title: 'Experience',   visible: true },
  { id: 'sec-skills',     type: 'skills',     title: 'Skills',       visible: true },
  { id: 'sec-education',  type: 'education',  title: 'Education',    visible: true },
  { id: 'sec-contact',    type: 'contact',    title: 'Get in Touch', visible: true },
]

// ─── Default Content ─────────────────────────────────────────────────────────
export const DEFAULT_DATA = {
  name: 'Alex Rivera',
  role: 'Senior Full-Stack Engineer & Product Designer',
  location: 'San Francisco, CA',
  availability: 'Open to new opportunities',
  email: 'alex.rivera@example.com',
  phone: '',
  photo: '',
  banner: {
    type: 'preset',     // 'preset' | 'upload' | 'none'
    presetId: 'waves',
    customImage: '',
    posX: 50,
    posY: 50,
    zoom: 100,
    height: 'medium',   // 'short' | 'medium' | 'tall'
  },
  bio: 'I design and build fast, accessible web products from concept to production. Over the past 6 years I have led frontend architecture, shipped collaborative SaaS tools, and partnered closely with founders and product teams.',
  contactNote: 'Looking for a product-minded engineer or want to collaborate on something new? My inbox is always open.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  website: 'https://example.com',

  sections: DEFAULT_SECTIONS,

  projects: [
    {
      id: 'proj-1',
      title: 'TaskFlow',
      year: '2025',
      description: 'Collaborative sprint and workflow workspace with real-time kanban boards, keyboard shortcuts, and automated weekly digests.',
      tech: 'React, TypeScript, Node.js, PostgreSQL',
      link: 'https://github.com',
      demo: 'https://example.com',
    },
    {
      id: 'proj-2',
      title: 'PixelCraft Studio',
      year: '2024',
      description: 'Browser-based sprite and pixel-art editor supporting onion-skin animation frames, custom palettes, and instant GIF export.',
      tech: 'TypeScript, HTML5 Canvas, Vite',
      link: 'https://github.com',
      demo: 'https://example.com',
    },
    {
      id: 'proj-3',
      title: 'PulseMetrics',
      year: '2023',
      description: 'Lightweight uptime and Core Web Vitals dashboard built for indie teams with zero-config alerting.',
      tech: 'React, Go, SQLite',
      link: 'https://github.com',
      demo: '',
    },
  ],

  experience: [
    {
      id: 'exp-1',
      role: 'Senior Frontend Engineer',
      company: 'Northstar Cloud',
      period: '2023 – Present',
      location: 'San Francisco, CA',
      description: 'Architected the component design system used across 4 product squads, cutting bundle size by 34% and improving accessibility compliance.',
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Developer',
      company: 'Beacon Studio',
      period: '2020 – 2023',
      location: 'Remote',
      description: 'Built client web applications end-to-end with React, Node.js, and PostgreSQL, mentoring 3 junior engineers.',
    },
  ],

  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      period: '2016 – 2020',
      details: 'Focus on Human-Computer Interaction, Web Systems, and Software Engineering.',
    },
  ],

  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'CSS Architecture', 'Figma', 'Accessibility', 'AWS'],

  achievements: [
    {
      id: 'ach-1',
      title: '1st Place — Open Web Accessibility Challenge',
      issuer: 'WebDev Summit',
      year: '2024',
      description: 'Awarded for building an offline-first keyboard navigation toolkit.',
    },
    {
      id: 'ach-2',
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      year: '2023',
      description: 'Associate-level certification covering resilient cloud architecture.',
    },
  ],

  languages: [
    { id: 'lang-1', name: 'English', level: 'Native' },
    { id: 'lang-2', name: 'Spanish', level: 'Conversational' },
  ],
}

// ─── Design & Layout System ──────────────────────────────────────────────────
export const DEFAULT_DESIGN = {
  preset: 'indigo',
  mode: 'light',            // 'light' | 'dark'
  accent: '#4f46e5',
  accentGrad: '#7c3aed',
  bg: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textMuted: '#475569',
  font: 'inter',            // 'inter' | 'poppins' | 'georgia' | 'mono'
  spacing: 'normal',        // 'compact' | 'normal' | 'relaxed'
  layoutPreset: 'centered', // 'centered' | 'left' | 'sidebar'
  headerAlign: 'center',    // 'center' | 'left'
  photoPlacement: 'overlap',// 'overlap' | 'inside' | 'hidden'
  projectsLayout: 'stack',  // 'stack' | 'grid'
}

export const DESIGN_PRESETS = [
  {
    id: 'indigo',
    name: 'Indigo Studio',
    description: 'Clean & authoritative',
    swatch: ['#4f46e5', '#7c3aed'],
    design: {
      mode: 'light',
      accent: '#4f46e5', accentGrad: '#7c3aed',
      bg: '#f8fafc', surface: '#ffffff',
      text: '#0f172a', textMuted: '#475569',
      font: 'inter', spacing: 'normal',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Editorial',
    description: 'Fresh & approachable',
    swatch: ['#059669', '#0d9488'],
    design: {
      mode: 'light',
      accent: '#059669', accentGrad: '#0d9488',
      bg: '#f2fbf7', surface: '#ffffff',
      text: '#0f172a', textMuted: '#475569',
      font: 'poppins', spacing: 'normal',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    description: 'Dark & refined',
    swatch: ['#818cf8', '#38bdf8'],
    design: {
      mode: 'dark',
      accent: '#818cf8', accentGrad: '#38bdf8',
      bg: '#0b1120', surface: '#162032',
      text: '#f1f5f9', textMuted: '#94a3b8',
      font: 'inter', spacing: 'normal',
    },
  },
  {
    id: 'editorial',
    name: 'Classic Serif',
    description: 'Warm & timeless',
    swatch: ['#b45309', '#d97706'],
    design: {
      mode: 'light',
      accent: '#b45309', accentGrad: '#d97706',
      bg: '#fcfaf7', surface: '#ffffff',
      text: '#1c1917', textMuted: '#57534e',
      font: 'georgia', spacing: 'relaxed',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian Rose',
    description: 'Bold dark contrast',
    swatch: ['#fb7185', '#f97316'],
    design: {
      mode: 'dark',
      accent: '#fb7185', accentGrad: '#f97316',
      bg: '#121016', surface: '#1e1b24',
      text: '#fafaf9', textMuted: '#a8a29e',
      font: 'poppins', spacing: 'normal',
    },
  },
  {
    id: 'slate',
    name: 'Mono Minimal',
    description: 'Sharp & technical',
    swatch: ['#334155', '#64748b'],
    design: {
      mode: 'light',
      accent: '#334155', accentGrad: '#475569',
      bg: '#f8fafc', surface: '#ffffff',
      text: '#0f172a', textMuted: '#475569',
      font: 'mono', spacing: 'compact',
    },
  },
]

export const LAYOUT_PRESETS = [
  {
    id: 'centered',
    name: 'Centered',
    description: 'Balanced single column with centered header',
    defaults: { layoutPreset: 'centered', headerAlign: 'center', photoPlacement: 'overlap' },
  },
  {
    id: 'left',
    name: 'Left-Aligned',
    description: 'Editorial header aligned left for quick scanning',
    defaults: { layoutPreset: 'left', headerAlign: 'left', photoPlacement: 'overlap' },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Sticky profile column on desktop, stacked on mobile',
    defaults: { layoutPreset: 'sidebar', headerAlign: 'left', photoPlacement: 'inside' },
  },
]

export const FONT_OPTIONS = [
  { id: 'inter',   name: 'Sans Clean',  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", sample: 'Aa' },
  { id: 'poppins', name: 'Geometric',   family: "'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif", sample: 'Aa' },
  { id: 'georgia', name: 'Classic Serif', family: "Georgia, 'Times New Roman', Cambria, serif", sample: 'Aa' },
  { id: 'mono',    name: 'Monospace',   family: "'Cascadia Code', 'SFMono-Regular', Consolas, 'Courier New', monospace", sample: 'Aa' },
]

export const SPACING_OPTIONS = [
  { id: 'compact', name: 'Compact', scale: 0.78 },
  { id: 'normal',  name: 'Normal',  scale: 1 },
  { id: 'relaxed', name: 'Relaxed', scale: 1.28 },
]

export const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic']

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getGradient(design) {
  return `linear-gradient(135deg, ${design.accent} 0%, ${design.accentGrad} 100%)`
}

export function normalizeHex(hex, fallback = '#4f46e5') {
  if (!hex || typeof hex !== 'string') return fallback
  const clean = hex.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) return clean
  if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
    return '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3]
  }
  return fallback
}

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^(https?:|mailto:|tel:|#)/i.test(trimmed)) return trimmed
  if (/^data:image\//i.test(trimmed)) return trimmed
  // If user omitted protocol (e.g., "github.com/alex"), default safely to https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return `https://${trimmed}`
  }
  return ''
}

export const STORAGE_KEY = 'portfolio-builder-v3'

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('portfolio-builder-v2')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveDraft(data, design) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, design }))
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err?.name === 'QuotaExceededError' ? 'Storage full — try smaller images.' : 'Could not save draft.' }
  }
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('portfolio-builder-v2')
}

export function generateId(prefix = 'item') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
