import { motion } from 'framer-motion'
import styles from './NavDots.module.css'

export default function NavDots({ slides, current, goTo }) {
  return (
    <nav className={styles.nav}>
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          className={styles.btn}
          onClick={() => goTo(i)}
          title={slide.label}
        >
          <motion.div
            className={styles.dot}
            animate={{
              scale: i === current ? 1.0 : 0.45,
              boxShadow: i === current
                ? '0 0 14px rgba(168,85,247,0.7), 0 0 28px rgba(168,85,247,0.3)'
                : 'none',
            }}
            transition={{ duration: 0.35 }}
            style={{
              background: i === current
                ? 'linear-gradient(135deg,#a855f7,#06b6d4)'
                : 'rgba(148,163,184,0.25)',
            }}
          />
          {i === current && (
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {slide.label}
            </motion.span>
          )}
        </button>
      ))}
    </nav>
  )
}
