import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

const TRAITS = [
  { icon: '⚡', title: 'Full-Stack Dev', desc: 'Builds end-to-end applications from UI to backend and deployment.' },
  { icon: '🚀', title: 'Fast Learner', desc: 'Quickly adapts to new technologies and development tools.' },
  { icon: '🎙️', title: 'Public Speaker', desc: 'Experienced in public speaking, debates, and tech community engagement.' },
  { icon: '💡', title: 'Product Thinker', desc: 'Focused on building products that solve real-world problems.' },
]

function Left() {
  return (
    <>
      <p className={s.bio}>
        I'm a <span className={s.hl}>B.E. Computer Science</span> student at Chitkara University (2024–28)
        who enjoys building real-world digital products. I've developed production-ready applications
        for industries like hospitality and real estate, focusing on performance, usability, and modern design.
      </p>
      <p className={s.bio}>
        As a full-stack developer, I work across the entire product lifecycle — from crafting intuitive
        interfaces to designing scalable backend systems. I'm particularly interested in combining AI
        with traditional software engineering to create smarter applications.
      </p>

      <div className={s.infoGrid}>
        {[
          ['Location', 'Ambala, Haryana, India'],
          ['University', 'Chitkara University'],
          ['Degree', 'B.E. Computer Science (2024–2028)'],
          ['Email', 'sambhav.sehgal.007@gmail.com'],
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
      subtitle="Full-Stack Developer building real-world digital products"
      left={<Left />}
      right={<Right />}
    />
  )
}
