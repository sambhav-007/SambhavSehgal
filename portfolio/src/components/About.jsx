import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiCode, FiZap, FiUsers, FiGlobe } from 'react-icons/fi'
import styles from './About.module.css'

const traits = [
  { icon: <FiCode />, title: 'Full-Stack Dev', desc: 'React to Node.js end-to-end' },
  { icon: <FiZap />, title: 'Fast Learner', desc: 'Execution-focused mindset' },
  { icon: <FiUsers />, title: 'Public Speaker', desc: 'Articulate & persuasive' },
  { icon: <FiGlobe />, title: 'Product Thinker', desc: 'Structured problem solving' },
]

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: 18 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <div className={styles.header}>
            <span className="tag">// about me</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>Who I Am</h2>
          </div>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -50, rotateY: -15, scale: 0.9 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarRing} />
              <div className={styles.avatar}>
                <span>SS</span>
              </div>
              <div className={styles.avatarBadge}>
                <span>B.E. CSE</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 50, rotateY: 15, scale: 0.9 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <p className={styles.bio}>
              I'm a{' '}
              <span className={styles.highlight}>Computer Science Engineering</span> student at
              Chitkara University, building production-ready products since my first year.
            </p>
            <p className={styles.bio}>
              With hands-on experience deploying real applications for actual businesses,
              I bridge the gap between{' '}
              <span className={styles.highlight}>engineering excellence</span> and{' '}
              <span className={styles.highlight}>product impact</span>. I specialize in
              full-stack JavaScript, AI integrations, and gamified user experiences.
            </p>
            <p className={styles.bio}>
              Beyond code, I'm an{' '}
              <span className={styles.highlight}>active public speaker</span>, debate
              competitor, and open-source community organizer who believes great software
              starts with great communication.
            </p>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>Ambala, Haryana, India</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>University</span>
                <span className={styles.infoValue}>Chitkara University</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Degree</span>
                <span className={styles.infoValue}>B.E. CSE (2024–2028)</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>sambhav.sehgal.007@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.traits}>
          {traits.map((t, i) => (
            <motion.div
              key={t.title}
              className={styles.traitCard}
              initial={{ opacity: 0, y: 70, scale: 0.78, rotateX: 28 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1000, transformOrigin: 'top center' }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className={styles.traitIcon}>{t.icon}</div>
              <h4 className={styles.traitTitle}>{t.title}</h4>
              <p className={styles.traitDesc}>{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
