import TunnelExperience from './components/TunnelExperience'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <CustomCursor />
      <ParticleBackground />
      <TunnelExperience />
    </div>
  )
}
