import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px', fontFamily: 'monospace', color: '#00ff9c' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginTop: 14 }}>
          Username:<br />
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="ship-input"
          />
        </label>
        <label style={{ display: 'block', marginTop: 14 }}>
          Password:<br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="ship-input"
          />
        </label>
        {error && <p style={{ color: '#ff5c5c', marginTop: 10 }}>{error}</p>}
        <button type="submit" className="checkout-btn" disabled={submitting} style={{ marginTop: 20 }}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        No account? <Link to="/signup" style={{ color: '#00d4ff' }}>Sign up</Link>
      </p>
      <p style={{ marginTop: 8 }}>
        <Link to="/forgot-password" style={{ color: '#00d4ff' }}>Forgot password?</Link>
      </p>
    </div>
  )
}
