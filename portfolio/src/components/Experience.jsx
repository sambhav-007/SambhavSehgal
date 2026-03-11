import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiBriefcase, FiUsers, FiArrowUpRight } from 'react-icons/fi'
import styles from './Experience.module.css'

const jobs = [
  {
    role: 'Website Developer & Digital Media Manager',
    company: 'Dua Property',
    location: 'India',
    period: 'Oct 2025 – Present',
    type: 'Current',
    color: '#a855f7',
    icon: <FiBriefcase />,
    points: [
      'Leading end-to-end development and management of the company\'s official website.',
      'Built responsive, SEO-optimized interfaces to improve search visibility and lead generation.',
      'Optimized performance, UI consistency, and scalable content workflows for production usage.',
      'Coordinated website updates with digital marketing campaigns and social media strategy.',
    ],
  },
  {
    role: 'Website Developer',
    company: 'Kabana de Nature Resort',
    location: 'Himachal Pradesh',
    period: 'Jan 2025 – Sep 2025',
    type: 'Completed',
    color: '#06b6d4',
    icon: <FiBriefcase />,
    points: [
      'Developed and maintained a production-ready website for a real hospitality business.',
      'Managed complete SDLC from requirements gathering to deployment.',
      'Ensured responsive design, performance optimization, and user-friendly booking interface.',
    ],
  },
  {
    role: 'Organising Team Member',
    company: 'Open Source Chandigarh',
    location: 'Chandigarh',
    period: 'Sep 2025 – Present',
    type: 'Current',
    color: '#10b981',
    icon: <FiUsers />,
    points: [
      'Contributing to planning and execution of community-driven technical initiatives.',
      'Assisting in organizing developer-focused events and open-source engagement programs.',
    ],
  },
]

export default function Experience() {
  const [ref, inView] = useInView()

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: 18 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <span className="tag">// experience</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Work Experience</h2>
          <p className="section-subtitle">Building real products for real businesses since 2025</p>
        </motion.div>

        <div className={styles.timeline}>
          {jobs.map((job, i) => (
            <motion.div
              key={job.company}
              className={styles.item}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, rotateY: i % 2 === 0 ? -18 : 18, scale: 0.88 }}
              animate={inView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1200 }}
            >
              <div className={styles.connector}>
                <div className={styles.dot} style={{ background: job.color, boxShadow: `0 0 20px ${job.color}60` }} />
                {i < jobs.length - 1 && <div className={styles.line} />}
              </div>

              <motion.div
                className={styles.card}
                whileHover={{ y: -4, borderColor: `${job.color}50` }}
                style={{ '--card-color': job.color }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardLeft}>
                    <div className={styles.iconBox} style={{ background: `${job.color}15`, color: job.color }}>
                      {job.icon}
                    </div>
                    <div>
                      <h3 className={styles.role}>{job.role}</h3>
                      <div className={styles.meta}>
                        <span className={styles.company}>{job.company}</span>
                        <span className={styles.separator}>·</span>
                        <span className={styles.location}>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardRight}>
                    <span
                      className={styles.badge}
                      style={{
                        background: `${job.color}15`,
                        color: job.color,
                        borderColor: `${job.color}30`,
                      }}
                    >
                      {job.type}
                    </span>
                    <span className={styles.period}>{job.period}</span>
                  </div>
                </div>

                <ul className={styles.points}>
                  {job.points.map((p, pi) => (
                    <li key={pi} className={styles.point}>
                      <FiArrowUpRight size={14} style={{ color: job.color, flexShrink: 0 }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
