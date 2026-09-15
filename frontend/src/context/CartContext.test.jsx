import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import { useCartStore } from '../store/cartStore'

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>
}

const mockProduct = { id: 'mesh-node', name: 'Mesh Node', price: 89 }
const mockProduct2 = { id: 'keycaps', name: 'Custom Keycaps', price: 45 }

beforeEach(() => {
  useCartStore.setState({
    cart: [],
    cartOpen: false,
    toast: null,
    shipping: { name: '', street: '', city: '', state: '', zip: '', country: 'United States' },
  })
})

describe('CartContext', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.cart).toEqual([])
    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartTotal).toBe(0)
  })

  it('adds a product to the cart with quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].id).toBe('mesh-node')
    expect(result.current.cart[0].quantity).toBe(1)
  })

  it('increments quantity instead of duplicating when adding the same product twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.addToCart(mockProduct))
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('increases quantity via increaseQuantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.increaseQuantity('mesh-node'))
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('decreases quantity via decreaseQuantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.increaseQuantity('mesh-node'))
    act(() => result.current.decreaseQuantity('mesh-node'))
    expect(result.current.cart[0].quantity).toBe(1)
  })

  it('auto-removes an item when quantity is decreased to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.decreaseQuantity('mesh-node'))
    expect(result.current.cart).toHaveLength(0)
  })

  it('removes an item entirely via removeFromCart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.addToCart(mockProduct2))
    act(() => result.current.removeFromCart('mesh-node'))
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].id).toBe('keycaps')
  })

  it('computes cartCount as total quantity across all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.addToCart(mockProduct2))
    act(() => result.current.increaseQuantity('mesh-node'))
    expect(result.current.cartCount).toBe(3)
  })

  it('computes cartTotal as sum of price * quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addToCart(mockProduct))
    act(() => result.current.addToCart(mockProduct2))
    act(() => result.current.increaseQuantity('mesh-node'))
    expect(result.current.cartTotal).toBe(89 * 2 + 45)
  })
})
