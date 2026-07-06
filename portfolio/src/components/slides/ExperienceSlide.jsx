import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const JOBS = [
  {
    role: 'Founder & Software Engineer',
    company: 'Viltrumate Technologies',
    logo: '/logos/viltrumate.png',
    period: 'Jan 2026 – Present',
    type: 'Founder',
    color: '#f59e0b',
    tech: ['React', 'Node.js', 'Razorpay', 'Cloudinary', 'Gemini AI', 'Google Maps API', 'WhatsApp API'],
    points: [
      'Founded an IT solutions startup delivering custom software, e-commerce platforms, AI-powered applications, and digital transformation solutions',
      'Led the complete software development lifecycle from client consultation and architecture to deployment, SEO, and long-term maintenance',
      'Built the Viltrumate Commerce Engine — a reusable platform for production-ready e-commerce apps with configurable storefronts, admin dashboards, inventory, and order management',
    ],
  },
  {
    role: 'Website Developer & Digital Media Manager',
    company: 'Dua Property',
    logo: '/logos/dua-property.jpg',
    period: 'Oct 2025 – May 2026',
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
    logo: '/logos/open-source-chandigarh.png',
    period: 'Sep 2025 – Present',
    type: 'Community Member',
    color: '#22c55e',
    tech: ['Git', 'GitHub', 'Open Source', 'Public Speaking', 'Event Planning'],
    points: [
      'Organized developer meetups, workshops, and open-source learning sessions',
      'Connected students, developers, and industry professionals in the local tech ecosystem',
      'Encouraged collaboration and contributions to open-source projects',
    ],
  },
  {
    role: 'Software Developer',
    company: 'Kabana de Nature',
    logo: '/logos/kabana-de-nature.png',
    period: 'Jan 2025 – Jun 2026',
    type: 'Freelance',
    color: '#06b6d4',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Bootstrap', 'Razorpay', 'SEO', 'DNS'],
    points: [
      'Designed and developed a hospitality management and online reservation platform',
      'Built a full-featured admin dashboard with booking calendar, reservations, customer management, room availability, pricing controls, and reporting',
      'Integrated Razorpay payments and managed deployment, DNS, SEO, and production maintenance',
    ],
  },
  
]

function Content() {
  return (
    <div className={s.expList}>
      {JOBS.map((j) => (
        <div key={j.role + j.company} className={s.expCard} style={{ borderLeftColor: j.color, borderLeftWidth: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
            <div>
              <div className={s.expRole}>{j.role}</div>
              <div className={s.expMeta}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: j.color }}>
                  {j.logo && (
                    <img
                      src={j.logo}
                      alt={j.company}
                      style={{ width: 16, height: 16, objectFit: 'contain', borderRadius: 3, flexShrink: 0 }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  {j.company}
                </span>
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
