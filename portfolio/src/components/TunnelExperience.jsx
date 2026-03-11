import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TunnelBg from './TunnelBg'
import NavDots from './NavDots'
import HeroSlide from './slides/HeroSlide'
import AboutSlide from './slides/AboutSlide'
import SkillsSlide from './slides/SkillsSlide'
import ExperienceSlide from './slides/ExperienceSlide'
import ProjectsSlide from './slides/ProjectsSlide'
import AchievementsSlide from './slides/AchievementsSlide'
import ContactSlide from './slides/ContactSlide'
import styles from './TunnelExperience.module.css'

const SLIDES = [
  { id: 'hero',         label: 'Home',         component: HeroSlide },
  { id: 'about',        label: 'About',        component: AboutSlide },
  { id: 'skills',       label: 'Skills',       component: SkillsSlide },
  { id: 'experience',   label: 'Experience',   component: ExperienceSlide },
  { id: 'projects',     label: 'Projects',     component: ProjectsSlide },
  { id: 'achievements', label: 'Achievements', component: AchievementsSlide },
  { id: 'contact',      label: 'Contact',      component: ContactSlide },
]

const variants = {
  enter: (dir) => ({
    z:     dir > 0 ? -3800 : 1600,
    scale: dir > 0 ? 0.04  : 2.2,
    opacity: 0,
  }),
  center: {
    z: 0, scale: 1, opacity: 1,
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir) => ({
    z:     dir > 0 ? 1800 : -3800,
    scale: dir > 0 ? 2.4  : 0.04,
    opacity: 0,
    transition: { duration: 0.72, ease: [0.55, 0, 1, 0.45] },
  }),
}

export default function TunnelExperience() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const locked = useRef(false)
  const touchY = useRef(null)

  const navigate = useCallback((delta) => {
    if (locked.current) return
    const next = current + delta
    if (next < 0 || next >= SLIDES.length) return
    locked.current = true
    setDir(delta > 0 ? 1 : -1)
    setCurrent(next)
    setTimeout(() => { locked.current = false }, 1900)
  }, [current])

  const goTo = useCallback((index) => {
    if (locked.current || index === current) return
    locked.current = true
    setDir(index > current ? 1 : -1)
    setCurrent(index)
    setTimeout(() => { locked.current = false }, 1900)
  }, [current])

  useEffect(() => {
    const onWheel = (e) => { e.preventDefault(); navigate(e.deltaY > 0 ? 1 : -1) }
    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); navigate(1) }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); navigate(-1) }
    }
    const onTouchStart = (e) => { touchY.current = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      if (touchY.current === null) return
      const d = touchY.current - e.changedTouches[0].clientY
      if (Math.abs(d) > 55) navigate(d > 0 ? 1 : -1)
      touchY.current = null
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [navigate])

  const Slide = SLIDES[current].component

  return (
    <div className={styles.wrapper}>
      <TunnelBg slideIndex={current} />

      {/* Header bar */}
      <header className={styles.header}>
        <div className={styles.logo}>SS<span className={styles.dot}>.</span></div>
        <motion.div
          key={current}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.sectionLabel}
        >
          {SLIDES[current].label}
        </motion.div>
        <a href="mailto:sambhav.sehgal.007@gmail.com" className={styles.hireBtn}>Hire Me</a>
      </header>

      {/* 3D Viewport — perspective lives here */}
      <div className={styles.viewport}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={styles.slide}
          >
            <Slide />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right-side nav dots */}
      <NavDots slides={SLIDES} current={current} goTo={goTo} />

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.counter}>
          <span className={styles.cCurrent}>{String(current + 1).padStart(2, '0')}</span>
          <span className={styles.cSep}>/</span>
          <span className={styles.cTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
        </div>

        {current < SLIDES.length - 1 && (
          <motion.button
            className={styles.scrollHint}
            onClick={() => navigate(1)}
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.9 }}
          >
            <span>Dive Deeper</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  )
}
