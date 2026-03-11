import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiGithub, FiExternalLink, FiStar, FiZap } from 'react-icons/fi'
import styles from './Projects.module.css'

const projects = [
  {
    title: 'AADAT',
    subtitle: 'Gamified Social Habit-Building Platform',
    description:
      'A full-stack social habit-tracking platform with gamification, social accountability, and AI-driven personalization. Features streaks, XP points, levels, achievements, AI roadmaps, and real-time progress.',
    highlights: [
      'Gamification engine: streaks, XP, levels, achievements',
      'Social features: feeds, posts, likes, accountability',
      'AI-powered habit roadmaps via Google Gemini',
      'Secure OAuth 2.0 + JWT authentication',
      'CI/CD auto-deployment on Render with MySQL',
    ],
    stack: ['React 19', 'Vite', 'Node.js', 'Express 5', 'MySQL', 'Sequelize', 'Passport.js', 'JWT', 'OAuth 2.0', 'Google Gemini AI', 'SendGrid', 'Framer Motion', 'Render'],
    color: '#a855f7',
    accent: '#7c3aed',
    badge: 'Full-Stack · AI · Production',
    type: 'FLAGSHIP PROJECT',
    featured: true,
  },
  {
    title: 'Attendance Automation',
    subtitle: 'Facial Recognition System',
    description:
      'An automated classroom attendance system using facial recognition that marks ~80 students in under 2 minutes. Eliminates manual roll calls with face detection, encoding comparison, and attendance mapping.',
    highlights: [
      '~80 students processed in under 2 minutes',
      'Face detection, recognition & encoding comparison',
      'Scalable dataset management architecture',
      'Accuracy optimization through ML techniques',
    ],
    stack: ['Python', 'OpenCV', 'Machine Learning'],
    color: '#06b6d4',
    accent: '#0891b2',
    badge: 'ML · Computer Vision',
    type: 'ML PROJECT',
    featured: false,
  },
]

export default function Projects() {
  const [ref, inView] = useInView()

  return (
    <section id="projects" className="section" ref={ref} style={{ background: 'rgba(13,13,26,0.5)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: 18 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <span className="tag">// projects</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Things I've Built</h2>
          <p className="section-subtitle">Production-ready applications with real impact</p>
        </motion.div>

        <div className={styles.grid}>
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className={`${styles.card} ${p.featured ? styles.featured : ''}`}
              initial={{ opacity: 0, y: 90, scale: 0.82, rotateX: 25 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1200, transformOrigin: 'top center' }}
              whileHover={{ y: -8 }}
              style={{ '--project-color': p.color }}
            >
              {p.featured && (
                <div className={styles.featuredBadge}>
                  <FiStar size={12} /> Featured
                </div>
              )}

              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.type} style={{ color: p.color }}>{p.type}</span>
                  <h3 className={styles.title}>{p.title}</h3>
                  <p className={styles.subtitle}>{p.subtitle}</p>
                </div>
                <div className={styles.actions}>
                  <motion.button
                    className={styles.iconBtn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="GitHub"
                  >
                    <FiGithub size={18} />
                  </motion.button>
                  <motion.button
                    className={styles.iconBtn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Live Demo"
                  >
                    <FiExternalLink size={18} />
                  </motion.button>
                </div>
              </div>

              <p className={styles.desc}>{p.description}</p>

              <ul className={styles.highlights}>
                {p.highlights.map((h) => (
                  <li key={h}>
                    <FiZap size={12} style={{ color: p.color, flexShrink: 0, marginTop: 3 }} />
                    {h}
                  </li>
                ))}
              </ul>

              <div className={styles.footer}>
                <span className={styles.badgeLabel} style={{ background: `${p.color}15`, color: p.color, borderColor: `${p.color}30` }}>
                  {p.badge}
                </span>
              </div>

              <div className={styles.stackRow}>
                {p.stack.map((s) => (
                  <span key={s} className={styles.stackTag}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
