import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const JOBS = [
  {
    role: 'Website Developer & Digital Media Manager',
    company: 'Dua Property',
    period: 'Oct 2025 – Present',
    type: 'Freelance',
    color: '#a855f7',
    tech: ['React', 'Tailwind CSS', 'SEO', 'Web Hosting', 'Digital Marketing'],
    points: [
      'Built a production-ready real estate platform with SEO-optimized property listings',
      'Developed responsive landing pages and lead-capture forms improving client inquiries',
      'Integrated media management, contact workflows, and client automation tools',
    ],
  },
  {
    role: 'Community Organizer',
    company: 'Open Source Chandigarh',
    period: 'Sep 2025 – Present',
    type: 'Volunteering',
    color: '#22c55e',
    tech: ['Git', 'GitHub', 'Open Source', 'Public Speaking', 'Event Planning'],
    points: [
      'Organized developer meetups, workshops, and open-source learning sessions',
      'Connected students, developers, and industry professionals in the local tech ecosystem',
      'Encouraged collaboration and contributions to open-source projects',
    ],
  },
  {
    role: 'Website Developer',
    company: 'Kabana de Nature',
    period: 'Jan 2025 – Sep 2025',
    type: 'Freelance',
    color: '#06b6d4',
    tech: ['HTML','CSS','JavaScript', 'SEO', 'DNS', 'Bootstrap', 'PHP'],
    points: [
      'Developed the official resort website from concept to deployment',
      'Implemented booking UI, gallery system, and customer contact integrations',
      'Delivered a responsive hospitality website optimized for mobile users',
    ],
  },
  
]

function Content() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {JOBS.map((j) => (
        <div key={j.role + j.company} className={s.expCard} style={{ borderLeftColor: j.color, borderLeftWidth: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
            <div>
              <div className={s.expRole}>{j.role}</div>
              <div className={s.expMeta}>
                <span style={{ color: j.color }}>{j.company}</span>
                {' · '}<span style={{ background: `${j.color}1a`, color: j.color, fontSize: '0.68rem', padding: '1px 7px', borderRadius: 10 }}>{j.type}</span>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#ffffff', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
              {j.period}
            </span>
          </div>
          <ul className={s.expPoints}>
            {j.points.map((p) => (
              <li key={p}>
                <span style={{ color: j.color, marginTop: 2 }}>▸</span>
                {p}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {j.tech.map((t) => (
              <span key={t} style={{
                fontSize: '0.65rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: j.color,
                background: `${j.color}14`,
                border: `1px solid ${j.color}33`,
                borderRadius: 5,
                padding: '1px 7px',
              }}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ExperienceSlide() {
  return (
    <TunnelSlide
      tag="// experience"
      title="Work Experience"
      full={<Content />}
    />
  )
}
