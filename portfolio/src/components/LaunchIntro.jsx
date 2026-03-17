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
    { at: 10, text: '[BOOT] Initiating Milano flight terminal...' },
    { at: 24, text: '[SYS ] Verifying hull integrity matrix...' },
    { at: 42, text: '[NAV ] Compiling stellar route maps...' },
    { at: 58, text: '[ENG ] Priming thruster control lanes...' },
    { at: 73, text: '[IO  ] Syncing cockpit telemetry feed...' },
    { at: 88, text: '[AI  ] Locking launch stabilization...' },
    { at: 100, text: '[DONE] Launch systems online.' },
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
            <p className={`${styles.logLine} ${styles.logPending}`}>[BOOT] Waiting for asset stream...</p>
          )}

          <p className={`${styles.logLine} ${styles.logOn}`}>
            {'>'} {shownProgress < 100 ? 'Awaiting final subsystem response' : 'Press LAUNCH to engage'}
            <span className={styles.loaderCursor}>_</span>
          </p>
        </div>

        <div className={styles.loaderTrack}>
          <span style={{ width: `${shownProgress}%` }} />
        </div>

        <div className={styles.loaderMeta}>
          <p className={styles.loaderState}>{shownProgress < 100 ? 'ENGINES PRIMING' : 'READY FOR LAUNCH'}</p>
          <p className={styles.loaderSub}>Synchronizing cockpit systems</p>
        </div>
      </div>
    </div>
  )
}

// ── Drag + zoom handler attached directly to the canvas DOM element ────────────
// This rotates the model, NOT the camera/environment
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

    if (phaseRef.current === 'idle') {
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
        // Stage 1: micro pullback and settle.
        const p = easeInOutCubic(setupT)
        tz = THREE.MathUtils.lerp(dragRef.current.zoom, dragRef.current.zoom + 2.4, p)
        ty = THREE.MathUtils.lerp(0, 0.08, p)
        tfov = THREE.MathUtils.lerp(42, 44, p)
        lookZ = THREE.MathUtils.lerp(shipDepth, shipDepth - 1.5, p)
      } else if (launchElapsed <= setupDuration + blastDuration) {
        // Stage 2: aggressive dive-in.
        const p = easeInCubic(blastT)
        // Stop just behind the ship nose; do not cross past and look back.
        tz = THREE.MathUtils.lerp(dragRef.current.zoom + 2.4, 1.0, p)
        ty = THREE.MathUtils.lerp(0.08, 0, p)
        tfov = THREE.MathUtils.lerp(44, 76, p)
        lookZ = THREE.MathUtils.lerp(shipDepth - 1.5, shipDepth - 26, p)
      } else {
        // Stage 3: tunnel lock while still behind ship to avoid turnaround.
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

    // Keep camera always centered on ship pivot to prevent apparent orbit drift.
    camera.lookAt(lookX, lookY, lookZ)
    camera.updateProjectionMatrix()
  })

  return null
}

// ── Ship model: user-rotatable in idle, animates to rear-facing on launch ──────
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

    // Use compressed real textures to preserve authentic Milano paint scheme.
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

    // Compute pivot from mesh geometry only (exclude lights/cameras/helper nodes).
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
    const cameraDistance = Math.max(fitHeightDistance, fitWidthDistance) * 1.15

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

    if (ph === 'idle') {
      // Follow drag target smoothly
      outerGroup.current.rotation.y = THREE.MathUtils.damp(
        outerGroup.current.rotation.y, dragRef.current.rotY, 8, delta,
      )
      outerGroup.current.rotation.x = THREE.MathUtils.damp(
        outerGroup.current.rotation.x, dragRef.current.rotX, 8, delta,
      )
      outerGroup.current.position.y = THREE.MathUtils.damp(
        outerGroup.current.position.y, 0, 8, delta,
      )
    } else {
      // Turn rear toward camera, keep ship dead straight during punch-in.
      // Shortest-path angle damping avoids full spins from large drag angles.
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

useGLTF.preload('/models/milano/Milano_GotG.gltf')
useTexture.preload('/models/milano/images/00_BaseColor_Lite.jpg')
useTexture.preload('/models/milano/images/00_Emissive_Lite.jpg')

// ── Main export ────────────────────────────────────────────────────────────────
export default function LaunchIntro({ onComplete }) {
  const [phase, setPhase] = useState('idle')
  const [modelReady, setModelReady] = useState(false)
  const [allowSkip, setAllowSkip] = useState(false)
  // phaseRef avoids stale closures inside canvas callbacks
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
    launchStartRef.current = performance.now()
    phaseRef.current = 'launching'
    setPhase('launching')
    // Handoff aligns with full camera blast timing.
    timerRef.current = setTimeout(() => onComplete?.(), 1980)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (modelReady) return undefined
    const slowNetworkTimer = setTimeout(() => setAllowSkip(true), 7000)
    return () => clearTimeout(slowNetworkTimer)
  }, [modelReady])

  return (
    <div className={`${styles.root} ${phase === 'launching' ? styles.launching : ''}`}>

      {/* Text header */}
      <header className={styles.header}>
        <span className={styles.kicker}>MILANO · GUARDIANS OF THE GALAXY</span>
        <h1 className={styles.title}>Sambhav Sehgal</h1>
        <p className={styles.sub}>Software Developer · Portfolio</p>
      </header>

      {/* Full-screen 3D canvas */}
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
          {/* Static star field — no frame animation */}
          <Stars phaseRef={phaseRef} launchStartRef={launchStartRef} />

          {/* Pure local lighting — no CDN dependency */}
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

      {/* Launch controls */}
      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.launchBtn}
          onClick={startLaunch}
          disabled={phase !== 'idle' || (!modelReady && !allowSkip)}
        >
          {phase !== 'idle' ? 'LAUNCHING…' : modelReady || allowSkip ? 'LAUNCH' : 'LOADING…'}
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
