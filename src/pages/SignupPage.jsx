import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px', fontFamily: 'monospace', color: '#00ff9c' }}>
      <h1>Sign Up</h1>
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
          Email:<br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            minLength={8}
            className="ship-input"
          />
        </label>
        {error && <p style={{ color: '#ff5c5c', marginTop: 10 }}>{error}</p>}
        <button type="submit" className="checkout-btn" disabled={submitting} style={{ marginTop: 20 }}>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login" style={{ color: '#00d4ff' }}>Login</Link>
      </p>
    </div>
  )
}
