import { motion } from 'framer-motion'
import styles from './NavDots.module.css'

export default function NavDots({ slides, current, goTo, theme = 'dark' }) {
  const isLight = theme === 'light'
  const isBlood = theme === 'blood'
  const isCyberpunk = theme === 'cyberpunk'

  return (
    <nav className={styles.nav}>
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          className={styles.btn}
          onClick={() => goTo(i)}
        >
          <motion.div
            className={styles.dot}
            animate={{
              scale: i === current ? 1.0 : 0.45,
              boxShadow: i === current
                ? isLight
                  ? '0 0 10px rgba(17,24,39,0.35), 0 0 18px rgba(17,24,39,0.18)'
                  : isBlood
                    ? '0 0 12px rgba(239,68,68,0.55), 0 0 24px rgba(127,29,29,0.36)'
                  : isCyberpunk
                    ? '0 0 12px rgba(250,204,21,0.62), 0 0 24px rgba(168,85,247,0.38)'
                  : '0 0 14px rgba(168,85,247,0.7), 0 0 28px rgba(168,85,247,0.3)'
                : 'none',
            }}
            transition={{ duration: 0.35 }}
            style={{
              background: i === current
                ? isLight
                  ? 'linear-gradient(135deg,#111827,#374151)'
                  : isBlood
                    ? 'linear-gradient(135deg,#fecaca,#7f1d1d)'
                  : isCyberpunk
                    ? 'linear-gradient(135deg,#a855f7,#facc15)'
                  : 'linear-gradient(135deg,#a855f7,#06b6d4)'
                : isLight
                  ? 'rgba(17,24,39,0.35)'
                  : isBlood
                    ? 'rgba(127,29,29,0.6)'
                  : isCyberpunk
                    ? 'rgba(109,40,217,0.6)'
                  : 'rgba(148,163,184,0.25)',
            }}
          />
          <span className={`${styles.label} ${i === current ? styles.labelActive : ''}`}>
            {slide.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
