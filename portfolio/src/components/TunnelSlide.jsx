import { motion } from 'framer-motion'
import styles from './TunnelSlide.module.css'

// Left panel: slides in from left — NO opacity (parent handles it), NO rotateY (no GPU conflict)
const leftV = {
  hidden:  { x: '-55vw' },
  visible: {
    x: 0,
    transition: { delay: 0.3, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
}

// Right panel: slides in from right
const rightV = {
  hidden:  { x: '55vw' },
  visible: {
    x: 0,
    transition: { delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
}

// Header: drops from above
const headerV = {
  hidden:  { y: -28 },
  visible: {
    y: 0,
    transition: { delay: 0.18, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
}

// Full-width content: fades up slightly
const centerV = {
  hidden:  { y: 24, scale: 0.96 },
  visible: {
    y: 0, scale: 1,
    transition: { delay: 0.22, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function TunnelSlide({ tag, title, subtitle, left, right, full }) {
  if (full) {
    return (
      <div className={styles.wrapper}>
        {(tag || title || subtitle) && (
          <motion.div
            variants={headerV}
            initial="hidden"
            animate="visible"
            className={styles.header}
          >
            {tag && <span className="tag">{tag}</span>}
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </motion.div>
        )}
        <motion.div
          variants={centerV}
          initial="hidden"
          animate="visible"
          className={styles.full}
        >
          {full}
        </motion.div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {(tag || title || subtitle) && (
        <motion.div
          variants={headerV}
          initial="hidden"
          animate="visible"
          className={styles.header}
        >
          {tag && <span className="tag">{tag}</span>}
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </motion.div>
      )}
      <div className={styles.panels}>
        <motion.div
          variants={leftV}
          initial="hidden"
          animate="visible"
          className={styles.panel}
        >
          {left}
        </motion.div>
        <motion.div
          variants={rightV}
          initial="hidden"
          animate="visible"
          className={styles.panel}
        >
          {right}
        </motion.div>
      </div>
    </div>
  )
}
