import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ---- Config: adjust to match your rendered frames ----
const FRAME_COUNT = 3
const FRAME_PATH = '/frames/701c'
const FRAME_PREFIX = 'frame_'
const FRAME_PAD = 4 // frame_0001.jpg
const FRAME_EXT = 'jpg'

function frameSrc(index: number): string {
  const num = String(index + 1).padStart(FRAME_PAD, '0')
  return `${FRAME_PATH}/${FRAME_PREFIX}${num}.${FRAME_EXT}`
}

export default function ThinkPad701CHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef({ frame: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const images: HTMLImageElement[] = []

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      img.onload = () => {
        if (i === 0) render()
      }
      images.push(img)
    }
    imagesRef.current = images

    function resizeCanvas() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }

    function render() {
      if (!canvas || !context) return
      const img = imagesRef.current[frameRef.current.frame]
      if (!img || !img.complete || img.naturalWidth === 0) return

      context.clearRect(0, 0, canvas.width, canvas.height)

      const canvasRatio = canvas.width / canvas.height
      const imgRatio = img.naturalWidth / img.naturalHeight
      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height
        drawWidth = drawHeight * imgRatio
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = canvas.width
        drawHeight = drawWidth / imgRatio
        offsetX = 0
        offsetY = (canvas.height - drawHeight) / 2
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=3000', // scroll distance for the full sequence — tune to taste
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        frameRef.current.frame = Math.min(
          FRAME_COUNT - 1,
          Math.floor(self.progress * FRAME_COUNT)
        )
        render()
      },
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      st.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </section>
  )
}
