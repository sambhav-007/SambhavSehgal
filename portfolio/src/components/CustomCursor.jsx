import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let ringX = 0, ringY = 0
    let targetX = 0, targetY = 0
    let rafId = null

    const animate = () => {
      // Lerp ring toward cursor — factor controls trail lag
      ringX += (targetX - ringX) * 0.13
      ringY += (targetY - ringY) * 0.13

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px)`
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY

      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3.5}px, ${e.clientY - 3.5}px)`
      }

      // Expand ring on interactive elements
      const isInteractive = e.target.closest('a, button, [role="button"], input, label, select, textarea')
      ringRef.current?.classList.toggle(styles.active, !!isInteractive)
    }

    const onDown  = () => dotRef.current?.classList.add(styles.clicking)
    const onUp    = () => dotRef.current?.classList.remove(styles.clicking)

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  />
      <div ref={ringRef} className={styles.ring} />
    </>
  )
}
