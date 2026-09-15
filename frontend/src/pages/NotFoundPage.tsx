import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
      <div style={{
        display: 'inline-block',
        textAlign: 'left',
        background: 'black',
        color: '#00ff9c',
        fontFamily: 'monospace',
        border: '1px solid var(--accent)',
        borderRadius: 6,
        padding: '30px 40px',
        maxWidth: 500,
      }}>
        <h1 style={{ color: '#00ff9c', fontSize: '1.6rem', marginBottom: 16, borderBottom: 'none' }}>
          &gt; 404: PAGE NOT FOUND
        </h1>
        <p style={{ color: 'var(--accent)', marginBottom: 8 }}>&gt; requested path does not exist</p>
        <p style={{ color: 'var(--accent)', marginBottom: 24 }}>&gt; connection terminated safely</p>
        <Link
          to="/"
          className="btn"
          style={{ display: 'inline-block' }}
        >
          ← RETURN TO BASE
        </Link>
      </div>
    </div>
  )
}
