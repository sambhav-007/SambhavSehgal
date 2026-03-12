import { useEffect, useRef } from 'react'
import styles from './ParticleBackground.module.css'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    // scrollVel: positive = outward (forward), negative = inward (backward), decays to 0
    let scrollVel = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── True 3-D starfield ──────────────────────────────────────────────────
    // Each star lives at (x3, y3, z) in 3-D space centred on the screen.
    // Perspective projection: sx = x3/z * FOV + cx   (same for y)
    // z decreases each frame (star rushes toward viewer); when z ≤ 0 it recycles.
    //
    // scrollVel > 0 (forward)  → z decreases faster  (speed up)
    // scrollVel < 0 (backward) → z increases          (pull back)
    // scrollVel = 0            → constant slow cruise
    // ────────────────────────────────────────────────────────────────────────
    const FOV      = 300   // perspective focal length (px)
    const Z_FAR    = 900   // spawn depth
    const Z_NEAR   = 1     // recycle threshold (nearly at viewer)
    const BASE_DZ  = 2.0   // default z-decrease per frame (slower)

    class Star {
      constructor(randomZ) { this.reset(randomZ) }
      reset(randomZ) {
        // 3-D position: x/y spread across a box, z = depth
        this.x3 = (Math.random() - 0.5) * canvas.width  * 2.2
        this.y3 = (Math.random() - 0.5) * canvas.height * 2.2
        this.z  = randomZ
          ? Math.random() * Z_FAR                        // initial: spread everywhere
          : Z_FAR * (0.5 + Math.random() * 0.5)         // recycle: random in far half [450-900]

        this.size    = Math.random() * 1.6 + 0.6
        this.opacity = Math.random() * 0.3 + 0.7   // high base brightness
        this.prevSx  = null
        this.prevSy  = null
      }

      update(dz) {
        const cx = canvas.width  / 2
        const cy = canvas.height / 2
        this.prevSx = this.x3 / this.z * FOV + cx
        this.prevSy = this.y3 / this.z * FOV + cy

        this.z -= dz
        if (this.z <= Z_NEAR) this.reset(false)
        if (this.z > Z_FAR)   this.reset(false)
      }

      draw() {
        const cx = canvas.width  / 2
        const cy = canvas.height / 2

        const sx  = this.x3 / this.z  * FOV + cx
        const sy  = this.y3 / this.z  * FOV + cy

        // Size grows as star gets closer (smaller z = bigger)
        const scale  = FOV / this.z
        const radius = Math.min(this.size * scale, 5)
        // Bright from midway; fully opaque in the near half
        const progress = 1 - this.z / Z_FAR          // 0=far, 1=near
        const alpha  = Math.min(this.opacity * (0.3 + progress * 0.9), 1)

        // Trail from previous position to current
        if (this.prevSx !== null && (Math.abs(sx - this.prevSx) + Math.abs(sy - this.prevSy)) > 0.5) {
          const grad = ctx.createLinearGradient(this.prevSx, this.prevSy, sx, sy)
          grad.addColorStop(0, `rgba(255,255,255,0)`)
          grad.addColorStop(1, `rgba(255,255,255,${Math.min(alpha * 1.2, 1)})`)
          ctx.beginPath()
          ctx.moveTo(this.prevSx, this.prevSy)
          ctx.lineTo(sx, sy)
          ctx.strokeStyle = grad
          ctx.lineWidth   = radius * 1.4
          ctx.lineCap     = 'round'
          ctx.stroke()
        }

        // Star dot
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(radius, 0.4), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      }
    }

    for (let i = 0; i < 160; i++) particles.push(new Star(true))

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // dz: z-decrease per frame — scrollVel boosts or reverses it
      const dz = BASE_DZ + scrollVel * 14
      scrollVel *= 0.92
      if (Math.abs(scrollVel) < 0.003) scrollVel = 0

      particles.forEach(p => { p.update(dz); p.draw() })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const onWheel = (e) => {
      // Forward scroll → faster rush toward viewer; backward → retreat into depth
      const contrib = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 60) / 60 * 0.45
      scrollVel = Math.max(-1, Math.min(1, scrollVel + contrib))
    }
    window.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
