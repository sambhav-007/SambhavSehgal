import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiGithub } from 'react-icons/fi'
import s from './slides.module.css'

const ROLES = ['Full-Stack Developer', 'Product Builder', 'Public Speaker', 'Problem Solver']

export default function HeroSlide() {
  const [ri, setRi] = useState(0)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const role = ROLES[ri]
    if (typing) {
      if (text.length < role.length) {
        const t = setTimeout(() => setText(role.slice(0, text.length + 1)), 70)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1600)
        return () => clearTimeout(t)
      }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 35)
        return () => clearTimeout(t)
      } else {
        setRi((i) => (i + 1) % ROLES.length)
        setTyping(true)
      }
    }
  }, [text, typing, ri])

  const stats = [['2+', 'Live Projects'], ['200+', 'Teams Beaten'], ['3+', 'Tech Stacks']]

  return (
    <div className={s.heroWrap}>
      <motion.div
        className={s.badge}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.55 }}
      >
        <span className={s.badgeDot} />
        Available for opportunities
      </motion.div>

      <motion.h1
        className={s.heroTitle}
        initial={{ opacity: 0, y: 45, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.38, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        Hi, I'm{' '}
        <span className={s.heroName}>Sambhav<br />Sehgal</span>
      </motion.h1>

      <motion.div
        className={s.roleRow}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58 }}
      >
        <span style={{ color: '#94a3b8' }}>I'm a </span>
        <span className={s.roleText}>{text}</span>
        <span className={s.cursor}>|</span>
      </motion.div>

      <motion.p
        className={s.tagline}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        Building scalable full-stack products with React, Node.js &amp; AI
      </motion.p>

      <motion.div
        className={s.heroActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <a href="mailto:sambhav.sehgal.007@gmail.com" className="btn-primary">
          <span>Get in Touch</span><FiMail size={16} />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-outline">
          <FiGithub size={16} /> GitHub
        </a>
      </motion.div>

      <motion.div
        className={s.heroStats}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        {stats.map(([v, l]) => (
          <div key={l} className={s.stat}>
            <span className={s.statVal}>{v}</span>
            <span className={s.statLbl}>{l}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
