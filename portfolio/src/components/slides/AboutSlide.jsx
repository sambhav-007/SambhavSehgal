import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const TRAITS = [
  { icon: '⚡', title: 'Full-Stack Dev', desc: 'End-to-end products from UI to DB and deployment' },
  { icon: '🚀', title: 'Fast Learner', desc: 'Grasps new technologies and frameworks quickly' },
  { icon: '🎙️', title: 'Public Speaker', desc: 'Engaging communicator, community organizer' },
  { icon: '💡', title: 'Product Thinker', desc: 'User-first mindset, focused on real-world impact' },
]

function Left() {
  return (
    <>
      <p className={s.bio}>
        I'm a <span className={s.hl}>B.E. Computer Science</span> student at Chitkara University (2024–28),
        passionate about building products that solve real problems. I've delivered production-grade
        applications for clients across hospitality and real estate.
      </p>
      <p className={s.bio}>
        I work across the full stack — from pixel-perfect UIs to robust APIs — and I love combining
        AI with traditional engineering to make smarter software.
      </p>

      <div className={s.infoGrid}>
        {[
          ['Location', 'Ambala, Haryana'],
          ['University', 'Chitkara University'],
          ['Degree', 'B.E. CSE (2024-28)'],
          ['Email', 'sambhav.sehgal.007'],
        ].map(([lbl, val]) => (
          <div key={lbl} className={s.infoItem}>
            <span className={s.infoLbl}>{lbl}</span>
            <span className={s.infoVal}>{val}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function Right() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: '100%' }}>
      {TRAITS.map((t) => (
        <div key={t.title} className={s.traitCard}>
          <div className={s.traitIcon}>{t.icon}</div>
          <div className={s.traitTitle}>{t.title}</div>
          <div className={s.traitDesc}>{t.desc}</div>
        </div>
      ))}
    </div>
  )
}

export default function AboutSlide() {
  return (
    <TunnelSlide
      tag="// about me"
      title="Who I Am"
      left={<Left />}
      right={<Right />}
    />
  )
}
