import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiAward, FiMic, FiUsers, FiTrendingUp } from 'react-icons/fi'
import styles from './Achievements.module.css'

const achievements = [
  {
    icon: <FiAward size={28} />,
    title: 'University Technical Event Winner',
    desc: 'Won against 200+ teams with 1000+ participants in a competitive university-wide technical event.',
    color: '#f59e0b',
    tag: '🏆 1st Place',
  },
  {
    icon: <FiMic size={28} />,
    title: 'Convince & Conquerors Debate – 2nd Place',
    desc: 'Secured second position in a competitive debate competition, demonstrating persuasive communication skills.',
    color: '#a855f7',
    tag: '🥈 2nd Place',
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Open Source Community Organizer',
    desc: 'Actively contributing to Open Source Chandigarh — planning and executing developer-focused community events.',
    color: '#10b981',
    tag: '🌍 Community',
  },
  {
    icon: <FiTrendingUp size={28} />,
    title: 'Production Developer in Year 1',
    desc: 'Deployed real websites for actual businesses (Dua Property & Kabana Resort) within first year of college.',
    color: '#06b6d4',
    tag: '🚀 Year 1',
  },
]

const soft = [
  'Product Thinking',
  'Structured Problem Solving',
  'Clear Communication',
  'Public Speaking',
  'Team Collaboration',
  'Leadership',
  'Fast Execution',
  'Persuasive Articulation',
]

export default function Achievements() {
  const [ref, inView] = useInView()

  return (
    <section id="achievements" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: 18 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <span className="tag">// achievements</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Milestones & Leadership</h2>
          <p className="section-subtitle">Recognition, community impact & beyond the code</p>
        </motion.div>

        <div className={styles.grid}>
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.75, rotateX: 30, y: 70 }}
              animate={inView ? { opacity: 1, scale: 1, rotateX: 0, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1000, transformOrigin: 'top center' }}
              whileHover={{ y: -6 }}
              style={{ '--ach-color': a.color }}
            >
              <div className={styles.iconWrap} style={{ background: `${a.color}15`, color: a.color }}>
                {a.icon}
              </div>
              <span className={styles.tag2} style={{ background: `${a.color}15`, color: a.color, borderColor: `${a.color}30` }}>
                {a.tag}
              </span>
              <h3 className={styles.achTitle}>{a.title}</h3>
              <p className={styles.achDesc}>{a.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Soft skills */}
        <motion.div
          className={styles.softSkillsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className={styles.softTitle}>Soft Skills</h3>
          <div className={styles.softGrid}>
            {soft.map((s, i) => (
              <motion.div
                key={s}
                className={styles.softTag}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.06 }}
                whileHover={{ scale: 1.05 }}
              >
                {s}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
