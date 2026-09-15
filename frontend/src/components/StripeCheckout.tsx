import { useState } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'

// Loaded once per app load — safe to call at module scope.
// Set VITE_STRIPE_PUBLISHABLE_KEY in your frontend .env (test key: pk_test_...)
let stripePromise: Promise<Stripe | null> | null = null
function getStripe() {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set — Stripe cannot load')
    }
    stripePromise = loadStripe(key ?? '')
  }
  return stripePromise
}

interface StripeCheckoutProps {
  clientSecret: string
  onSuccess: () => void
  onCancel: () => void
}

function PaymentForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Please check your payment details.')
      setSubmitting(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setSubmitting(false)
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess()
    } else {
      setError('Payment did not complete. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <div style={{ color: '#00ff9c', fontFamily: 'monospace', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Payment</h3>
      </div>

      <PaymentElement />

      {error && (
        <p style={{ color: '#ff5c5c', fontSize: '0.9rem', marginTop: 10 }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          style={{
            background: 'none',
            border: '1px solid #444',
            color: '#B9D9EB',
            cursor: submitting ? 'default' : 'pointer',
            padding: '8px 16px',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="checkout-btn"
          style={{ opacity: !stripe || submitting ? 0.6 : 1 }}
        >
          {submitting ? 'Processing…' : 'Pay now'}
        </button>
      </div>
    </form>
  )
}

export default function StripeCheckout({ clientSecret, onSuccess, onCancel }: StripeCheckoutProps) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#00ff9c',
            colorBackground: '#111',
            colorText: '#B9D9EB',
            colorDanger: '#ff5c5c',
            fontFamily: 'monospace',
          },
        },
      }}
    >
      <PaymentForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}
