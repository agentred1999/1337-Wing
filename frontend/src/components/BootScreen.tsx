import { useState, useEffect } from 'react'

const SEEN_KEY = '1337wing-boot-seen'

export default function BootScreen() {
  const alreadySeen = typeof window !== 'undefined' && localStorage.getItem(SEEN_KEY) === '1'
  const [visible, setVisible] = useState(!alreadySeen)
  const [fading, setFading] = useState(false)

  const dismiss = () => {
    localStorage.setItem(SEEN_KEY, '1')
    setFading(true)
    setTimeout(() => setVisible(false), 300)
  }

  useEffect(() => {
    if (alreadySeen) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      localStorage.setItem(SEEN_KEY, '1')
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
        <button
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); dismiss() }}
          className="boot-skip-btn"
        >
          SKIP →
        </button>
      </div>
    </div>
  )
}
