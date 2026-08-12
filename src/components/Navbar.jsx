import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef } from 'react'
import { assetPath } from '../utils/assetPath'

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart()
  const { user, logout, authLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const liveRef = useRef(null)

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Cart has ${cartCount} item${cartCount === 1 ? '' : 's'}`
    }
  }, [cartCount])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <picture><source srcSet={assetPath("1337.webp")} type="image/webp" /><img src={assetPath("1337.jpg")} className="nav-logo" alt="1337 Wing Logo" fetchpriority="high" decoding="async" /></picture>
            1337 WING
          </Link>
          <div className="nav-links">
            <a href="/#shop">SHOP</a>
            <a href="/#hn-section">INTEL FEED</a>
            <Link to="/bio" aria-current={location.pathname === '/bio' ? 'page' : undefined}>
              OUR STORY
            </Link>
            <a href="/#mission">MISSION</a>
            <Link to="/thinkpad-701c">701C PROJECT</Link>
            {!authLoading && (
              user ? (
                <>
                  <span style={{ color: '#00d4ff' }}>{user.username}</span>
                  <button className="cta" onClick={handleLogout}>LOGOUT</button>
                </>
              ) : (
                <Link to="/login" className="cta">LOGIN</Link>
              )
            )}
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
