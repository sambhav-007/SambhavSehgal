import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, useGLTF, useProgress, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import styles from './LaunchIntro.module.css'

// ── Static star field ──────────────────────────────────────────────────────────
function Stars({ phaseRef, launchStartRef }) {
  const geomRef = useRef(null)
  const matRef = useRef(null)
  const starCount = 2600

  const points = useMemo(() => {
    const arr = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 160
      arr[i * 3 + 1] = (Math.random() - 0.5) * 95
      arr[i * 3 + 2] = -Math.random() * 240 - 12
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!geomRef.current || !matRef.current) return
    const pos = geomRef.current.attributes.position
    const launch = phaseRef.current === 'launching'

    if (launch) {
      const elapsed = (performance.now() - launchStartRef.current) / 1000
      const t = THREE.MathUtils.clamp(elapsed / 1.15, 0, 1)
      const speed = THREE.MathUtils.lerp(240, 2200, t * t * t)
      const outward = 1 + 0.6 * t

      for (let i = 0; i < starCount; i++) {
        const xIndex = i * 3
        const yIndex = i * 3 + 1
        const zIndex = i * 3 + 2
        pos.array[xIndex] *= 1 + delta * 0.23 * outward
        pos.array[yIndex] *= 1 + delta * 0.23 * outward
        pos.array[zIndex] += delta * speed
        if (pos.array[zIndex] > 8) {
          pos.array[xIndex] = (Math.random() - 0.5) * 160
          pos.array[yIndex] = (Math.random() - 0.5) * 95
          pos.array[zIndex] = -Math.random() * 240 - 20
        }
      }
      pos.needsUpdate = true
    }

    matRef.current.size = THREE.MathUtils.damp(matRef.current.size, launch ? 0.46 : 0.12, 6, delta)
    matRef.current.opacity = THREE.MathUtils.damp(matRef.current.opacity, launch ? 1 : 0.82, 6, delta)
  })

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#dff3ff"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.82}
        depthWrite={false}
      />
    </points>
  )
}

function LoadingOverlay({ modelReady }) {
  const { progress, active } = useProgress()
  const shownProgress = modelReady ? 100 : Math.max(8, Math.round(progress))
  const hidden = modelReady && !active
  const logs = [
    { at:  8, text: '[BOOT] Milano-class M-ship powering on...' },
    { at: 20, text: '[ENG ] Quarnyx engines warming up... 34% thrust' },
    { at: 33, text: '[SYS ] Hull pressure check — nominal across all decks' },
    { at: 46, text: '[NAV ] Plotting hyperspace jump coordinates...' },
    { at: 58, text: '[ENG ] Thrust at full capacity — engines green' },
    { at: 69, text: '[PWR ] Plex charger cycling to jump-ready state' },
    { at: 80, text: '[NAV ] Jump vector locked — Xandar sector, sector 7-G' },
    { at: 91, text: '[SHLD] Particle shields armed and holding' },
    { at: 100, text: '[DONE] All systems nominal. Ready for space jump.' },
  ]
  const visibleLogs = logs.filter((entry) => shownProgress >= entry.at)

  return (
    <div className={`${styles.loader} ${hidden ? styles.loaderHidden : ''}`} aria-hidden={hidden}>
      <div className={styles.loaderBackdrop} />
      <div className={styles.loaderCore}>
        <div className={styles.loaderHeaderRow}>
          <p className={styles.loaderTag}>MILANO TERMINAL :: BOOT LOG</p>
          <p className={styles.loaderPct}>{shownProgress}%</p>
        </div>

        <div className={styles.loaderTerminal}>
          {visibleLogs.map((entry) => (
            <p
              key={entry.text}
              className={`${styles.logLine} ${styles.logOn} ${styles.logEnter}`}
            >
              {entry.text}
            </p>
          ))}

          {visibleLogs.length === 0 && (
            <p className={`${styles.logLine} ${styles.logPending}`}>[BOOT] Milano systems coming online...</p>
          )}

          <p className={`${styles.logLine} ${styles.logOn}`}>
            {'>'} {shownProgress < 100 ? 'Hold tight — jump drive spooling up...' : 'All systems go. Initiate space jump.'}
            <span className={styles.loaderCursor}>_</span>
          </p>
        </div>

        <div className={styles.loaderTrack}>
          <span style={{ width: `${shownProgress}%` }} />
        </div>

        <div className={styles.loaderMeta}>
          <p className={styles.loaderState}>{shownProgress < 100 ? 'JUMP DRIVE SPOOLING' : 'JUMP DRIVE READY'}</p>
          <p className={styles.loaderSub}>{shownProgress < 100 ? 'Warming quarnyx engines' : 'Locked on jump vector — awaiting launch'}</p>
        </div>
      </div>
    </div>
  )
}

