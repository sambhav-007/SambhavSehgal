import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const JOBS = [
  {
    role: 'Full-Stack Developer',
    company: 'Dua Property',
    period: 'Oct 2025 – Present',
    type: 'Freelance',
    color: '#a855f7',
    points: [
      'Built SEO-optimised property listing website from scratch',
      'Designed fully responsive UI with modern landing page',
      'Managed digital media integration and client workflows',
    ],
  },
  {
    role: 'Full-Stack Developer',
    company: 'Kabana Resort',
    period: 'Jan 2025 – Sep 2025',
    type: 'Freelance',
    color: '#06b6d4',
    points: [
      'Delivered production hospitality website through full SDLC',
      'Implemented booking UI, gallery, and contact integrations',
      'Coordinated with client through requirements to deployment',
    ],
  },
  {
    role: 'Community Organizer',
    company: 'Open Source Chandigarh',
    period: 'Sep 2025 – Present',
    type: 'Volunteering',
    color: '#22c55e',
    points: [
      'Organizing open-source community events and workshops',
      'Connecting developers, beginners, and industry leads',
      'Fostering collaborative open-source contributions',
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
            <span style={{ fontSize: '0.72rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
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
