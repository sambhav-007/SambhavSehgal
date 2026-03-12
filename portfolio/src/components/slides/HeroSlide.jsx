import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import s from './slides.module.css'

const ROLES = ['Full-Stack Developer', 'Product Builder', 'Public Speaker', 'Problem Solver']

// Counts up from 0 to `target` over `duration` ms, then appends `suffix`
function useCountUp(target, duration = 1200, delay = 1100) {
  const [display, setDisplay] = useState('0')
  const rafRef = useRef(null)

  useEffect(() => {
    if (target == null) return
    // Parse numeric part and suffix (e.g. "35+" → 35, "+")
    const numStr = String(target)
    const suffix = numStr.replace(/[0-9]/g, '')
    const end    = parseInt(numStr) || 0

    let startTime = null
    const delayTimer = setTimeout(() => {
      const tick = (ts) => {
        if (!startTime) startTime = ts
        const progress = Math.min((ts - startTime) / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(String(Math.round(eased * end)) + suffix)
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(delayTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, delay])

  return display
}

function StatBox({ value, label, delay = 1100, href, icon }) {
  const counted = useCountUp(value, 1100, delay)
  const inner = (
    <>
      <span className={s.statVal} style={icon ? { display: 'flex', alignItems: 'center', gap: 5 } : {}}>
        {counted}{icon}
      </span>
      <span className={s.statLbl}>{label}</span>
    </>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={s.stat} style={{ textDecoration: 'none', cursor: 'pointer' }}>
        {inner}
      </a>
    )
  }
  return <div className={s.stat}>{inner}</div>
}

export default function HeroSlide() {
  const [ri, setRi] = useState(0)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(true)
  const [leetcodeSolved, setLeetcodeSolved] = useState(null)

  useEffect(() => {
    // Hardcoded fallback — update this periodically to match your real count
    const FALLBACK = '200+'
    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
      setLeetcodeSolved(prev => prev ?? FALLBACK)
    }, 4000)

    fetch('https://leetcode-stats-api.herokuapp.com/sambhavsehgal', { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        clearTimeout(timer)
        setLeetcodeSolved(data?.totalSolved ?? FALLBACK)
      })
      .catch(() => {
        clearTimeout(timer)
        setLeetcodeSolved(FALLBACK)
      })

    return () => { controller.abort(); clearTimeout(timer) }
  }, [])

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

  const stats = [['30+', 'Technologies'], ['10+', 'Projects'], ['2+', 'Client Projects']]
  const lcVal = leetcodeSolved != null ? `${leetcodeSolved}` : '200+'

  const lcIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f89f1b" style={{ flexShrink: 0 }}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.352 5.352 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.001-1.955a1.384 1.384 0 0 0-1.957-.001l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
    </svg>
  )

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
        Blending code, creativity & AI to turn ideas into intelligent products that live on the web.
      </motion.p>

      <motion.div
        className={s.heroActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <a href="https://www.linkedin.com/in/sambhav-sehgal-8b6a04259/" target="_blank" rel="noopener noreferrer" className="btn-primary">
          <FiLinkedin size={16} /> LinkedIn
        </a>
        <a href="https://github.com/SambhavSehgal" target="_blank" rel="noopener noreferrer" className="btn-outline">
          <FiGithub size={16} /> GitHub
        </a>
        <a href="https://leetcode.com/u/sambhavsehgal/" target="_blank" rel="noopener noreferrer" className="btn-outline">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.352 5.352 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.001-1.955a1.384 1.384 0 0 0-1.957-.001l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg> LeetCode
        </a>
      </motion.div>

      <motion.div
        className={s.heroStats}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        {stats.map(([v, l], i) => (
          <StatBox key={l} value={v} label={l} delay={1100 + i * 120} />
        ))}
        <StatBox
          value={lcVal}
          label="LeetCode Solved"
          delay={1460}
          href="https://leetcode.com/u/sambhavsehgal/"
          icon={lcIcon}
        />
      </motion.div>
    </div>
  )
}
