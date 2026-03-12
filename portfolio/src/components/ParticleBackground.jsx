import { useEffect, useRef } from 'react'
import styles from './ParticleBackground.module.css'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    // warpFactor: 0 = normal drift, 1 = full warp; warpDir: 1 = outward, -1 = inward
    let warpFactor = 0
    let warpDir = 1

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.4
        this.speedY = (Math.random() - 0.5) * 0.4
        this.opacity = Math.random() * 0.55 + 0.15
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        // Warp: rush outward or inward from screen center
        if (warpFactor > 0.01) {
          const cx = canvas.width / 2
          const cy = canvas.height / 2
          const dx = this.x - cx
          const dy = this.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const push = warpFactor * 10 * warpDir
          this.x += (dx / dist) * push
          this.y += (dy / dist) * push
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset()
      }
      draw() {
        const alpha = this.opacity + warpFactor * 0.5
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size + warpFactor * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha, 1)})`
        ctx.fill()
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle())

    const connectParticles = () => {
      const threshold = warpFactor > 0.1 ? 80 : 120
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < threshold) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255,255,255,${(0.08 + warpFactor * 0.12) * (1 - dist / threshold)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Decay warp back to 0 each frame
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      warpFactor *= 0.91   // decay — warp lasts ~700ms
      if (warpFactor < 0.005) warpFactor = 0
      particles.forEach(p => { p.update(); p.draw() })
      connectParticles()
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const onWarp = (e) => { warpFactor = 1; warpDir = e.detail?.dir ?? 1 }
    window.addEventListener('tunnelwarp', onWarp)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('tunnelwarp', onWarp)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
