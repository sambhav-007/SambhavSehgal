import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const PROJECTS = [
  {
    title: 'AADAT',
    sub: 'AI-Powered Social Space for Habit Tracking',
    type: 'Featured Project · Full-Stack SaaS',
    color: '#a855f7',
    gradient: 'linear-gradient(90deg,#7c3aed,#a855f7)',
    points: [
      'Built a gamified habit tracking platform with XP levels, streaks, and achievements',
      'Integrated Gemini AI for personalized habit insights and suggestions',
      'Implemented secure auth with JWT, OAuth2, and email workflows',
    ],
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'Gemini AI'],
    link: 'https://github.com/Shivinazad/Aadat-A-Social-Space-for-Habbit-Tracking',
  },
  {
    title: 'SkyEye',
    sub: 'Face-Based Attendance System',
    type: 'Project · AI / Computer Vision',
    color: '#06b6d4',
    gradient: 'linear-gradient(90deg,#06b6d4,#0ea5e9)',
    points: [
      'Developed an automated classroom attendance system using facial recognition',
      'Processes ~80 students in under 2 minutes with real-time detection',
      'Exports attendance data via CSV with session management',
    ],
    tech: ['Python', 'OpenCV', 'Machine Learning'],
    link: 'https://github.com/sambhav-007/SkyEye',
  },
  {
    title: 'Dua Property',
    sub: 'Real Estate Web Platform',
    type: 'Client Project · Full-Stack',
    color: '#f59e0b',
    gradient: 'linear-gradient(90deg,#d97706,#f59e0b)',
    points: [
      'Built SEO-optimized property listing platform for a real estate client',
      'Developed lead capture forms and client workflow automation',
      'Created responsive landing pages for real estate marketing',
    ],
    tech: ['React', 'Node.js', 'MongoDB'],
    link: 'https://www.duaproperty.com',
  },
  {
    title: 'OCR Screenshot to Excel',
    sub: 'Automation Tool',
    type: 'Project · Python Automation',
    color: '#22c55e',
    gradient: 'linear-gradient(90deg,#16a34a,#22c55e)',
    points: [
      'Built Python automation to extract phone numbers from 500+ screenshots',
      'Used OCR and image preprocessing to eliminate manual data entry',
      'Exported results directly into structured Excel sheets',
    ],
    tech: ['Python', 'EasyOCR', 'OpenCV'],
    link: 'https://github.com/sambhav-007/PhoneNumberExtractor',
  },
]

function Content() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14, height: '100%' }}>
      {PROJECTS.map((p) => (
        <div key={p.title} className={s.projCard} style={{ '--c': p.gradient, position: 'relative' }}>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 7,
                background: `${p.color}18`,
                border: `1px solid ${p.color}40`,
                color: p.color,
                textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${p.color}30`; e.currentTarget.style.borderColor = p.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${p.color}18`; e.currentTarget.style.borderColor = `${p.color}40`; }}
              title={`View ${p.title}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}
          <div>
            <div className={s.projType} style={{ color: p.color }}>{p.type}</div>
            <div className={s.projTitle} style={{ fontSize: '1.1rem' }}>{p.title}</div>
            <div className={s.projSub}>{p.sub}</div>
          </div>
          <ul className={s.projPoints} style={{ flex: 1 }}>
            {p.points.map((pt) => (
              <li key={pt}>
                <span style={{ color: p.color }}>▸</span>
                {pt}
              </li>
            ))}
          </ul>
          <div className={s.stackRow}>
            {p.tech.map((t) => (
              <span key={t} className={s.stackTag}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProjectsSlide() {
  return (
    <TunnelSlide
      tag="// projects"
      title="Things I've Built"
      full={<Content />}
    />
  )
}
