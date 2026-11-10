import { useState } from 'react'
import { SECTION_CATALOG, LANGUAGE_LEVELS } from '../data.js'
import FieldGroup from './FieldGroup.jsx'
import ProjectCard from './ProjectCard.jsx'
import SkillsInput from './SkillsInput.jsx'
import './SectionEditor.css'

/**
 * Reusable item-card list for Experience, Education, Achievements, and Languages.
 */
function ItemList({ items, emptyLabel, addLabel, onAdd, onRemove, onMove, renderItem, getTitle }) {
  return (
    <div className="sec-item-list">
      {items.length === 0 && (
        <p className="sec-empty-note">{emptyLabel}</p>
      )}
      {items.map((item, idx) => (
        <div key={item.id} className="sec-subcard">
          <div className="sec-subcard-head">
            <span className="sec-subcard-title">{getTitle(item, idx)}</span>
            <div className="sec-subcard-actions">
              <button
                type="button"
                className="reorder-btn"
                onClick={() => onMove(item.id, -1)}
                disabled={idx === 0}
                aria-label="Move item up"
                title="Move up"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </button>
              <button
                type="button"
                className="reorder-btn"
                onClick={() => onMove(item.id, 1)}
                disabled={idx === items.length - 1}
                aria-label="Move item down"
                title="Move down"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <button
                type="button"
                className="project-remove-btn"
                onClick={() => onRemove(item.id)}
                aria-label="Remove item"
                title="Remove"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="sec-subcard-body">
            {renderItem(item)}
          </div>
        </div>
      ))}
      <button type="button" className="add-project-btn" onClick={onAdd}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        {addLabel}
      </button>
    </div>
  )
}

