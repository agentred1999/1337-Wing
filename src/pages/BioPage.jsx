import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const story = `> My name is Richard Dean. My journey into technology began at age 12 when my Father gave me a Raspberry Pi. That small, unassuming board sparked a persistent drive to explore hardware, Linux, and secure systems. Over the years, I've expanded my skills through robotics, modular computing projects, and Linux-first devices.

> In 2025 I founded 1337 Wing. Our mission is to develop modular, Linux-first hardware with maximum durability, tactical usability, and adaptability for security professionals and open-source communities. Each product is built with modularity, repairability, and precision in mind.

> Outside of development, I focus on personal projects, tech experimentation, and enjoying Vietnamese coffee as I map out the next innovation in secure technology.

> Core Focus Areas:
  ▸ Modular, repairable, and upgradeable devices
  ▸ Linux-first, open-source hardware ecosystem
  ▸ Tools designed for real-world security applications
  ▸ Community education and responsible knowledge sharing`

export default function BioPage() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const containerRef = useRef(null)

  useEffect(() => {
    function type() {
      if (indexRef.current < story.length) {
        const char = story[indexRef.current]
        setDisplayed(prev => prev + char)
        indexRef.current++
        const delay = char === '\n' ? 50 : 15
        setTimeout(type, delay)
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      } else {
        setDone(true)
      }
    }
    type()
  }, [])

  return (
    <div style={{
      margin: 0,
      fontFamily: "'Courier New', Courier, monospace",
      background: '#000814',
      color: '#B9D9EB',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      padding: '60px 20px',
    }}>
      <style>{`
        @keyframes glow {
          from { box-shadow: 0 0 10px rgba(0,255,156,0.2); }
          to   { box-shadow: 0 0 25px rgba(0,255,156,0.5); }
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .bio-back:hover {
          background: #00FF9C !important;
          color: #001429 !important;
        }
      `}</style>

      <div style={{
        background: 'black',
        color: '#00ff9c',
        padding: 20,
        fontFamily: 'monospace',
        border: '1px solid #B9D9EB',
        margin: '40px auto',
        maxWidth: 900,
        width: '100%',
        minHeight: 100,
        animation: 'glow 2s infinite alternate',
      }}>
        <div ref={containerRef} style={{
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
          fontSize: '1.2rem',
          overflowY: 'auto',
        }}>
          {displayed}
          {!done && (
            <span style={{
              display: 'inline-block',
              background: '#00FF9C',
              width: 8,
              height: '1em',
              marginLeft: 2,
              verticalAlign: 'bottom',
              animation: 'blink 0.8s infinite',
            }} />
          )}
        </div>
        <Link
          to="/"
          className="bio-back"
          style={{
            color: '#00FF9C',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: 40,
            border: '1px solid #00FF9C',
            padding: '10px 20px',
            borderRadius: 4,
            transition: 'all 0.3s ease',
            background: 'transparent',
          }}
        >
          ← Back to 1337 Wing
        </Link>
      </div>
    </div>
  )
}
