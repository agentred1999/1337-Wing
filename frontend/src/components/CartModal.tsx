import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef } from 'react'
import { getCountryConfig } from '../data/countryFieldConfig'
import StripeCheckout from './StripeCheckout'

const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'Ireland',
  'Australia', 'New Zealand', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden',
  'Norway', 'Denmark', 'Finland', 'Poland', 'Portugal', 'Greece',
  'Japan', 'South Korea', 'China', 'India', 'Singapore',
  'Brazil', 'Argentina', 'Chile', 'South Africa'
]

export default function CartModal() {
  const {
    cart, cartTotal, cartOpen, setCartOpen, checkout,
    removeFromCart, decreaseQuantity, increaseQuantity,
    shipping, updateShipping, clientSecret, checkoutLoading,
    confirmOrderPaid, cancelPayment,
  } = useCart()
  const { user } = useAuth()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!cartOpen) return

    triggerRef.current = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false)
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const list = Array.from(focusables).filter(el => !(el as HTMLButtonElement | HTMLInputElement).disabled)
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

  const fieldConfig = getCountryConfig(shipping.country)

  const handleCountryChange = (nextCountry: string) => {
    updateShipping('country', nextCountry)
    // Reset state whenever the country changes so a stale value from the
    // previous country's list (or free text) can't silently persist into
    // a dropdown that doesn't contain it.
    updateShipping('state', '')
  }

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

        {clientSecret ? (
          <StripeCheckout
            clientSecret={clientSecret}
            onSuccess={confirmOrderPaid}
            onCancel={cancelPayment}
          />
        ) : (
          <>
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

            <div style={{ marginTop: 20, color: '#00ff9c', fontFamily: 'monospace' }}>
              <h3>Shipping Info</h3>

              <label htmlFor="ship-country" style={{ display: 'block', marginTop: 14 }}>
                Country:<br />
                <select
                  id="ship-country"
                  className="ship-input"
                  value={shipping.country}
                  onChange={e => handleCountryChange(e.target.value)}
                >
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label htmlFor="ship-name" style={{ display: 'block', marginTop: 14 }}>
                Name:<br />
                <input
                  id="ship-name" type="text" className="ship-input"
                  value={shipping.name}
                  onChange={e => updateShipping('name', e.target.value)}
                />
              </label>

              {!user && (
                <label htmlFor="ship-email" style={{ display: 'block', marginTop: 14 }}>
                  Email:<br />
                  <input
                    id="ship-email" type="email" className="ship-input"
                    value={shipping.email}
                    onChange={e => updateShipping('email', e.target.value)}
                  />
                </label>
              )}

              <label htmlFor="ship-street" style={{ display: 'block', marginTop: 14 }}>
                Street:<br />
                <input
                  id="ship-street" type="text" className="ship-input"
                  value={shipping.street}
                  onChange={e => updateShipping('street', e.target.value)}
                />
              </label>

              <label htmlFor="ship-city" style={{ display: 'block', marginTop: 14 }}>
                City:<br />
                <input
                  id="ship-city" type="text" className="ship-input"
                  value={shipping.city}
                  onChange={e => updateShipping('city', e.target.value)}
                />
              </label>

              {fieldConfig.showState && (
                <label htmlFor="ship-state" style={{ display: 'block', marginTop: 14 }}>
                  {fieldConfig.stateLabel}:<br />
                  {fieldConfig.states ? (
                    <select
                      id="ship-state"
                      className="ship-input"
                      value={shipping.state}
                      onChange={e => updateShipping('state', e.target.value)}
                    >
                      <option value="" disabled>
                        Select {fieldConfig.stateLabel.toLowerCase()}...
                      </option>
                      {fieldConfig.states.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="ship-state" type="text" className="ship-input"
                      value={shipping.state}
                      onChange={e => updateShipping('state', e.target.value)}
                    />
                  )}
                </label>
              )}

              <label htmlFor="ship-zip" style={{ display: 'block', marginTop: 14 }}>
                {fieldConfig.zipLabel}:<br />
                <input
                  id="ship-zip" type="text" className="ship-input"
                  placeholder={fieldConfig.zipPlaceholder}
                  value={shipping.zip}
                  onChange={e => updateShipping('zip', e.target.value)}
                />
              </label>
            </div>

            <button
              onClick={() => checkout(user?.id ?? null)}
              className="checkout-btn"
              style={{ marginTop: 20, opacity: checkoutLoading ? 0.6 : 1 }}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Processing…' : 'Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
