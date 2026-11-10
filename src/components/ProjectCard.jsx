import { useState } from 'react'
import './ProjectCard.css'

export default function ProjectCard({
  project, index, total,
  onChange, onRemove, onMoveUp, onMoveDown,
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div
          className="project-card-title-row"
          onClick={() => setExpanded(v => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setExpanded(v => !v)
            }
          }}
          aria-expanded={expanded}
        >
          <span className="project-number">#{index + 1}</span>
          <span className="project-name-preview">
            {project.title || 'Untitled Project'}
          </span>
        </div>

        <div className="project-card-actions">
          <div className="reorder-btns" role="group" aria-label="Reorder project">
            <button
              type="button"
              className="reorder-btn"
              onClick={onMoveUp}
              disabled={index === 0}
              aria-label="Move project up"
              title="Move up"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
            <button
              type="button"
              className="reorder-btn"
              onClick={onMoveDown}
              disabled={index === total - 1}
              aria-label="Move project down"
              title="Move down"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="project-toggle-btn"
            onClick={() => setExpanded(v => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse project' : 'Expand project'}
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 180ms ease' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <button
            type="button"
            className="project-remove-btn"
            onClick={onRemove}
            aria-label={`Remove ${project.title || `project ${index + 1}`}`}
            title="Remove project"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="project-card-body">
          <div className="project-links-row">
            <div className="project-field">
              <label className="project-field-label">Title <span className="req">*</span></label>
              <input
                type="text"
                className="field-input"
                value={project.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="e.g. TaskFlow"
                maxLength={70}
              />
            </div>
            <div className="project-field" style={{ maxWidth: '110px' }}>
              <label className="project-field-label">Year</label>
              <input
                type="text"
                className="field-input"
                value={project.year || ''}
                onChange={e => onChange('year', e.target.value)}
                placeholder="e.g. 2025"
                maxLength={20}
              />
            </div>
          </div>

          <div className="project-field">
            <label className="project-field-label">Description</label>
            <textarea
              className="field-input field-textarea"
              value={project.description}
              onChange={e => onChange('description', e.target.value)}
              placeholder="What does it do? What impact did it have?"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="project-field">
            <label className="project-field-label">Tech Stack (comma-separated)</label>
            <input
              type="text"
              className="field-input"
              value={project.tech}
              onChange={e => onChange('tech', e.target.value)}
              placeholder="e.g. React, TypeScript, PostgreSQL"
              maxLength={140}
            />
          </div>

          <div className="project-links-row">
            <div className="project-field">
              <label className="project-field-label">Repository URL</label>
              <input
                type="url"
                className="field-input"
                value={project.link}
                onChange={e => onChange('link', e.target.value)}
                placeholder="https://github.com/…"
              />
            </div>
            <div className="project-field">
              <label className="project-field-label">Live Demo URL</label>
              <input
                type="url"
                className="field-input"
                value={project.demo}
                onChange={e => onChange('demo', e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
