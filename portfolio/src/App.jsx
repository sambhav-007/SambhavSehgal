import { useState } from 'react'
import TunnelExperience from './components/TunnelExperience'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import LaunchIntro from './components/LaunchIntro'
import './App.css'

export default function App() {
  const [launched, setLaunched] = useState(false)

  return (
    <div className="app">
      <CustomCursor />
      {!launched && <LaunchIntro onComplete={() => setLaunched(true)} />}
      {launched && (
        <>
          <ParticleBackground />
          <TunnelExperience />
        </>
      )}
    </div>
  )
}
