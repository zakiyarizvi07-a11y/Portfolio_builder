import { useState, useRef, useCallback } from 'react'
import './SkillsInput.css'

const SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Vue', 'Angular', 'Svelte',
  'Node.js', 'Express', 'Next.js', 'Nuxt', 'Remix', 'Vite',
  'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap',
  'GraphQL', 'REST API', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify',
  'Git', 'GitHub', 'CI/CD', 'Jest', 'Cypress', 'Vitest',
  'Figma', 'Photoshop', 'Illustrator', 'Three.js', 'WebGL',
  'Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'C#', 'PHP', 'Ruby',
]

export default function SkillsInput({ skills, onChange }) {
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim()
    if (!trimmed || skills.includes(trimmed)) return
    onChange([...skills, trimmed])
  }, [skills, onChange])

  const removeSkill = useCallback((skill) => {
    onChange(skills.filter(s => s !== skill))
  }, [skills, onChange])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputValue)
      setInputValue('')
    } else if (e.key === 'Backspace' && inputValue === '' && skills.length > 0) {
      onChange(skills.slice(0, -1))
    }
  }, [inputValue, addSkill, skills, onChange])

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    inputValue.length > 0 &&
    s.toLowerCase().includes(inputValue.toLowerCase()) &&
    !skills.includes(s)
  ).slice(0, 6)

  return (
    <div className="skills-input-wrapper">
      <div
        className={`skills-box${focused ? ' focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-label="Skills"
      >
        {skills.map(skill => (
          <span key={skill} className="skill-tag">
            {skill}
            <button
              className="skill-remove"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill) }}
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="skills-text-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (inputValue.trim()) { addSkill(inputValue); setInputValue('') } }}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : 'Add more…'}
          aria-label="Skill input"
        />
      </div>

      {/* Suggestions dropdown */}
      {focused && filteredSuggestions.length > 0 && (
        <ul className="skill-suggestions" role="listbox" aria-label="Skill suggestions">
          {filteredSuggestions.map(s => (
            <li key={s}>
              <button
                className="skill-suggestion-btn"
                onMouseDown={e => { e.preventDefault(); addSkill(s); setInputValue('') }}
                role="option"
                aria-selected="false"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="skills-meta">
        <span className="skills-count">{skills.length} {skills.length === 1 ? 'skill' : 'skills'}</span>
        {skills.length === 0 && (
          <span className="skills-hint">Try: React, Node.js, Python…</span>
        )}
      </div>

      {/* Quick-add popular */}
      <div className="skills-quick">
        <span className="skills-quick-label">Quick add:</span>
        {['React', 'TypeScript', 'Node.js', 'Python', 'Figma'].filter(s => !skills.includes(s)).slice(0, 4).map(s => (
          <button key={s} type="button" className="skill-quick-btn" onClick={() => addSkill(s)}>
            + {s}
          </button>
        ))}
      </div>
    </div>
  )
}
