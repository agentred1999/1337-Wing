import { useState, useEffect } from 'react'

export default function BootScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  const dismiss = () => {
    setFading(true)
    setTimeout(() => setVisible(false), 300)
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisible(false)
      return
    }

    const timer = setTimeout(dismiss, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      id="boot-screen"
      aria-hidden="true"
      onClick={dismiss}
      role="presentation"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease', cursor: 'pointer' }}
    >
      <div className="boot-text">
        <p>&gt; initializing 1337 wing systems...</p>
        <p>&gt; loading red team toolkit...</p>
        <p>&gt; checking hardware modules...</p>
        <p>&gt; linux kernel detected</p>
        <p>&gt; starting interface...</p>
        <p style={{ marginTop: 16, fontSize: '0.8rem', opacity: 0.6 }}>(click to skip)</p>
      </div>
    </div>
  )
}
