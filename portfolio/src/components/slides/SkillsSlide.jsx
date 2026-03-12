import { motion } from 'framer-motion'
import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

// ── Honest, single-tech bars ─────────────────────────────────────────────────
const BARS = [
  { name: 'Java',        pct: 82, color: 'linear-gradient(90deg,#a855f7,#7c3aed)' },
  { name: 'JavaScript',  pct: 80, color: 'linear-gradient(90deg,#eab308,#f59e0b)' },
  { name: 'React',       pct: 78, color: 'linear-gradient(90deg,#06b6d4,#0ea5e9)' },
  { name: 'SQL',         pct: 76, color: 'linear-gradient(90deg,#f97316,#ea580c)' },
  { name: 'Node.js',     pct: 74, color: 'linear-gradient(90deg,#22c55e,#16a34a)' },
  { name: 'Python',      pct: 72, color: 'linear-gradient(90deg,#3b82f6,#6366f1)' },
  
]

const GROUPS = [
  {
    name: '🚀 Languages',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.08)',
    tags: ['Java', 'C++', 'Python', 'JavaScript', 'C'],
  },
  {
    name: '🌐 Frontend',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    tags: ['HTML', 'CSS', 'React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  },
  {
    name: '⚙️ Backend',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    tags: ['Node.js', 'Express.js', 'Flask', 'REST APIs', 'API Design'],
  },
  {
    name: '🗄️ Databases',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    tags: ['MongoDB', 'MongoDB Atlas', 'MySQL', 'PostgreSQL', 'SQLite'],
  },
  {
    name: '🤖 AI / CV',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    tags: ['OpenCV', 'EasyOCR', 'ML Pipelines'],
  },
  {
    name: '🔌 IoT / Systems',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    tags: ['Arduino', 'Embedded C', 'Linux'],
  },
  {
    name: '🛠 Tools',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    tags: ['Git', 'GitHub', 'VS Code', 'Postman'],
  },
]

function Left() {
  return (
    <>
      {BARS.map((b, i) => (
        <div key={b.name} className={s.barWrap}>
          <div className={s.barHeader}>
            <span className={s.barName}>{b.name}</span>
            <span className={s.barPct}>{b.pct}%</span>
          </div>
          <div className={s.barBg}>
            <motion.div
              className={s.barFill}
              style={{ background: b.color }}
              initial={{ width: 0 }}
              animate={{ width: `${b.pct}%` }}
              transition={{ duration: 1.2, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </>
  )
}

function Right() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {GROUPS.map((g) => (
        <div key={g.name} className={s.skillGroup}>
          <div className={s.skillGroupHeader}>
            <span className={s.sgDot} style={{ background: g.color }} />
            <span className={s.sgTitle}>{g.name}</span>
          </div>
          <div className={s.sgTags}>
            {g.tags.map((t) => (
              <span
                key={t}
                className={s.sgTag}
                style={{ color: g.color, borderColor: `${g.color}33` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SkillsSlide() {
  return (
    <TunnelSlide
      tag="// skills"
      title="Technical Arsenal"
      left={<Left />}
      right={<Right />}
    />
  )
}
