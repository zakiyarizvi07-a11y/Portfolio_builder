# Portfolio Builder

A clean, interactive personal website builder built with **React 18** and **Vite 6**. Customize your profile, banner, sections, layout, and visual theme with an instant live preview — then export a complete, self-contained HTML portfolio that works offline and is ready to share or host anywhere.

## Features

- **Flexible Sections**: Add, remove, hide/show (without deleting content), rename, and reorder sections: **About, Projects, Experience, Education, Skills, Achievements, Languages, and Contact**.
- **Unlimited Projects**: Add, edit, reorder, and remove any number of projects with links, year, and tech stack tags.
- **Profile & Banner Images**: Upload a circular profile photo and a wide banner image (or pick from 5 built-in offline banners), with focal position, zoom, and height controls.
- **Layout Controls**: Switch between **Centered**, **Left-Aligned**, and **Sidebar** layouts, adjust photo placement, header alignment, and project grid style.
- **Design Customization**: 6 starter presets, Light/Dark appearance, custom color pickers with editable hex inputs, offline-safe typography, spacing scales, and per-group **Reset to preset** buttons.
- **Live & Full-Screen Preview**: Toggle Desktop/Mobile viewport sizes or open a full-screen preview with instant exit (`Esc` or button).
- **Standalone HTML Export**: Downloads a single `.html` file with all CSS, SVG icons, and images embedded — works offline with zero external dependencies.
- **Auto-Save & Accessibility**: Saves drafts to `localStorage`, supports full keyboard navigation, and respects `prefers-reduced-motion`.

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data.js                 Defaults, section catalog, presets, draft storage
    ├── styles/
    │   ├── globals.css         Base reset, builder CSS variables, reduced motion
    │   └── app.css             Responsive two-column builder shell
    ├── utils/
    │   ├── banners.js          Built-in offline SVG banner data URIs
    │   ├── imageHelpers.js     Client-side image sizing for draft & export
    │   ├── portfolioStyles.js  Shared CSS generator (live preview + HTML export)
    │   └── generateHTML.js     Self-contained HTML generator with escaping
    └── components/
        ├── Header.jsx/css          Top bar, save indicator, full-screen, reset, export
        ├── FormPanel.jsx/css       4-tab editor (Profile, Sections, Layout, Design)
        ├── FieldGroup.jsx/css      Accessible labelled input wrapper
        ├── BannerEditor.jsx/css    Built-in/custom banner & focal crop controls
        ├── SectionEditor.jsx/css   Add, reorder, hide, remove & edit all 8 sections
        ├── ProjectCard.jsx/css     Collapsible project editor with reorder
        ├── SkillsInput.jsx/css     Tag-style skills editor with suggestions
        ├── LayoutPanel.jsx/css     Layout presets & element placement controls
        ├── DesignPanel.jsx/css     Presets, light/dark, hex colors, fonts, spacing
        └── PreviewPanel.jsx/css    Desktop/mobile viewport & full-screen preview
```

## Getting Started

### Quick Start (Windows)

Double-click **`Start Portfolio Builder.bat`** in the project folder. It automatically locates Node.js, installs dependencies if missing, starts the Vite localhost server, and opens the app in your default browser.

### Manual Setup

#### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

#### Install

```bash
npm install
```

### Run (Development)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build (Production)

```bash
npm run build
```

Production assets are output to `dist/`, ready to deploy to GitHub Pages, Netlify, Vercel, or any static host.

### Preview Production Build

```bash
npm run preview
```

## Exporting & Sharing

Click **Download HTML** in the top bar to save `<your-name>-portfolio.html`. The exported file embeds all styles, icons, and uploaded images directly so it opens cleanly offline and can be hosted as a single `index.html` file on GitHub Pages or Netlify Drop.
