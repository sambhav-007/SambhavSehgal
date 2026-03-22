// ── DUAL-SLOT TUNNEL ────────────────────────────────────────────────────────
// Two persistent divs (slot 0 & 1) stay in the DOM at all times.
// On commit we flip which slot is "active" — the arrived slide never re-mounts,
// so its content / animations never replay.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VendingMachine from './VendingMachine'
import NavDots from './NavDots'
import HeroSlide from './slides/HeroSlide'
import AboutSlide from './slides/AboutSlide'
import SkillsSlide from './slides/SkillsSlide'
import ExperienceSlide from './slides/ExperienceSlide'
import ProjectsSlide from './slides/ProjectsSlide'
import AchievementsSlide from './slides/AchievementsSlide'
import ContactSlide from './slides/ContactSlide'
import styles from './TunnelExperience.module.css'
import ScrollProgress from './ScrollProgress'

const SLIDES = [
  { id: 'hero',         label: 'Home',         component: HeroSlide },
  { id: 'about',        label: 'About',        component: AboutSlide },
  { id: 'skills',       label: 'Skills',       component: SkillsSlide },
  { id: 'experience',   label: 'Experience',   component: ExperienceSlide },
  { id: 'projects',     label: 'Projects',     component: ProjectsSlide },
  { id: 'achievements', label: 'Achievements', component: AchievementsSlide },
  { id: 'contact',      label: 'Contact',      component: ContactSlide },
]

const THRESHOLD = 300

const THEME_OPTIONS = [
  {
    id: 'light',
    name: 'Cookies n Creme',
    desc: 'Cream background with black particles',
  },
  {
    id: 'dark',
    name: 'Space',
    desc: 'Default deep-space dark theme',
  },
  {
    id: 'blood',
    name: 'Dark Blood',
    desc: 'Blood-red backdrop with black particles',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    desc: 'Deep purple neon with yellow particles',
  },
]

function applyProgress(curEl, nxtEl, p, dir) {
  if (curEl) {
    if (dir > 0) {
      curEl.style.transform = `translateZ(${p * 850}px)`
      curEl.style.opacity   = String(Math.max(0, 1 - p * 2.2))
    } else {
      curEl.style.transform = `translateZ(${-p * 1800}px)`
      curEl.style.opacity   = String(Math.max(0, 1 - p * 2.0))
    }
  }
  if (nxtEl) {
    if (dir > 0) {
      nxtEl.style.transform = `translateZ(${-2400 + p * 2400}px)`
      nxtEl.style.opacity   = String(Math.max(0, p * 2.5 - 0.9))
    } else {
      nxtEl.style.transform = `translateZ(${600 * (1 - p)}px)`
      nxtEl.style.opacity   = String(Math.max(0, p * 2.5 - 0.8))
    }
  }
}

// Direct DOM helpers — bypass React scheduling for instant visual response
const hideSlot = (el) => { if (el) { el.style.opacity = '0'; el.style.pointerEvents = 'none' } }
const showSlot = (el) => { if (el) { el.style.opacity = '';  el.style.pointerEvents = '' } }

