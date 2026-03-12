import { motion } from 'framer-motion'
import styles from './ScrollProgress.module.css'

export default function ScrollProgress({ current, total }) {
  const pct = total > 1 ? current / (total - 1) : 0

  return (
    <div className={styles.track}>
      <motion.div
        className={styles.bar}
        animate={{ scaleY: pct }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      />
    </div>
  )
}
