import { motion } from 'framer-motion'
import styles from './TunnelSlide.module.css'

// Left panel: flies in from left + rotateY
const leftV = {
  hidden:  { x: '-78vw', rotateY: 42, opacity: 0 },
  visible: {
    x: 0, rotateY: 0, opacity: 1,
    transition: { delay: 0.28, duration: 0.92, ease: [0.16, 1, 0.3, 1] },
  },
}

// Right panel: flies in from right + rotateY
const rightV = {
  hidden:  { x: '78vw', rotateY: -42, opacity: 0 },
  visible: {
    x: 0, rotateY: 0, opacity: 1,
    transition: { delay: 0.46, duration: 0.92, ease: [0.16, 1, 0.3, 1] },
  },
}

// Header: drops down from above
const headerV = {
  hidden:  { y: -36, opacity: 0, scale: 0.92 },
  visible: {
    y: 0, opacity: 1, scale: 1,
    transition: { delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

// Full-width / center content: zooms in from back
const centerV = {
  hidden:  { scale: 0.6, opacity: 0, z: -400 },
  visible: {
    scale: 1, opacity: 1, z: 0,
    transition: { delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
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
          style={{ transformPerspective: 1200 }}
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
          style={{ transformPerspective: 1200 }}
        >
          {left}
        </motion.div>
        <motion.div
          variants={rightV}
          initial="hidden"
          animate="visible"
          className={styles.panel}
          style={{ transformPerspective: 1200 }}
        >
          {right}
        </motion.div>
      </div>
    </div>
  )
}