// ── Drag + zoom handler attached directly to the canvas DOM element ────────────
function DragHandler({ dragRef, phaseRef }) {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    let active = false
    let lastX = 0
    let lastY = 0

    const onDown = (e) => {
      if (phaseRef.current !== 'idle') return
      active = true
      lastX = e.clientX
      lastY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }

    const onMove = (e) => {
      if (!active) return
      dragRef.current.rotY += (e.clientX - lastX) * 0.013
      dragRef.current.rotX = THREE.MathUtils.clamp(
        dragRef.current.rotX + (e.clientY - lastY) * 0.007,
        -0.88,
        0.65,
      )
      lastX = e.clientX
      lastY = e.clientY
    }

    const onUp = () => { active = false }

    const onWheel = (e) => {
      if (phaseRef.current !== 'idle') return
      e.preventDefault()
      dragRef.current.zoom = THREE.MathUtils.clamp(
        dragRef.current.zoom + e.deltaY * 0.005,
        dragRef.current.minZoom,
        dragRef.current.maxZoom,
      )
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [gl, dragRef, phaseRef])

  return null
}

// ── Camera controller: idle follows zoom, launch flies forward ─────────────────
function CameraController({ dragRef, phaseRef, launchStartRef }) {
  const { camera } = useThree()

  const easeInOutCubic = (t) => (t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const easeInCubic = (t) => t * t * t
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5)

  const shipDepth = dragRef.current.shipDepth ?? 0

  useFrame((_, delta) => {
    let lookX = 0
    let lookY = 0
    let lookZ = 0

    if (phaseRef.current === 'idle' || phaseRef.current === 'portal') {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 7, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 0, 7, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, dragRef.current.zoom, 5, delta)
      camera.fov = THREE.MathUtils.damp(camera.fov, 42, 7, delta)
      lookZ = shipDepth
    } else {
      const launchElapsed = (performance.now() - launchStartRef.current) / 1000
      const setupDuration = 0.36
      const blastDuration = 1.16
      const tunnelDuration = 0.36
      const setupT = THREE.MathUtils.clamp(launchElapsed / setupDuration, 0, 1)
      const blastT = THREE.MathUtils.clamp((launchElapsed - setupDuration) / blastDuration, 0, 1)
      const tunnelT = THREE.MathUtils.clamp((launchElapsed - setupDuration - blastDuration) / tunnelDuration, 0, 1)

      let tx = 0
      let ty = 0
      let tz = dragRef.current.zoom
      let tfov = 42

      if (launchElapsed <= setupDuration) {
        const p = easeInOutCubic(setupT)
        tz = THREE.MathUtils.lerp(dragRef.current.zoom, dragRef.current.zoom + 2.4, p)
        ty = THREE.MathUtils.lerp(0, 0.08, p)
        tfov = THREE.MathUtils.lerp(42, 44, p)
        lookZ = THREE.MathUtils.lerp(shipDepth, shipDepth - 1.5, p)
      } else if (launchElapsed <= setupDuration + blastDuration) {
        const p = easeInCubic(blastT)
        tz = THREE.MathUtils.lerp(dragRef.current.zoom + 2.4, 1.0, p)
        ty = THREE.MathUtils.lerp(0.08, 0, p)
        tfov = THREE.MathUtils.lerp(44, 76, p)
        lookZ = THREE.MathUtils.lerp(shipDepth - 1.5, shipDepth - 26, p)
      } else {
        const p = easeOutQuint(tunnelT)
        tz = THREE.MathUtils.lerp(1.0, 0.7, p)
        tfov = THREE.MathUtils.lerp(76, 82, p)
        lookZ = THREE.MathUtils.lerp(shipDepth - 26, shipDepth - 46, p)
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 7, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 7, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, tz, 5.5, delta)
      camera.fov = THREE.MathUtils.damp(camera.fov, tfov, 6, delta)
    }

    camera.lookAt(lookX, lookY, lookZ)
    camera.updateProjectionMatrix()
  })

  return null
}

