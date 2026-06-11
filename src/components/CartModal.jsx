import { useCart } from '../context/CartContext'

export default function CartModal() {
  const { cart, cartTotal, cartOpen, setCartOpen, checkout } = useCart()

  if (!cartOpen) return null

  return (
    <div className="modal" onClick={e => { if (e.target === e.currentTarget) setCartOpen(false) }}>
      <div className="modal-content">
        <span className="close" onClick={() => setCartOpen(false)}>&times;</span>
        <h2>Your Cart</h2>
        <div id="cartItems">
          {cart.length === 0
            ? <p style={{ color: '#888' }}>Your cart is empty.</p>
            : cart.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
                <span style={{ color: '#B9D9EB' }}>{i.name} x{i.quantity}</span>
                <span style={{ color: '#FFCC00', whiteSpace: 'nowrap' }}>${i.price * i.quantity}</span>
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
          {['Name', 'Street', 'City', 'ZIP', 'Country'].map(field => (
            <label key={field} style={{ display: 'block', marginTop: 14 }}>
              {field}:<br />
              <input type="text" className="ship-input" />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
