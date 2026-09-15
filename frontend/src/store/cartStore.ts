import { create } from 'zustand';
import { apiFetch } from '../utils/api';

import type { Product } from '../data/products';

export interface CartProduct extends Product {
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface LastOrder {
  items: CartProduct[];
  total: number;
  shipping: ShippingInfo;
}

const EMPTY_SHIPPING: ShippingInfo = {
  name: '', email: '', street: '', city: '', state: '', zip: '', country: 'United States',
};

interface OrderResponse {
  id: string;
}

interface PaymentIntentResponse {
  clientSecret: string;
}

interface CartState {
  cart: CartProduct[];
  cartOpen: boolean;
  toast: string | null;
  shipping: ShippingInfo;
  lastOrder: LastOrder | null;
  clientSecret: string | null;
  checkoutOrderId: string | null;
  checkoutLoading: boolean;
  pendingOrder: LastOrder | null;
  setCartOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  updateShipping: (field: keyof ShippingInfo, value: string) => void;
  addToCart: (product: Omit<CartProduct, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  checkout: (userId: string | null) => Promise<void>;
  confirmOrderPaid: () => void;
  cancelPayment: () => void;
  clearLastOrder: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  cartOpen: false,
  toast: null,
  shipping: EMPTY_SHIPPING,
  lastOrder: null,
  clientSecret: null,
  checkoutOrderId: null,
  checkoutLoading: false,
  pendingOrder: null,

  setCartOpen: (open) => set({ cartOpen: open }),

  showToast: (message) => {
    set({ toast: message });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 2200);
  },

  updateShipping: (field, value) =>
    set((state) => ({ shipping: { ...state.shipping, [field]: value } })),

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((x) => x.id === product.id);
      const cart = existing
        ? state.cart.map((x): CartProduct => (x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x))
        : [...state.cart, { ...product, quantity: 1 } as CartProduct];
      return { cart };
    });
    get().showToast(`Added "${product.name}" to cart`);
  },

  removeFromCart: (productId) =>
    set((state) => ({ cart: state.cart.filter((x) => x.id !== productId) })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart
        .map((x): CartProduct => (x.id === productId ? { ...x, quantity: x.quantity - 1 } : x))
        .filter((x) => x.quantity > 0),
    })),

  increaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart.map((x): CartProduct => (x.id === productId ? { ...x, quantity: x.quantity + 1 } : x)),
    })),

  checkout: async (userId) => {
    const { cart, shipping } = get();

    if (!cart.length) {
      get().showToast('Your cart is empty!');
      return;
    }
    if (!shipping.name || !shipping.street || !shipping.city || !shipping.zip || !shipping.country) {
      get().showToast('Please fill in your shipping details before checking out.');
      return;
    }
    if (!userId && !shipping.email) {
      get().showToast('Please provide an email for your order confirmation.');
      return;
    }

    set({ checkoutLoading: true });

    const items = cart.map((i) => ({ product_id: i.id, quantity: i.quantity }));
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
      const order = userId
        ? await apiFetch<OrderResponse>('/api/orders', {
            method: 'POST',
            body: JSON.stringify({ items }),
          })
        : await apiFetch<OrderResponse>('/api/orders/guest', {
            method: 'POST',
            body: JSON.stringify({
              items,
              guest: {
                name: shipping.name,
                email: shipping.email,
                street: shipping.street,
                city: shipping.city,
                state: shipping.state,
                zip: shipping.zip,
                country: shipping.country,
              },
            }),
          });

      const { clientSecret } = await apiFetch<PaymentIntentResponse>(
        `/api/payments/${order.id}/create-intent`,
        { method: 'POST' }
      );

      set({
        clientSecret,
        checkoutOrderId: order.id,
        pendingOrder: { items: cart, total: cartTotal, shipping },
        checkoutLoading: false,
      });
    } catch (err) {
      get().showToast(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      set({ checkoutLoading: false });
    }
  },

  confirmOrderPaid: () => {
    const { pendingOrder } = get();
    set({
      lastOrder: pendingOrder,
      cart: [],
      shipping: EMPTY_SHIPPING,
      cartOpen: false,
      clientSecret: null,
      checkoutOrderId: null,
      pendingOrder: null,
    });
  },

  cancelPayment: () =>
    set({ clientSecret: null, checkoutOrderId: null, pendingOrder: null }),

  clearLastOrder: () => set({ lastOrder: null }),
}));
