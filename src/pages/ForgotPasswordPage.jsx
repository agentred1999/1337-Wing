import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const data = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setMessage(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px', fontFamily: 'monospace', color: '#00ff9c' }}>
      <h1>Forgot Password</h1>
      <p style={{ color: '#B9D9EB', marginTop: 10 }}>
        Enter the email on your account and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginTop: 14 }}>
          Email:<br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="ship-input"
          />
        </label>
        {error && <p style={{ color: '#ff5c5c', marginTop: 10 }}>{error}</p>}
        {message && <p style={{ color: '#00ff9c', marginTop: 10 }}>{message}</p>}
        <button type="submit" className="checkout-btn" disabled={submitting} style={{ marginTop: 20 }}>
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <Link to="/login" style={{ color: '#00d4ff' }}>Back to Login</Link>
      </p>
    </div>
  )
}
