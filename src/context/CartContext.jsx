import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(x => x.id === product.id)
      if (existing) return prev.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const checkout = () => {
    if (!cart.length) { alert('Your cart is empty!'); return }
    let s = 'Order Summary:\n'
    cart.forEach(i => { s += `${i.name} x${i.quantity} — $${i.price * i.quantity}\n` })
    s += `\nTotal: $${cartTotal}\n\nThank you!`
    alert(s)
    setCart([])
    setCartOpen(false)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount, cartTotal, cartOpen, setCartOpen, checkout }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
