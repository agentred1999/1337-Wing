import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/1337-Wing/1337.jpg" className="nav-logo" alt="1337 Wing Logo" />
          1337 WING
        </Link>
        <div className="nav-links">
          <a href="/#shop">SHOP</a>
          <a href="/#hn-section">INTEL FEED</a>
          <Link to="/bio">OUR STORY</Link>
          <a href="/#mission">MISSION</a>
          <button className="cta" onClick={() => setCartOpen(true)}>
            CART ({cartCount})
          </button>
        </div>
      </div>
    </nav>
  )
}
