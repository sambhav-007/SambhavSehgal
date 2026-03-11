import styles from './TunnelBg.module.css'

export default function TunnelBg() {
  return (
    <div className={styles.bg}>
      {/* Perspective floor grid — scrolling toward viewer */}
      <div className={styles.floor} />
      {/* Perspective ceiling grid */}
      <div className={styles.ceiling} />

      {/* Expanding tunnel rings from vanishing point */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={styles.ring}
          style={{ '--i': i, '--total': 6 }}
        />
      ))}

      {/* Vanishing-point glow */}
      <div className={styles.vpGlow} />

      {/* Horizontal convergence lines */}
      <div className={styles.beamLeft} />
      <div className={styles.beamRight} />
      <div className={styles.beamTop} />
      <div className={styles.beamBottom} />

      {/* Corner vignette */}
      <div className={styles.vignette} />
    </div>
  )
}
