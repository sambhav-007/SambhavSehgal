import { motion } from 'framer-motion'
import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const BARS = [
  { name: 'JavaScript / ES6+', pct: 92, color: 'linear-gradient(90deg,#eab308,#f59e0b)' },
  { name: 'React.js / Vite',   pct: 90, color: 'linear-gradient(90deg,#06b6d4,#0ea5e9)' },
  { name: 'Node.js / Express', pct: 85, color: 'linear-gradient(90deg,#22c55e,#16a34a)' },
  { name: 'MySQL / Sequelize', pct: 80, color: 'linear-gradient(90deg,#f97316,#ea580c)' },
  { name: 'Framer Motion',     pct: 82, color: 'linear-gradient(90deg,#a855f7,#7c3aed)' },
  { name: 'Python / OpenCV',   pct: 72, color: 'linear-gradient(90deg,#3b82f6,#6366f1)' },
]

const GROUPS = [
  { name: 'Frontend', color: '#a855f7', bg: 'rgba(168,85,247,0.08)', tags: ['React', 'Vite', 'Framer Motion', 'CSS Modules'] },
  { name: 'Backend',  color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',  tags: ['Node.js', 'Express 5', 'REST APIs'] },
  { name: 'Database', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  tags: ['MySQL', 'Sequelize ORM'] },
  { name: 'Auth',     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', tags: ['Passport.js', 'JWT', 'OAuth2', 'SendGrid'] },
  { name: 'AI / ML',  color: '#ec4899', bg: 'rgba(236,72,153,0.08)', tags: ['Gemini API', 'OpenCV', 'ML Pipelines'] },
  { name: 'Languages',color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', tags: ['JavaScript', 'Python', 'HTML/CSS'] },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
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
