import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import styles from './Skills.module.css'

const skillGroups = [
  {
    title: 'Frontend',
    color: '#a855f7',
    skills: ['React 19', 'Vite', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    color: '#06b6d4',
    skills: ['Node.js', 'Express 5', 'RESTful APIs', 'JWT Auth', 'Passport.js'],
  },
  {
    title: 'Databases',
    color: '#10b981',
    skills: ['MySQL', 'Sequelize ORM'],
  },
  {
    title: 'Auth & Security',
    color: '#f59e0b',
    skills: ['JWT', 'Google OAuth', 'GitHub OAuth', 'bcrypt', 'Session Mgmt'],
  },
  {
    title: 'Languages',
    color: '#ec4899',
    skills: ['JavaScript', 'Java', 'C++', 'C', 'Python'],
  },
  {
    title: 'AI & Services',
    color: '#8b5cf6',
    skills: ['Google Gemini AI', 'SendGrid', 'Nodemailer', 'LLM Integration'],
  },
  {
    title: 'DevOps & Tools',
    color: '#06b6d4',
    skills: ['Git', 'GitHub', 'Render', 'CI/CD', 'VS Code'],
  },
  {
    title: 'Core CS / DSA',
    color: '#f97316',
    skills: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Hashing', 'Strings'],
  },
]

const featured = [
  { name: 'React', level: 90, color: '#61dafb' },
  { name: 'Node.js', level: 85, color: '#68a063' },
  { name: 'JavaScript', level: 92, color: '#f7df1e' },
  { name: 'MySQL', level: 80, color: '#00758f' },
  { name: 'Framer Motion', level: 82, color: '#a855f7' },
  { name: 'Python', level: 70, color: '#3776ab' },
]

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="section" ref={ref} style={{ background: 'rgba(13,13,26,0.5)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: 18 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <span className="tag">// skills</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Technical Arsenal</h2>
          <p className="section-subtitle">Technologies I work with to build modern, scalable products</p>
        </motion.div>

        {/* Proficiency bars */}
        <div className={styles.proficiency}>
          {featured.map((item, i) => (
            <motion.div
              key={item.name}
              className={styles.profItem}
              initial={{ opacity: 0, x: -40, rotateY: -18, scale: 0.9 }}
              animate={inView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 900 }}
            >
              <div className={styles.profHeader}>
                <span className={styles.profName}>{item.name}</span>
                <span className={styles.profLevel}>{item.level}%</span>
              </div>
              <div className={styles.barBg}>
                <motion.div
                  className={styles.barFill}
                  style={{ background: `linear-gradient(90deg, ${item.color}88, ${item.color})` }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${item.level}%` } : {}}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.9, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill groups */}
        <div className={styles.groups}>
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              className={styles.group}
              initial={{ opacity: 0, y: 55, scale: 0.82, rotateX: 22 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ delay: gi * 0.07 + 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1000, transformOrigin: 'top center' }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.groupHeader}>
                <div className={styles.groupDot} style={{ background: group.color }} />
                <h3 className={styles.groupTitle}>{group.title}</h3>
              </div>
              <div className={styles.tags}>
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={styles.skillTag}
                    style={{ borderColor: `${group.color}30`, color: group.color + 'cc' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
