import type { ReactNode } from 'react';
import { useCartStore } from '../store/cartStore';

export function useCart() {
  const cart = useCartStore((s) => s.cart);
  const cartOpen = useCartStore((s) => s.cartOpen);
  const toast = useCartStore((s) => s.toast);
  const shipping = useCartStore((s) => s.shipping);
  const lastOrder = useCartStore((s) => s.lastOrder);
  const clientSecret = useCartStore((s) => s.clientSecret);
  const checkoutLoading = useCartStore((s) => s.checkoutLoading);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const updateShipping = useCartStore((s) => s.updateShipping);
  const checkout = useCartStore((s) => s.checkout);
  const confirmOrderPaid = useCartStore((s) => s.confirmOrderPaid);
  const cancelPayment = useCartStore((s) => s.cancelPayment);
  const clearLastOrder = useCartStore((s) => s.clearLastOrder);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    cart, addToCart, removeFromCart, decreaseQuantity, increaseQuantity,
    cartCount, cartTotal, cartOpen, setCartOpen, checkout, toast,
    shipping, updateShipping, lastOrder, clearLastOrder,
    clientSecret, checkoutLoading, confirmOrderPaid, cancelPayment,
  };
}

// No-op — kept so App.jsx doesn't need to change. Zustand needs no provider.
export function CartProvider({ children }: { children: ReactNode }) {
  return children;
}
