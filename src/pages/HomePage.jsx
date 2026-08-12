import { useState } from 'react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import HackerNewsFeed from '../components/HackerNewsFeed'
import FieldNotes from '../components/FieldNotes'
import { assetPath } from '../utils/assetPath'

export default function HomePage() {
  // --- REQUIRED FEATURE: Filter + Sort with useState ---
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('default')

  const filteredProducts = products
    .filter(p => filterCategory === 'all' || p.category === filterCategory)
    .sort((a, b) => {
      if (sortOrder === 'az')        return a.name.localeCompare(b.name)
      if (sortOrder === 'za')        return b.name.localeCompare(a.name)
      if (sortOrder === 'low-high')  return a.price - b.price
      if (sortOrder === 'high-low')  return b.price - a.price
      return 0
    })

  const merch    = filteredProducts.filter(p => p.category === 'merch')
  const hardware = filteredProducts.filter(p => p.category === 'hardware')

  return (
    <>
      {/* HERO */}
      <header className="hero">
        <picture>
          <source srcSet={assetPath("1337.webp")} type="image/webp" />
          <img src={assetPath("1337.jpg")} className="big-logo" alt="1337 Wing Eagle Logo" fetchpriority="high" decoding="async" />
        </picture>
        <h1>1337 WING</h1>
        <p>Professional hardware for red teaming and pentesting — built by hackers for hackers.</p>
        <a href="#shop" className="btn">BROWSE THE CATALOG →</a>
      </header>

      {/* HACKER NEWS INTEL FEED — useEffect lives inside this component */}
      <HackerNewsFeed />

      {/* FIELD NOTES — real writeups, not aggregated content */}
      <FieldNotes />

      {/* SHOP — Filter & Sort controls */}
      <div className="container" id="shop">
        {/* FILTER + SORT BAR — required filter feature */}
        <div className="filter-sort-bar">
          <div className="filter-group">
            <label htmlFor="filter-category">&gt; FILTER:</label>
            <select id="filter-category" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All Products</option>
              <option value="merch">Merch Only</option>
              <option value="hardware">Hardware Only</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sort-order">&gt; SORT BY:</label>
            <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="default">— Select —</option>
              <option value="az">Name: A → Z</option>
              <option value="za">Name: Z → A</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* MERCH SECTION */}
        {merch.length > 0 && (
          <section id="merch" style={{ marginBottom: 50 }}>
            <h2>1337 Wing Merch</h2>
            <div className="products">
              {merch.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
            </div>
          </section>
        )}

        {/* GEAR SECTION */}
        {hardware.length > 0 && (
          <section>
            <h2>Signature Gear</h2>
            <div className="products">
              {hardware.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
            </div>
          </section>
        )}

        {filteredProducts.length === 0 && (
          <p style={{ color: '#9a9a9a', fontFamily: 'monospace', padding: '40px 0' }}>
            &gt; no products match that filter.
          </p>
        )}

        {/* FOUNDER NOTE */}
        <div className="founder-note" style={{ marginTop: 30 }}>
          <p><strong>Richard Dean — Founder, 1337 Wing</strong></p>
          <p style={{ fontStyle: 'italic', marginTop: 6 }}>"Building the tools I wish I had."</p>
        </div>

        {/* MISSION */}
        <section id="mission" style={{ marginTop: 50 }}>
          <div className="mission">
            <h2>Mission</h2>
            <p>We build powerful modular hardware for cybersecurity professionals and open-source communities.</p>
            <ul style={{ marginTop: 14 }}>
              <li>Linux-first hardware ecosystem</li>
              <li>Repairable and upgradeable devices</li>
              <li>Privacy-focused technology</li>
              <li>Tools built for real security work</li>
            </ul>
          </div>
        </section>
      </div>

      {/* COMMUNITY TERMINAL */}
      <section className="terminal">
        <h2>Community Terminal</h2>
        <p style={{ marginTop: 10 }}>&gt; Found a bug?</p>
        <p>&gt; Want to suggest hardware?</p>
        <p>&gt; Submit an idea.</p>
        <a href="https://github.com/agentred1999/pulls" target="_blank" rel="noreferrer"
          style={{ color: '#00ff9c', textDecoration: 'underline', display: 'inline-block', marginTop: 10 }}>
          OPEN ISSUE ON GITHUB → <span className="sr-only">(opens in new tab)</span>
        </a>
      </section>
    </>
  )
}
