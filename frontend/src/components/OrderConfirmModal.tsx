import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'

export default function OrderConfirmModal() {
  const { lastOrder, clearLastOrder } = useCart()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!lastOrder) return

    triggerRef.current = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearLastOrder()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const list = Array.from(focusables).filter(el => !(el as HTMLButtonElement).disabled)
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
  }, [lastOrder, clearLastOrder])

  if (!lastOrder) return null

  const { items, total, shipping } = lastOrder

  return (
    <div className="modal" onClick={e => { if (e.target === e.currentTarget) clearLastOrder() }}>
      <div
        className="modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirm-title"
      >
        <button
          ref={closeBtnRef}
          className="close"
          onClick={clearLastOrder}
          aria-label="Close order confirmation"
        >
          &times;
        </button>

        <div
          role="status"
          style={{
            background: 'rgba(0,255,156,0.08)',
            border: '1px solid rgba(0,255,156,0.4)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 18,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.8rem',
            color: 'var(--green, #00ff9c)',
            lineHeight: 1.5,
          }}
        >
          DEMO STOREFRONT — no real order was placed and no payment was processed.
          This is a portfolio project; nothing here charges a card or ships a package.
        </div>

        <h2 id="order-confirm-title">Order Confirmed (Demo)</h2>

        <div style={{ marginTop: 14 }}>
          {items.map(i => (
            <div
              key={i.id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 10 }}
            >
              <span style={{ color: 'var(--accent-bright, #B9D9EB)' }}>
                {i.name} <span style={{ color: 'var(--muted, #8fa2b3)' }}>&times;{i.quantity}</span>
              </span>
              <span style={{ color: '#FFCC00', whiteSpace: 'nowrap' }}>${i.price * i.quantity}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--accent-bright, #B9D9EB)' }}>
          Total: ${total}
        </div>

        <div style={{ marginTop: 20, color: 'var(--green, #00ff9c)', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.9rem' }}>
          <h3 style={{ marginBottom: 8 }}>Shipped To</h3>
          <div style={{ color: 'var(--light-text, #d7e8f5)', fontFamily: 'var(--font-display, inherit)' }}>
            {shipping.name}<br />
            {shipping.street}<br />
            {shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.zip}<br />
            {shipping.country}
          </div>
        </div>

        <button onClick={clearLastOrder} className="checkout-btn" style={{ marginTop: 22 }}>
          Close
        </button>
      </div>
    </div>
  )
}
