import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <p>1337 Wing. Built by hackers, for hackers.</p>
      <p>
        <Link to="/bio">Our Story</Link> |{' '}
        <a href="/#mission">Mission</a> |{' '}
        <a href="/#shop">Shop</a> |{' '}
        <Link to="/privacy">Privacy</Link> |{' '}
        <a href="https://github.com/agentred1999/1337-Wing/pulls" target="_blank" rel="noreferrer">
          GitHub <span className="sr-only">(opens in new tab)</span>
        </a>
      </p>
      <p style={{ color: '#9a9a9a', fontFamily: 'monospace', fontSize: '0.8rem', marginTop: 10 }}>
        &gt; founded by Richard Dean — Houston, Texas
      </p>
    </footer>
  )
}