// ── Ship model ──────────────────────────────────────────────────────────────────
function MilanoModel({ dragRef, phaseRef, onReady }) {
  const outerGroup = useRef(null)
  const { scene } = useGLTF('/models/milano/Milano_GotG.gltf')
  const [shipBaseMap, shipEmissiveMap] = useTexture([
    '/models/milano/images/00_BaseColor_Lite.jpg',
    '/models/milano/images/00_Emissive_Lite.jpg',
  ])

  const { centeredScene, fitScale, framedDistance } = useMemo(() => {
    const cloned = scene.clone(true)

    shipBaseMap.colorSpace = THREE.SRGBColorSpace
    shipEmissiveMap.colorSpace = THREE.SRGBColorSpace
    shipBaseMap.flipY = false
    shipEmissiveMap.flipY = false
    shipBaseMap.anisotropy = 4
    shipBaseMap.needsUpdate = true
    shipEmissiveMap.needsUpdate = true

    cloned.traverse((node) => {
      if (!node.isMesh) return
      const mats = Array.isArray(node.material) ? node.material : [node.material]
      mats.forEach((m) => {
        m.map = shipBaseMap
        m.emissiveMap = shipEmissiveMap
        m.normalMap = null
        m.aoMap = null
        m.roughnessMap = null
        m.metalnessMap = null
        m.emissive = new THREE.Color('#ffffff')
        m.emissiveIntensity = 0.75
        m.metalness = 0.35
        m.roughness = 0.82
        m.color = new THREE.Color('#ffffff')
        m.envMapIntensity = 0
        m.needsUpdate = true
      })
    })

    cloned.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1

    const sphere = box.getBoundingSphere(new THREE.Sphere())
    dragRef.current.shipDepth = sphere.center.z
    const scaledRadius = sphere.radius * (10.8 / maxDim)
    const fov = THREE.MathUtils.degToRad(42)
    const fitHeightDistance = scaledRadius / Math.tan(fov / 2)
    const fitWidthDistance = fitHeightDistance / 0.75
    const cameraDistance = Math.max(fitHeightDistance, fitWidthDistance) * 0.92

    return {
      centeredScene: cloned,
      fitScale: 10.8 / maxDim,
      framedDistance: cameraDistance,
    }
  }, [scene, shipBaseMap, shipEmissiveMap])

  useEffect(() => {
    if (dragRef.current.framed) return
    dragRef.current.zoom = framedDistance
    dragRef.current.minZoom = framedDistance * 0.7
    dragRef.current.maxZoom = framedDistance * 2.2
    dragRef.current.framed = true
  }, [dragRef, framedDistance])

  useEffect(() => {
    onReady?.()
  }, [onReady])

  useFrame((_, delta) => {
    if (!outerGroup.current) return
    const ph = phaseRef.current
    const t = performance.now() / 1000

    if (ph === 'idle' || ph === 'portal') {
      const floatY = Math.sin(t * 1.6) * 0.22 + Math.sin(t * 0.55) * 0.06
      const floatRoll = Math.sin(t * 1.1) * 0.032 + Math.sin(t * 0.4) * 0.01
      const floatPitch = Math.sin(t * 0.8) * 0.018

      outerGroup.current.rotation.y = THREE.MathUtils.damp(
        outerGroup.current.rotation.y, dragRef.current.rotY, 10, delta,
      )
      outerGroup.current.rotation.x = THREE.MathUtils.damp(
        outerGroup.current.rotation.x, dragRef.current.rotX + floatPitch, 12, delta,
      )
      outerGroup.current.rotation.z = THREE.MathUtils.damp(
        outerGroup.current.rotation.z, floatRoll, 10, delta,
      )
      outerGroup.current.position.y = THREE.MathUtils.damp(
        outerGroup.current.position.y, floatY, 10, delta,
      )
    } else {
      const currentY = outerGroup.current.rotation.y
      const deltaY = Math.atan2(Math.sin(Math.PI - currentY), Math.cos(Math.PI - currentY))
      outerGroup.current.rotation.y = currentY + deltaY * (1 - Math.exp(-6.2 * delta))
      outerGroup.current.rotation.x = THREE.MathUtils.damp(
        outerGroup.current.rotation.x, 0, 5.5, delta,
      )
      outerGroup.current.rotation.z = THREE.MathUtils.damp(
        outerGroup.current.rotation.z, 0, 8, delta,
      )
      outerGroup.current.position.y = THREE.MathUtils.damp(
        outerGroup.current.position.y, 0, 5.5, delta,
      )
    }
  })

  return (
    <group ref={outerGroup}>
      <Center>
        <primitive object={centeredScene} scale={fitScale} />
      </Center>
    </group>
  )
}

