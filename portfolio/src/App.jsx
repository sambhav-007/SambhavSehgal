import { Component, useEffect, useState } from 'react'
import TunnelExperience from './components/TunnelExperience'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import LaunchIntro from './components/LaunchIntro'
import './App.css'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Keep this for local debugging in devtools.
    console.error('Root render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fatalScreen" role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'A runtime error crashed the UI.'}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppContent() {
  const [launched, setLaunched] = useState(false)
  const [runtimeError, setRuntimeError] = useState(null)

  useEffect(() => {
    const onError = (event) => {
      const msg = event?.error?.message || event?.message || 'Unhandled runtime error.'
      setRuntimeError(msg)
    }
    const onRejection = (event) => {
      const reason = event?.reason
      setRuntimeError(reason?.message || String(reason || 'Unhandled promise rejection.'))
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  useEffect(() => {
    if (launched) return undefined
    // Failsafe: never stay stuck on an intro black screen.
    const introFailsafe = setTimeout(() => setLaunched(true), 12000)
    return () => clearTimeout(introFailsafe)
  }, [launched])

  if (runtimeError) {
    return (
      <div className="fatalScreen" role="alert">
        <h2>Runtime error</h2>
        <p>{runtimeError}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    )
  }

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

export default function App() {
  return (
    <RootErrorBoundary>
      <AppContent />
    </RootErrorBoundary>
  )
}
