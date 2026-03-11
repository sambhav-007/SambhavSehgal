import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowDown, FiGithub, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi'
import styles from './Hero.module.css'

const roles = ['Full-Stack Developer', 'Product Builder', 'Public Speaker', 'Problem Solver']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const current = roles[roleIndex]
    if (typing) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
        return () => clearTimeout(t)
      } else {
        setRoleIndex((i) => (i + 1) % roles.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, roleIndex])

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.75])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 2.5])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} id="hero" ref={sectionRef}>
      {/* Glowing orbs */}
      <motion.div className={styles.orb1} style={{ scale: orbScale }} />
      <motion.div className={styles.orb2} style={{ scale: orbScale }} />
      <motion.div className={styles.orb3} style={{ scale: orbScale }} />

      <motion.div className={styles.scrollZoom} style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}>
      <div className={styles.content}>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={styles.badgeDot} />
          Available for opportunities
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Hi, I'm{' '}
          <span className={styles.name}>Sambhav</span>
          <br />
          <span className={styles.name}>Sehgal</span>
        </motion.h1>

        <motion.div
          className={styles.roleRow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className={styles.roleLabel}>I'm a </span>
          <span className={styles.roleText}>{displayed}</span>
          <span className={styles.cursor}>|</span>
        </motion.div>

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Building scalable full-stack products with React, Node.js & AI—
          <br />
          turning complex ideas into elegant digital experiences.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <button
            className="btn-primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>View my work</span>
            <FiExternalLink />
          </button>
          <a href="mailto:sambhav.sehgal.007@gmail.com" className="btn-outline">
            <FiMail /> Get in touch
          </a>
        </motion.div>

        <motion.div
          className={styles.socials}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FiGithub size={20} />
          </a>
          <a href="https://linkedin.com/in/sambhav-sehgal-35896a334" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <FiLinkedin size={20} />
          </a>
          <a href="mailto:sambhav.sehgal.007@gmail.com" className={styles.socialLink}>
            <FiMail size={20} />
          </a>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className={styles.stats}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        {[
          { value: '2+', label: 'Live Projects' },
          { value: '200+', label: 'Teams Beaten' },
          { value: '3+', label: 'Tech Stacks' },
          { value: '∞', label: 'Passion' },
        ].map((stat) => (
          <div className={styles.stat} key={stat.label}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </motion.div>
      </motion.div>

      <motion.button
        className={styles.scrollBtn}
        onClick={scrollToAbout}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <FiArrowDown size={20} />
      </motion.button>
    </section>
  )
}
