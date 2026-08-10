import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useEffect, useRef } from 'react'

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart()
  const location = useLocation()
  const liveRef = useRef(null)

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Cart has ${cartCount} item${cartCount === 1 ? '' : 's'}`
    }
  }, [cartCount])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <picture><source srcSet="/1337-Wing/1337.webp" type="image/webp" /><img src="/1337-Wing/1337.jpg" className="nav-logo" alt="1337 Wing Logo" fetchpriority="high" decoding="async" /></picture>
            1337 WING
          </Link>
          <div className="nav-links">
            <a href="/#shop">SHOP</a>
            <a href="/#hn-section">INTEL FEED</a>
            <Link to="/bio" aria-current={location.pathname === '/bio' ? 'page' : undefined}>
              OUR STORY
            </Link>
            <a href="/#mission">MISSION</a>
            <button className="cta" onClick={() => setCartOpen(true)}>
              CART ({cartCount})
            </button>
          </div>
        </div>
      </nav>
      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </>
  )
}