export default function TunnelExperience({ theme = 'dark', onSelectTheme }) {
  /**
   * Dual-slot architecture:
   *   slots[0/1]  — slideIdx rendered in each persistent div (null = empty)
   *   activeSlot  — which slot is the "committed" current slide
   *
   * On commit we toggle activeSlot. The arrived slide was already in the DOM
   * since startPreview, so it NEVER re-mounts — no animation replay.
   */
  const [slots, setSlots]           = useState([0, null])
  const [activeSlot, setActiveSlot] = useState(0)
  const [showVending, setShowVending] = useState(false)
  const [showThemes, setShowThemes] = useState(false)

  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const slotRefs = [ref0, ref1]   // stable ref objects — safe to close over

  const dirRef        = useRef(1)
  const progress      = useRef(0)
  const rafId         = useRef(null)
  const inTransit     = useRef(false)
  const hasPreview    = useRef(false)
  const activeSlotRef = useRef(0)   // mirrors activeSlot; updated sync on commit
  const currentIdxRef = useRef(0)   // mirrors currentIdx; updated sync on commit — avoids stale-closure bug
  const pendingIdxRef = useRef(null) // target idx of in-flight preview
  const scrollAccum   = useRef(0)
  const touchY        = useRef(null)

  // Init: hide the empty second slot
  useEffect(() => { hideSlot(ref1.current) }, [])

  useEffect(() => {
    if (!showThemes) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setShowThemes(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showThemes])

  // After React commits new pending-slot content, apply its initial 3-D position
  useEffect(() => {
    if (!hasPreview.current) return
    const nxt = 1 - activeSlotRef.current
    if (slots[nxt] === null) return
    requestAnimationFrame(() => {
      const a = activeSlotRef.current
      applyProgress(slotRefs[a].current, slotRefs[1 - a].current, 0, dirRef.current)
    })
  }, [slots])

  // ── Animation runners ──────────────────────────────────────────────────────

  const commitTransition = useCallback(() => {
    inTransit.current = true
    if (rafId.current) cancelAnimationFrame(rafId.current)

    const curSlot = activeSlotRef.current
    const nxtSlot = 1 - curSlot

    const tick = () => {
      progress.current = Math.min(1, progress.current + 0.055)
      applyProgress(
        slotRefs[curSlot].current,
        slotRefs[nxtSlot].current,
        progress.current,
        dirRef.current
      )
      if (progress.current < 1) {
        rafId.current = requestAnimationFrame(tick)
      } else {
        // Promote pending slot → active; hide old slot — no React remount!
        showSlot(slotRefs[nxtSlot].current)
        hideSlot(slotRefs[curSlot].current)

        activeSlotRef.current = nxtSlot   // sync ref update (immediate)
        currentIdxRef.current = pendingIdxRef.current ?? currentIdxRef.current
        pendingIdxRef.current = null
        inTransit.current     = false
        hasPreview.current    = false
        progress.current      = 0
        scrollAccum.current   = 0

        // Batch both state updates into one React render (no setTimeout race)
        setActiveSlot(nxtSlot)
        setSlots(prev => { const s = [...prev]; s[curSlot] = null; return s })
      }
    }
    rafId.current = requestAnimationFrame(tick)
  }, [])

  const cancelTransition = useCallback(() => {
    inTransit.current = true
    if (rafId.current) cancelAnimationFrame(rafId.current)

    const curSlot = activeSlotRef.current
    const nxtSlot = 1 - curSlot

    const tick = () => {
      progress.current = Math.max(0, progress.current - 0.065)
      applyProgress(
        slotRefs[curSlot].current,
        slotRefs[nxtSlot].current,
        progress.current,
        dirRef.current
      )
      if (progress.current > 0) {
        rafId.current = requestAnimationFrame(tick)
      } else {
        showSlot(slotRefs[curSlot].current)
        hideSlot(slotRefs[nxtSlot].current)

        inTransit.current   = false
        hasPreview.current  = false
        progress.current    = 0
        scrollAccum.current = 0

        setSlots(prev => { const s = [...prev]; s[nxtSlot] = null; return s })
      }
    }
    rafId.current = requestAnimationFrame(tick)
  }, [])

  // Load target slide into pending slot
  const startPreview = useCallback((d, targetIdx) => {
    const nxtSlot = 1 - activeSlotRef.current
    dirRef.current        = d
    hasPreview.current    = true
    pendingIdxRef.current = targetIdx
    progress.current      = 0
    setSlots(prev => { const s = [...prev]; s[nxtSlot] = targetIdx; return s })
  }, [])

  const currentIdx = slots[activeSlot] ?? 0

  // NavDot click: cancel any pending scroll preview, then commit to chosen slide
  const goTo = useCallback((index) => {
    if (inTransit.current || index === currentIdx) return
    // If a scroll preview is in progress, cancel it first then start fresh
    if (hasPreview.current) {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      const nxtSlot = 1 - activeSlotRef.current
      hideSlot(slotRefs[nxtSlot].current)
      inTransit.current   = false
      hasPreview.current  = false
      progress.current    = 0
      scrollAccum.current = 0
      setSlots(prev => { const s = [...prev]; s[nxtSlot] = null; return s })
    }
    const d = index > currentIdx ? 1 : -1
    startPreview(d, index)
    window.dispatchEvent(new CustomEvent('tunnelwarp', { detail: { dir: d } }))
    requestAnimationFrame(() => requestAnimationFrame(() => commitTransition()))
  }, [currentIdx, startPreview, commitTransition])

  // ── Input events ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      if (inTransit.current) return

      const isMouse = Math.abs(e.deltaY) > 50
      const tick    = isMouse
        ? Math.sign(e.deltaY) * 100
        : Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 38)

      scrollAccum.current += tick
      scrollAccum.current  = Math.max(-THRESHOLD, Math.min(THRESHOLD, scrollAccum.current))

      const d        = scrollAccum.current > 0 ? 1 : -1
      const absAccum = Math.abs(scrollAccum.current)
      const target   = currentIdxRef.current + d

      if (target < 0 || target >= SLIDES.length) {
        scrollAccum.current = 0
        return
      }

      // First scroll: mount pending slide
      if (!hasPreview.current) {
        startPreview(d, target)
        return
      }

      // Direction reversal: cancel preview
      if (d !== dirRef.current) {
        scrollAccum.current = 0
        cancelTransition()
        return
      }

      // Drive progress — view holds exactly where you stop scrolling
      const p = Math.min(0.92, absAccum / THRESHOLD)
      progress.current = p
      const a = activeSlotRef.current
      applyProgress(slotRefs[a].current, slotRefs[1 - a].current, p, dirRef.current)

      // Commit at threshold
      if (absAccum >= THRESHOLD) {
        window.dispatchEvent(new CustomEvent('tunnelwarp', { detail: { dir: d } }))
        commitTransition()
      }
    }

    const onKey = (e) => {
      if (inTransit.current || hasPreview.current) return
      const d = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1
              : ['ArrowUp', 'PageUp'].includes(e.key)          ? -1 : 0
      if (!d) return
      e.preventDefault()
      const t = currentIdxRef.current + d
      if (t < 0 || t >= SLIDES.length) return
      startPreview(d, t)
      window.dispatchEvent(new CustomEvent('tunnelwarp', { detail: { dir: d } }))
      requestAnimationFrame(() => requestAnimationFrame(() => commitTransition()))
    }

    const onTouchStart = (e) => { touchY.current = e.touches[0].clientY }
    const onTouchEnd   = (e) => {
      if (touchY.current === null) return
      const delta = touchY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 70 && !inTransit.current && !hasPreview.current) {
        const d = delta > 0 ? 1 : -1
        const t = currentIdxRef.current + d
        if (t >= 0 && t < SLIDES.length) {
          startPreview(d, t)
          window.dispatchEvent(new CustomEvent('tunnelwarp', { detail: { dir: d } }))
          requestAnimationFrame(() => requestAnimationFrame(() => commitTransition()))
        }
      }
      touchY.current = null
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('keydown',    onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [currentIdx, startPreview, commitTransition, cancelTransition])

  const SlideA = slots[0] !== null ? SLIDES[slots[0]].component : null
  const SlideB = slots[1] !== null ? SLIDES[slots[1]].component : null

  return (
    <div className={styles.wrapper}>

      <header className={styles.header}>
        <div className={styles.logo}>SS<span className={styles.dot}>.</span></div>
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.sectionLabel}
        >
          {SLIDES[currentIdx].label}
        </motion.div>
        <div className={styles.headerActions}>
          <button
            className={styles.themeToggle}
            type="button"
            onClick={() => setShowThemes(true)}
            aria-label="Themes"
            title={
              theme === 'light'
                ? 'Themes (Current: Cookies n Creme)'
                : theme === 'blood'
                  ? 'Themes (Current: Dark Blood)'
                  : theme === 'cyberpunk'
                    ? 'Themes (Current: Cyberpunk)'
                    : 'Themes (Current: Space)'
            }
          >
            <span>Themes</span>
          </button>
          <button className={styles.hireBtn} onClick={() => setShowVending(true)}>🍫 Buy Me a Snack</button>
        </div>
      </header>

      <div className={styles.viewport}>
        {/* Slot 0 — persistent, never unmounted mid-transition */}
        <div ref={ref0} className={styles.slide}>
          {SlideA && <SlideA />}
        </div>
        {/* Slot 1 — persistent, never unmounted mid-transition */}
        <div ref={ref1} className={styles.slide}>
          {SlideB && <SlideB />}
        </div>
      </div>

      <ScrollProgress current={currentIdx} total={SLIDES.length} />
      <NavDots slides={SLIDES} current={currentIdx} goTo={goTo} theme={theme} />

      <AnimatePresence>
        {showThemes && (
          <motion.div
            className={styles.themeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThemes(false)}
          >
            <motion.div
              className={styles.themePanel}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.themeTitle}>Choose Theme</h3>
              <p className={styles.themeSub}>Pick your preferred visual mode</p>

              <div className={styles.themeList}>
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${styles.themeOption} ${theme === opt.id ? styles.themeOptionActive : ''}`}
                    onClick={() => {
                      onSelectTheme?.(opt.id)
                      setShowThemes(false)
                    }}
                  >
                    <span className={styles.themeOptionHead}>
                      <span
                        className={`${styles.themeOptionSwatch} ${
                          opt.id === 'light'
                            ? styles.themeOptionSwatchLight
                            : opt.id === 'blood'
                              ? styles.themeOptionSwatchBlood
                              : opt.id === 'cyberpunk'
                                ? styles.themeOptionSwatchCyberpunk
                              : styles.themeOptionSwatchDark
                        }`}
                        aria-hidden="true"
                      />
                      <span className={styles.themeOptionName}>{opt.name}</span>
                      <span
                        className={`${styles.themeOptionPattern} ${
                          opt.id === 'light'
                            ? styles.patternLight
                            : opt.id === 'blood'
                              ? styles.patternBlood
                              : opt.id === 'cyberpunk'
                                ? styles.patternCyberpunk
                              : styles.patternDark
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className={styles.themeOptionDesc}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        {showVending && <VendingMachine onClose={() => setShowVending(false)} />}
      </AnimatePresence>

      <div className={styles.bottomBar}>
        <div className={styles.counter}>
          <span className={styles.cCurrent}>{String(currentIdx + 1).padStart(2, '0')}</span>
          <span className={styles.cSep}>/</span>
          <span className={styles.cTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
        </div>
        {currentIdx < SLIDES.length - 1 && (
          <motion.button
            className={styles.scrollHint}
            onClick={() => goTo(currentIdx + 1)}
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
