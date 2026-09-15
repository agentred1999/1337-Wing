import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer>
      <p>1337 Wing. Built by hackers, for hackers.</p>
      <p>
        <Link to="/bio">Our Story</Link> |{' '}
        <a href="/#mission">Mission</a> |{' '}
        <a href="/#shop">Shop</a> |{' '}
        <Link to="/privacy">Privacy</Link>
      </p>
      <p style={{ color: '#9a9a9a', fontFamily: 'monospace', fontSize: '0.8rem', marginTop: 10 }}>
        &gt; founded by Richard Dean — Houston, Texas
      </p>
      <p style={{ color: '#6c7a7f', fontFamily: 'monospace', fontSize: '0.72rem', marginTop: 6 }}>
        &gt; this is a portfolio/demo storefront — no real payments are processed
      </p>
    </footer>
  )
}
