import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'

function AADAT() {
  return (
    <div className={s.projCard} style={{ '--c': 'linear-gradient(90deg,#7c3aed,#a855f7)' }}>
      <div>
        <div className={s.projType} style={{ color: '#a855f7' }}>Featured Project · Full-Stack SaaS</div>
        <div className={s.projTitle}>AADAT</div>
        <div className={s.projSub}>Habit Tracker with Gamification Engine</div>
      </div>

      <ul className={s.projPoints}>
        {[
          'React 19 + Vite + Node.js + Express 5 + MySQL + Sequelize',
          'Passport.js · JWT · Google OAuth2 · SendGrid email',
          'Gemini AI for smart habit insights & suggestions',
          'Full XP, levelling, streaks & achievement system',
        ].map((p) => (
          <li key={p}>
            <span style={{ color: '#a855f7' }}>▸</span>
            {p}
          </li>
        ))}
      </ul>

      <div className={s.stackRow}>
        {['React 19', 'Express 5', 'MySQL', 'Sequelize', 'Gemini AI', 'OAuth2', 'SendGrid'].map((t) => (
          <span key={t} className={s.stackTag}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function Attendance() {
  return (
    <div className={s.projCard} style={{ '--c': 'linear-gradient(90deg,#06b6d4,#0ea5e9)' }}>
      <div>
        <div className={s.projType} style={{ color: '#06b6d4' }}>Project · ML / Computer Vision</div>
        <div className={s.projTitle}>Face-Based Attendance</div>
        <div className={s.projSub}>Automated Classroom Attendance System</div>
      </div>

      <ul className={s.projPoints}>
        {[
          'Python + OpenCV + Machine Learning pipeline',
          'Marks ~80 students in under 2 minutes',
          'Real-time face detection & recognition',
          'CSV export and session management',
        ].map((p) => (
          <li key={p}>
            <span style={{ color: '#06b6d4' }}>▸</span>
            {p}
          </li>
        ))}
      </ul>

      <div className={s.stackRow}>
        {['Python', 'OpenCV', 'ML', 'Face Recognition', 'CSV'].map((t) => (
          <span key={t} className={s.stackTag}>{t}</span>
        ))}
      </div>
    </div>
  )
}

export default function ProjectsSlide() {
  return (
    <TunnelSlide
      tag="// projects"
      title="Things I've Built"
      left={<AADAT />}
      right={<Attendance />}
    />
  )
}
