import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'
import { assetPath } from '../utils/assetPath'
import { useTheme } from '../hooks/useTheme'

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart()
  const { user, logout, authLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const liveRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Cart has ${cartCount} item${cartCount === 1 ? '' : 's'}`
    }
  }, [cartCount])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <picture><source srcSet={assetPath("1337.webp")} type="image/webp" /><img src={assetPath("1337.jpg")} className="nav-logo" alt="1337 Wing Logo" fetchPriority="high" decoding="async" /></picture>
            1337 WING
          </Link>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? '\u2715' : '\u2630'}
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="/#shop" onClick={closeMenu}>SHOP</a>
            <a href="/#hn-section" onClick={closeMenu}>INTEL FEED</a>
            <Link to="/bio" onClick={closeMenu} aria-current={location.pathname === '/bio' ? 'page' : undefined}>
              OUR STORY
            </Link>
            <a href="/#mission" onClick={closeMenu}>MISSION</a>
            <Link to="/thinkpad-701c" onClick={closeMenu}>701C PROJECT</Link>
            <Link to="/security" onClick={closeMenu}>SECURITY</Link>
            {!authLoading && (
              user ? (
                <>
                  <span style={{ color: '#00d4ff' }}>{user.username}</span>
                  <button className="cta" onClick={() => { handleLogout(); closeMenu() }}>LOGOUT</button>
                </>
              ) : (
                <Link to="/login" className="cta" onClick={closeMenu}>LOGIN</Link>
              )
            )}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
            <button className="cta" onClick={() => { setCartOpen(true); closeMenu() }}>
              CART ({cartCount})
            </button>
          </div>
          <div className={`nav-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu} aria-hidden="true" />
        </div>
      </nav>
      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </>
  )
}
