import { useCart } from '../context/CartContext'
import { useEffect, useRef } from 'react'

export default function CartModal() {
  const { cart, cartTotal, cartOpen, setCartOpen, checkout, removeFromCart, decreaseQuantity, increaseQuantity } = useCart()
  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!cartOpen) return

    triggerRef.current = document.activeElement
    closeBtnRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCartOpen(false)
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const list = Array.from(focusables).filter(el => !el.disabled)
        if (list.length === 0) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  return (
    <div className="modal" onClick={e => { if (e.target === e.currentTarget) setCartOpen(false) }}>
      <div
        className="modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
      >
        <button
          ref={closeBtnRef}
          className="close"
          onClick={() => setCartOpen(false)}
          aria-label="Close cart"
        >
          &times;
        </button>
        <h2 id="cart-modal-title">Your Cart</h2>
        <div id="cartItems" aria-live="polite">
          {cart.length === 0
            ? <p style={{ color: '#888' }}>Your cart is empty.</p>
            : cart.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                <span style={{ color: '#B9D9EB' }}>{i.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => decreaseQuantity(i.id)}
                    aria-label={`Decrease quantity of ${i.name}`}
                    style={{ background: 'none', border: '1px solid #444', color: '#B9D9EB', cursor: 'pointer', width: 24, height: 24 }}
                  >
                    −
                  </button>
                  <span style={{ color: '#B9D9EB', minWidth: 16, textAlign: 'center' }}>{i.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(i.id)}
                    aria-label={`Increase quantity of ${i.name}`}
                    style={{ background: 'none', border: '1px solid #444', color: '#B9D9EB', cursor: 'pointer', width: 24, height: 24 }}
                  >
                    +
                  </button>
                </div>
                <span style={{ color: '#FFCC00', whiteSpace: 'nowrap' }}>${i.price * i.quantity}</span>
                <button
                  onClick={() => removeFromCart(i.id)}
                  aria-label={`Remove ${i.name} from cart`}
                  style={{ background: 'none', border: 'none', color: '#ff5c5c', cursor: 'pointer', fontSize: 16 }}
                >
                  &times;
                </button>
              </div>
            ))
          }
        </div>
        {cartTotal > 0 && (
          <div style={{ marginTop: 10, fontWeight: 'bold', color: '#B9D9EB' }}>Total: ${cartTotal}</div>
        )}
        <button onClick={checkout} className="checkout-btn">Checkout</button>
        <div style={{ marginTop: 20, color: '#00ff9c', fontFamily: 'monospace' }}>
          <h3>Shipping Info</h3>
          {['Name', 'Street', 'City', 'ZIP', 'Country'].map(field => {
            const id = `ship-${field.toLowerCase()}`
            return (
              <label key={field} htmlFor={id} style={{ display: 'block', marginTop: 14 }}>
                {field}:<br />
                <input id={id} type="text" className="ship-input" />
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
