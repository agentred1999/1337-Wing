import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast } = useCart()

  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: '#121212',
        border: '1px solid #00ff9c',
        color: '#00ff9c',
        fontFamily: 'monospace',
        padding: '12px 18px',
        borderRadius: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        zIndex: 9999,
        animation: 'toast-in 0.25s ease-out'
      }}
    >
      ✓ {toast}
    </div>
  )
}
