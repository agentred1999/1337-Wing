import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSubmitting(true)
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px', fontFamily: 'monospace', color: '#00ff9c' }}>
        <h1>Invalid Link</h1>
        <p style={{ color: '#ff5c5c', marginTop: 10 }}>
          This reset link is missing a token. Please request a new one.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link to="/forgot-password" style={{ color: '#00d4ff' }}>Request new link</Link>
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px', fontFamily: 'monospace', color: '#00ff9c' }}>
      <h1>Reset Password</h1>
      {success ? (
        <p style={{ color: '#00ff9c', marginTop: 14 }}>
          Password updated! Redirecting to login...
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginTop: 14 }}>
            New Password:<br />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="ship-input"
            />
          </label>
          <label style={{ display: 'block', marginTop: 14 }}>
            Confirm Password:<br />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="ship-input"
            />
          </label>
          {error && <p style={{ color: '#ff5c5c', marginTop: 10 }}>{error}</p>}
          <button type="submit" className="checkout-btn" disabled={submitting} style={{ marginTop: 20 }}>
            {submitting ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      )}
      <p style={{ marginTop: 16 }}>
        <Link to="/login" style={{ color: '#00d4ff' }}>Back to Login</Link>
      </p>
    </div>
  )
}
