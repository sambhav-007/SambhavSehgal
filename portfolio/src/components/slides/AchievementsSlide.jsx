import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const ACHIEVEMENTS = [
  {
    icon: '🏆',
    iconBg: 'rgba(234,179,8,0.12)',
    tag: '1st Place',
    tagColor: '#eab308',
    tagBorder: 'rgba(234,179,8,0.3)',
    title: 'University Technical Event Winner',
    desc: 'Competed against 200+ teams & 1000+ participants to claim top spot at inter-university technical challenge.',
  },
  {
    icon: '🥈',
    iconBg: 'rgba(148,163,184,0.12)',
    tag: '2nd Place',
    tagColor: '#94a3b8',
    tagBorder: 'rgba(148,163,184,0.3)',
    title: 'Convince & Conquerors Debate',
    desc: 'Silver medal at Chitkara University inter-department debate competition, demonstrating strong argumentation.',
  },
  {
    icon: '🌐',
    iconBg: 'rgba(34,197,94,0.1)',
    tag: 'Live',
    tagColor: '#22c55e',
    tagBorder: 'rgba(34,197,94,0.3)',
    title: '2 Production Websites Deployed',
    desc: 'Dua Property & Kabana Resort — real-world clients, full SDLC ownership, live in production.',
  },
  {
    icon: '🤝',
    iconBg: 'rgba(168,85,247,0.1)',
    tag: 'Active',
    tagColor: '#a855f7',
    tagBorder: 'rgba(168,85,247,0.3)',
    title: 'Open Source Community Organizer',
    desc: 'Running Open Source Chandigarh — connecting developers and fostering collaborative contribution culture.',
  },
]

const SOFT = ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Adaptability', 'Public Speaking']

function Content() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
        {ACHIEVEMENTS.map((a) => (
          <div key={a.title} className={s.achCard} style={{ '--ac': a.tagColor }}>
            <div className={s.achIcon} style={{ background: a.iconBg }}>{a.icon}</div>
            <span
              className={s.achTagBadge}
              style={{ color: a.tagColor, borderColor: a.tagBorder, background: `${a.tagColor}10` }}
            >
              {a.tag}
            </span>
            <div className={s.achTitle}>{a.title}</div>
            <div className={s.achDesc}>{a.desc}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, fontFamily: 'JetBrains Mono, monospace' }}>
          Soft Skills
        </div>
        <div className={s.softRow}>
          {SOFT.map((sk) => <span key={sk} className={s.softChip}>{sk}</span>)}
        </div>
      </div>
    </div>
  )
}

export default function AchievementsSlide() {
  return (
    <TunnelSlide
      tag="// achievements"
      title="Milestones"
      full={<Content />}
    />
  )
}