export default function SectionEditor({
  data,
  onUpdateField,
  onAddSection,
  onRemoveSection,
  onMoveSection,
  onToggleSectionVisibility,
  onRenameSection,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem,
  onMoveListItem,
}) {
  const [expandedId, setExpandedId] = useState(data.sections?.[0]?.id || 'sec-about')
  const [showAddMenu, setShowAddMenu] = useState(false)

  const sections = data.sections || []
  const activeTypes = new Set(sections.map(s => s.type))
  const availableToAdd = SECTION_CATALOG.filter(c => !activeTypes.has(c.type))

  const getItemCount = (type) => {
    if (type === 'projects') return `${data.projects?.length || 0}`
    if (type === 'experience') return `${data.experience?.length || 0}`
    if (type === 'education') return `${data.education?.length || 0}`
    if (type === 'skills') return `${data.skills?.length || 0}`
    if (type === 'achievements') return `${data.achievements?.length || 0}`
    if (type === 'languages') return `${data.languages?.length || 0}`
    return null
  }

  const handleAddSectionClick = (type) => {
    const newId = onAddSection(type)
    if (newId) setExpandedId(newId)
    setShowAddMenu(false)
  }

  const renderSectionBody = (sec) => {
    switch (sec.type) {
      case 'about':
        return (
          <FieldGroup label="Bio" hint="2–4 sentences summarizing your background and what you build">
            <textarea
              className="field-input field-textarea"
              value={data.bio}
              onChange={e => onUpdateField('bio', e.target.value)}
              placeholder="Tell recruiters or clients what you specialize in…"
              rows={4}
              maxLength={800}
            />
            <span className="char-count">{(data.bio || '').length}/800</span>
          </FieldGroup>
        )

      case 'projects':
        return (
          <div className="sec-item-list">
            {(data.projects || []).length === 0 && (
              <p className="sec-empty-note">No projects yet. Click "Add Project" to showcase your work.</p>
            )}
            {(data.projects || []).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                total={data.projects.length}
                onChange={(field, val) => onUpdateListItem('projects', project.id, field, val)}
                onRemove={() => onRemoveListItem('projects', project.id)}
                onMoveUp={() => onMoveListItem('projects', project.id, -1)}
                onMoveDown={() => onMoveListItem('projects', project.id, 1)}
              />
            ))}
            <button
              type="button"
              className="add-project-btn"
              onClick={() => onAddListItem('projects', { title: '', year: '', description: '', tech: '', link: '', demo: '' })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Project
            </button>
          </div>
        )

      case 'experience':
        return (
          <ItemList
            items={data.experience || []}
            emptyLabel="No roles added yet."
            addLabel="Add Experience"
            onAdd={() => onAddListItem('experience', { role: '', company: '', period: '', location: '', description: '' })}
            onRemove={(id) => onRemoveListItem('experience', id)}
            onMove={(id, dir) => onMoveListItem('experience', id, dir)}
            getTitle={(item, i) => item.role || item.company || `Role #${i + 1}`}
            renderItem={(item) => (
              <>
                <div className="sec-grid-2">
                  <div className="project-field">
                    <label className="project-field-label">Role / Position</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.role}
                      onChange={e => onUpdateListItem('experience', item.id, 'role', e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                  <div className="project-field">
                    <label className="project-field-label">Company</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.company}
                      onChange={e => onUpdateListItem('experience', item.id, 'company', e.target.value)}
                      placeholder="e.g. Northstar Cloud"
                    />
                  </div>
                </div>
                <div className="sec-grid-2">
                  <div className="project-field">
                    <label className="project-field-label">Dates</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.period}
                      onChange={e => onUpdateListItem('experience', item.id, 'period', e.target.value)}
                      placeholder="e.g. 2023 – Present"
                    />
                  </div>
                  <div className="project-field">
                    <label className="project-field-label">Location</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.location}
                      onChange={e => onUpdateListItem('experience', item.id, 'location', e.target.value)}
                      placeholder="e.g. Remote"
                    />
                  </div>
                </div>
                <div className="project-field">
                  <label className="project-field-label">Key Impact & Responsibilities</label>
                  <textarea
                    className="field-input field-textarea"
                    rows={3}
                    value={item.description}
                    onChange={e => onUpdateListItem('experience', item.id, 'description', e.target.value)}
                    placeholder="Highlight outcomes, metrics, or technologies used…"
                  />
                </div>
              </>
            )}
          />
        )

      case 'education':
        return (
          <ItemList
            items={data.education || []}
            emptyLabel="No education entries yet."
            addLabel="Add Education"
            onAdd={() => onAddListItem('education', { degree: '', school: '', period: '', details: '' })}
            onRemove={(id) => onRemoveListItem('education', id)}
            onMove={(id, dir) => onMoveListItem('education', id, dir)}
            getTitle={(item, i) => item.degree || item.school || `Education #${i + 1}`}
            renderItem={(item) => (
              <>
                <div className="project-field">
                  <label className="project-field-label">Degree / Certificate</label>
                  <input
                    type="text"
                    className="field-input"
                    value={item.degree}
                    onChange={e => onUpdateListItem('education', item.id, 'degree', e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                  />
                </div>
                <div className="sec-grid-2">
                  <div className="project-field">
                    <label className="project-field-label">School / Institution</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.school}
                      onChange={e => onUpdateListItem('education', item.id, 'school', e.target.value)}
                      placeholder="e.g. UC Berkeley"
                    />
                  </div>
                  <div className="project-field">
                    <label className="project-field-label">Years</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.period}
                      onChange={e => onUpdateListItem('education', item.id, 'period', e.target.value)}
                      placeholder="e.g. 2016 – 2020"
                    />
                  </div>
                </div>
                <div className="project-field">
                  <label className="project-field-label">Notes / Focus (optional)</label>
                  <textarea
                    className="field-input field-textarea"
                    rows={2}
                    value={item.details}
                    onChange={e => onUpdateListItem('education', item.id, 'details', e.target.value)}
                    placeholder="Relevant coursework, honors, or thesis…"
                  />
                </div>
              </>
            )}
          />
        )

      case 'skills':
        return (
          <SkillsInput
            skills={data.skills || []}
            onChange={v => onUpdateField('skills', v)}
          />
        )

      case 'achievements':
        return (
          <ItemList
            items={data.achievements || []}
            emptyLabel="No achievements yet. Add awards, certifications, or speaking talks."
            addLabel="Add Achievement"
            onAdd={() => onAddListItem('achievements', { title: '', issuer: '', year: '', description: '' })}
            onRemove={(id) => onRemoveListItem('achievements', id)}
            onMove={(id, dir) => onMoveListItem('achievements', id, dir)}
            getTitle={(item, i) => item.title || `Achievement #${i + 1}`}
            renderItem={(item) => (
              <>
                <div className="project-field">
                  <label className="project-field-label">Title</label>
                  <input
                    type="text"
                    className="field-input"
                    value={item.title}
                    onChange={e => onUpdateListItem('achievements', item.id, 'title', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                </div>
                <div className="sec-grid-2">
                  <div className="project-field">
                    <label className="project-field-label">Issuer / Event</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.issuer}
                      onChange={e => onUpdateListItem('achievements', item.id, 'issuer', e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>
                  <div className="project-field">
                    <label className="project-field-label">Year</label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.year}
                      onChange={e => onUpdateListItem('achievements', item.id, 'year', e.target.value)}
                      placeholder="e.g. 2024"
                    />
                  </div>
                </div>
                <div className="project-field">
                  <label className="project-field-label">Description (optional)</label>
                  <textarea
                    className="field-input field-textarea"
                    rows={2}
                    value={item.description}
                    onChange={e => onUpdateListItem('achievements', item.id, 'description', e.target.value)}
                    placeholder="Brief context on this award or certification…"
                  />
                </div>
              </>
            )}
          />
        )

      case 'languages':
        return (
          <ItemList
            items={data.languages || []}
            emptyLabel="No languages listed yet."
            addLabel="Add Language"
            onAdd={() => onAddListItem('languages', { name: '', level: 'Fluent' })}
            onRemove={(id) => onRemoveListItem('languages', id)}
            onMove={(id, dir) => onMoveListItem('languages', id, dir)}
            getTitle={(item, i) => item.name || `Language #${i + 1}`}
            renderItem={(item) => (
              <div className="sec-grid-2">
                <div className="project-field">
                  <label className="project-field-label">Language</label>
                  <input
                    type="text"
                    className="field-input"
                    value={item.name}
                    onChange={e => onUpdateListItem('languages', item.id, 'name', e.target.value)}
                    placeholder="e.g. English"
                  />
                </div>
                <div className="project-field">
                  <label className="project-field-label">Proficiency</label>
                  <select
                    className="field-input"
                    value={LANGUAGE_LEVELS.includes(item.level) ? item.level : 'Fluent'}
                    onChange={e => onUpdateListItem('languages', item.id, 'level', e.target.value)}
                  >
                    {LANGUAGE_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          />
        )

      case 'contact':
        return (
          <div className="sec-item-list">
            <FieldGroup label="Call to Action Message" hint="Friendly invitation shown above your email button">
              <textarea
                className="field-input field-textarea"
                rows={3}
                value={data.contactNote || ''}
                onChange={e => onUpdateField('contactNote', e.target.value)}
                placeholder="e.g. Looking for a product-minded engineer? My inbox is open."
              />
            </FieldGroup>
            <div className="sec-grid-2">
              <FieldGroup label="Email">
                <input
                  type="email"
                  className="field-input"
                  value={data.email || ''}
                  onChange={e => onUpdateField('email', e.target.value)}
                  placeholder="hello@example.com"
                />
              </FieldGroup>
              <FieldGroup label="Phone (optional)">
                <input
                  type="tel"
                  className="field-input"
                  value={data.phone || ''}
                  onChange={e => onUpdateField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </FieldGroup>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="sections-editor">
      <div className="sections-topbar">
        <div>
          <p className="sections-summary">
            <strong>{sections.filter(s => s.visible !== false).length}</strong> visible ·{' '}
            <strong>{sections.length}</strong> total
          </p>
        </div>

        <div className="add-sec-wrap">
          <button
            type="button"
            className="add-sec-trigger"
            onClick={() => setShowAddMenu(v => !v)}
            aria-expanded={showAddMenu}
            disabled={availableToAdd.length === 0}
            title={availableToAdd.length === 0 ? 'All section types are added' : 'Add a portfolio section'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add section
          </button>

          {showAddMenu && availableToAdd.length > 0 && (
            <div className="add-sec-menu" role="menu" aria-label="Available portfolio sections">
              {availableToAdd.map(item => (
                <button
                  key={item.type}
                  type="button"
                  role="menuitem"
                  className="add-sec-option"
                  onClick={() => handleAddSectionClick(item.type)}
                >
                  <span className="add-sec-icon">{item.icon}</span>
                  <span className="add-sec-info">
                    <span className="add-sec-name">{item.defaultTitle}</span>
                    <span className="add-sec-hint">{item.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {sections.length === 0 && (
        <div className="sec-empty-box">
          <p>No sections yet. Use <strong>+ Add section</strong> above to build your portfolio.</p>
        </div>
      )}

      <div className="sections-accordion">
        {sections.map((sec, idx) => {
          const meta = SECTION_CATALOG.find(c => c.type === sec.type) || { icon: '📄' }
          const isExpanded = expandedId === sec.id
          const isVisible = sec.visible !== false
          const count = getItemCount(sec.type)

          return (
            <div
              key={sec.id}
              className={`sec-card${isExpanded ? ' expanded' : ''}${!isVisible ? ' hidden-sec' : ''}`}
            >
              <div className="sec-card-header">
                <button
                  type="button"
                  className="sec-card-toggle"
                  onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="sec-card-icon">{meta.icon}</span>
                  <span className="sec-card-name">{sec.title}</span>
                  {count !== null && <span className="sec-count-badge">{count}</span>}
                  {!isVisible && <span className="sec-hidden-badge">Hidden</span>}
                </button>

                <div className="sec-card-controls">
                  <button
                    type="button"
                    className="sec-ctrl-btn"
                    onClick={() => onMoveSection(sec.id, -1)}
                    disabled={idx === 0}
                    aria-label={`Move ${sec.title} up`}
                    title="Move section up"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="sec-ctrl-btn"
                    onClick={() => onMoveSection(sec.id, 1)}
                    disabled={idx === sections.length - 1}
                    aria-label={`Move ${sec.title} down`}
                    title="Move section down"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`sec-ctrl-btn${!isVisible ? ' active-muted' : ''}`}
                    onClick={() => onToggleSectionVisibility(sec.id)}
                    aria-label={isVisible ? `Hide ${sec.title}` : `Show ${sec.title}`}
                    title={isVisible ? 'Hide section (keeps content)' : 'Show section'}
                  >
                    {isVisible ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    className="sec-ctrl-btn danger"
                    onClick={() => onRemoveSection(sec.id)}
                    aria-label={`Remove ${sec.title} section`}
                    title="Remove section"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="sec-card-body">
                  <div className="sec-heading-edit">
                    <label className="project-field-label" htmlFor={`title-${sec.id}`}>
                      Section Heading
                    </label>
                    <input
                      id={`title-${sec.id}`}
                      type="text"
                      className="field-input"
                      value={sec.title}
                      onChange={e => onRenameSection(sec.id, e.target.value)}
                      maxLength={40}
                    />
                  </div>
                  {renderSectionBody(sec)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
