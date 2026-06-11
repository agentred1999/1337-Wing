import { useState, useEffect } from 'react'

export default function BootScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true)
      setTimeout(() => setVisible(false), 800)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div id="boot-screen" style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
      <div className="boot-text">
        <p>&gt; initializing 1337 wing systems...</p>
        <p>&gt; loading red team toolkit...</p>
        <p>&gt; checking hardware modules...</p>
        <p>&gt; linux kernel detected</p>
        <p>&gt; starting interface...</p>
      </div>
    </div>
  )
}