// ── Portal: circular electric ring with dark core (GotG-like) ─────────────────
function PortalEffect({ phaseRef }) {
  const groupRef = useRef(null)
  const ringRef = useRef(null)
  const haloRef = useRef(null)
  const arcGeomRef = useRef(null)
  const innerStarsRef = useRef(null)
  const innerStarsMatRef = useRef(null)
  const portalStartRef = useRef(0)
  const launchRef = useRef(0)
  const arcTickRef = useRef(0)

  const arcMeta = useMemo(() => ({ bolts: 18, segsPerBolt: 7 }), [])
  const arcPositions = useMemo(
    () => new Float32Array(arcMeta.bolts * arcMeta.segsPerBolt * 2 * 3),
    [arcMeta],
  )
  const innerStarPositions = useMemo(() => {
    const starCount = 460
    const arr = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.75) * 0.86
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = Math.sin(a) * r
      // Keep stars slightly in front of the core plane so they stay visible.
      arr[i * 3 + 2] = 0.02 + Math.random() * 0.06
    }
    return arr
  }, [])

  const coreTexture = useMemo(() => {
    const size = 512
    const cv = document.createElement('canvas')
    cv.width = cv.height = size
    const ctx = cv.getContext('2d')
    const c = size / 2

    const bg = ctx.createRadialGradient(c, c, 0, c, c, c)
    bg.addColorStop(0, 'rgba(0,0,0,0.98)')
    bg.addColorStop(0.68, 'rgba(6,5,40,0.95)')
    bg.addColorStop(0.9, 'rgba(16,56,180,0.8)')
    bg.addColorStop(1, 'rgba(120,240,255,0.10)')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)

    return new THREE.CanvasTexture(cv)
  }, [])

  const haloTexture = useMemo(() => {
    const size = 512
    const cv = document.createElement('canvas')
    cv.width = cv.height = size
    const ctx = cv.getContext('2d')
    const c = size / 2
    const g = ctx.createRadialGradient(c, c, c * 0.55, c, c, c)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.76, 'rgba(30,120,255,0.18)')
    g.addColorStop(0.9, 'rgba(90,230,255,0.45)')
    g.addColorStop(1, 'rgba(120,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(cv)
  }, [])

  const rebuildArcs = (energy = 1) => {
    const arr = arcPositions
    let p = 0
    for (let b = 0; b < arcMeta.bolts; b++) {
      const baseA = Math.random() * Math.PI * 2
      const span = THREE.MathUtils.lerp(0.18, 0.42, Math.random())
      const r0 = THREE.MathUtils.lerp(0.98, 1.05, Math.random())
      const r1 = THREE.MathUtils.lerp(1.09, 1.22, Math.random()) + energy * 0.08

      let lastX = Math.cos(baseA) * r0
      let lastY = Math.sin(baseA) * r0
      for (let s = 1; s <= arcMeta.segsPerBolt; s++) {
        const t = s / arcMeta.segsPerBolt
        const a = baseA + span * (t - 0.5)
        const r = THREE.MathUtils.lerp(r0, r1, t) + (Math.random() - 0.5) * 0.06 * energy
        const nx = Math.cos(a) * r
        const ny = Math.sin(a) * r

        arr[p++] = lastX; arr[p++] = lastY; arr[p++] = (Math.random() - 0.5) * 0.02
        arr[p++] = nx;    arr[p++] = ny;    arr[p++] = (Math.random() - 0.5) * 0.02
        lastX = nx
        lastY = ny
      }
    }
    if (arcGeomRef.current) {
      arcGeomRef.current.attributes.position.needsUpdate = true
      arcGeomRef.current.computeBoundingSphere()
    }
  }

  useEffect(() => {
    rebuildArcs(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const ph = phaseRef.current

    if (ph === 'idle') {
      groupRef.current.scale.setScalar(0.001)
      portalStartRef.current = 0
      launchRef.current = 0
      return
    }

    let energy = 1
    if (ph === 'portal') {
      if (!portalStartRef.current) portalStartRef.current = performance.now()
      const t = THREE.MathUtils.clamp((performance.now() - portalStartRef.current) / 1000 / 0.62, 0, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 5.1, eased))
      energy = THREE.MathUtils.lerp(1.0, 1.25, eased)
    }

    if (ph === 'launching') {
      if (!launchRef.current) launchRef.current = performance.now()
      const elapsed = (performance.now() - launchRef.current) / 1000
      groupRef.current.scale.setScalar(5.1 + elapsed * elapsed * 30)
      energy = 1.8 + elapsed * 0.8
    }

    // Gentle pulse on ring and halo for electric look.
    const t = performance.now() / 1000
    if (ringRef.current) ringRef.current.scale.setScalar(1 + Math.sin(t * 7.5) * 0.015 * energy)
    if (haloRef.current) haloRef.current.material.opacity = 0.44 + Math.sin(t * 5.6) * 0.12
    if (innerStarsRef.current) innerStarsRef.current.rotation.z -= delta * 0.2
    if (innerStarsMatRef.current) {
      innerStarsMatRef.current.opacity = 0.78 + Math.sin(t * 11.5) * 0.18
      innerStarsMatRef.current.size = 0.02 + Math.sin(t * 8.2) * 0.003
    }

    arcTickRef.current += delta
    if (arcTickRef.current > 0.06) {
      arcTickRef.current = 0
      rebuildArcs(energy)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -6.7]} scale={0.001}>
      {/* Dark portal core */}
      <mesh>
        <circleGeometry args={[0.93, 96]} />
        <meshBasicMaterial
          map={coreTexture}
          transparent
          opacity={0.84}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Starfield inside portal core */}
      <points ref={innerStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[innerStarPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={innerStarsMatRef}
          color="#f2fdff"
          size={0.02}
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthTest={false}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      {/* Electric cyan ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.06, 0.088, 20, 180]} />
        <meshStandardMaterial emissive="#73f6ff" emissiveIntensity={11} color="#031523" toneMapped={false} />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh ref={haloRef}>
        <circleGeometry args={[1.52, 96]} />
        <meshBasicMaterial
          map={haloTexture}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Electric arc sparks around ring */}
      <lineSegments>
        <bufferGeometry ref={arcGeomRef}>
          <bufferAttribute attach="attributes-position" args={[arcPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#bbf7ff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <pointLight color="#58d7ff" intensity={14} distance={30} decay={2} />
      <pointLight color="#9ac2ff" intensity={8} distance={18} decay={2} />
    </group>
  )
}

useGLTF.preload('/models/milano/Milano_GotG.gltf')
useTexture.preload('/models/milano/images/00_BaseColor_Lite.jpg')
useTexture.preload('/models/milano/images/00_Emissive_Lite.jpg')

// ── Main export ────────────────────────────────────────────────────────────────
export default function LaunchIntro({ onComplete }) {
  const [phase, setPhase] = useState('idle')
  const [modelReady, setModelReady] = useState(false)
  const [allowSkip, setAllowSkip] = useState(false)
  const phaseRef = useRef('idle')
  const dragRef  = useRef({
    rotY: 0,
    rotX: 0,
    zoom: 14,
    minZoom: 10,
    maxZoom: 24,
    framed: false,
  })
  const timerRef = useRef(null)
  const launchStartRef = useRef(0)

  const startLaunch = () => {
    if (phaseRef.current !== 'idle' || (!modelReady && !allowSkip)) return
    dragRef.current.rotX = 0
    // Phase 1: portal opens in background (~0.9 s)
    phaseRef.current = 'portal'
    setPhase('portal')
    // Phase 2: after portal is fully open, ship punches through
    timerRef.current = setTimeout(() => {
      launchStartRef.current = performance.now()
      phaseRef.current = 'launching'
      setPhase('launching')
      timerRef.current = setTimeout(() => onComplete?.(), 1980)
    }, 900)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (modelReady) return undefined
    const slowNetworkTimer = setTimeout(() => setAllowSkip(true), 7000)
    return () => clearTimeout(slowNetworkTimer)
  }, [modelReady])

  return (
    <div className={`${styles.root} ${phase === 'launching' ? styles.launching : ''}`}>

      <header className={styles.header}>
        <span className={styles.kicker}>MILANO · GUARDIANS OF THE GALAXY</span>
        <h1 className={styles.title}>Sambhav Sehgal</h1>
        <p className={styles.sub}>Software Developer · Portfolio</p>
      </header>

      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [0, 0.2, 7], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.1
            gl.setClearColor(new THREE.Color('#050510'), 1)
          }}
        >
          <Stars phaseRef={phaseRef} launchStartRef={launchStartRef} />
          <PortalEffect phaseRef={phaseRef} />

          <ambientLight intensity={1.4} color="#d0e8ff" />
          <directionalLight position={[8, 6, 6]}   intensity={2.8} color="#ffffff" />
          <directionalLight position={[-8, 2, -5]} intensity={1.4} color="#6ab8ff" />
          <directionalLight position={[0, -5, 4]}  intensity={0.6} color="#4060a0" />

          <Suspense fallback={null}>
            <MilanoModel dragRef={dragRef} phaseRef={phaseRef} onReady={() => setModelReady(true)} />
          </Suspense>
          <CameraController dragRef={dragRef} phaseRef={phaseRef} launchStartRef={launchStartRef} />
          <DragHandler      dragRef={dragRef} phaseRef={phaseRef} />
        </Canvas>
      </div>

      <div className={styles.bloomPulse} aria-hidden="true" />

      <LoadingOverlay modelReady={modelReady} />

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.launchBtn}
          onClick={startLaunch}
          disabled={phase !== 'idle' || (!modelReady && !allowSkip)}
        >
          {phase === 'portal' ? 'OPENING PORTAL…' : phase !== 'idle' ? 'LAUNCHING…' : modelReady || allowSkip ? 'LAUNCH' : 'LOADING…'}
        </button>
        <p className={styles.hint}>
          {allowSkip && !modelReady
            ? 'Slow network detected · Launch available without full model textures'
            : 'Drag to rotate · Scroll to zoom'}
        </p>
      </footer>

    </div>
  )
}
