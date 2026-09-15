import { useState } from 'react'
import { useProducts } from '../utils/useProducts'
import type { ProductCategory } from '../data/products'
import ProductCard from '../components/ProductCard'
import HackerNewsFeed from '../components/HackerNewsFeed'
import FieldNotes from '../components/FieldNotes'
import { assetPath } from '../utils/assetPath'

type FilterCategory = 'all' | ProductCategory
type SortOrder = 'default' | 'az' | 'za' | 'low-high' | 'high-low'

const QUICK_CATEGORIES: { label: string; value: FilterCategory }[] = [
  { label: 'Hardware', value: 'hardware' },
  { label: 'Merch', value: 'merch' },
  { label: 'Everything', value: 'all' },
]

export default function HomePage() {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('default')
  const { products, loading, error } = useProducts()

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

  function jumpToShop(category: FilterCategory) {
    setFilterCategory(category)
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* 01 — THE HOOK */}
      <header className="hero">
        <picture>
          <source srcSet={assetPath("1337.webp")} type="image/webp" />
          <img src={assetPath("1337.jpg")} className="big-logo" alt="1337 Wing Eagle Logo" fetchPriority="high" decoding="async" />
        </picture>
        <h1>BUILT BY HACKERS.<br />FOR HACKERS.</h1>
        <p>Hardware, tools, and systems for people who want to understand the technology they use.</p>
        <a href="#shop" className="btn">SEE WHAT'S IN THE WING →</a>
      </header>

      {/* 01.5 — WHAT'S IN THE WING (quick category nav, immediately below hero) */}
      <section className="wing-nav">
        <div className="wing-nav-inner">
          <span className="wing-nav-label">&gt; WHAT'S IN THE WING?</span>
          <div className="wing-nav-tags">
            {QUICK_CATEGORIES.map(c => (
              <button
                key={c.value}
                type="button"
                className="lab-tag wing-nav-tag"
                onClick={() => jumpToShop(c.value)}
              >
                {c.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container" id="shop">
        {/* 02 — THE PRODUCTS */}
        <section id="merch" style={{ marginBottom: 50 }}>
          <h2>The Products</h2>
          <div className="filter-sort-bar">
            <div className="filter-group">
              <label htmlFor="filter-category">&gt; FILTER:</label>
              <select id="filter-category" value={filterCategory} onChange={e => setFilterCategory(e.target.value as FilterCategory)}>
                <option value="all">All Products</option>
                <option value="hardware">Hardware Only</option>
                <option value="merch">Merch Only</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sort-order">&gt; SORT BY:</label>
              <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)}>
                <option value="default">— Select —</option>
                <option value="az">Name: A → Z</option>
                <option value="za">Name: Z → A</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>
            </div>
          </div>

          {loading && (
            <p style={{ color: '#00ff9c', fontFamily: 'monospace', padding: '40px 0' }}>
              &gt; loading catalog...
            </p>
          )}

          {error && !loading && (
            <p style={{ color: '#ff5c5c', fontFamily: 'monospace', padding: '40px 0' }}>
              &gt; couldn't load products: {error}
            </p>
          )}

          {!loading && !error && hardware.length > 0 && (
            <div className="products">
              {hardware.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
            </div>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <p style={{ color: '#9a9a9a', fontFamily: 'monospace', padding: '40px 0' }}>
              &gt; no products match that filter.
            </p>
          )}
        </section>

        {/* 03 — THE PHILOSOPHY */}
        <section id="mission" className="philosophy" style={{ marginBottom: 50 }}>
          <h2>The Philosophy</h2>
          <div className="mission">
            <p className="philosophy-line">Technology shouldn't be disposable.</p>
            <p className="philosophy-line">Technology shouldn't be a black box.</p>
            <p className="philosophy-line">Technology shouldn't require permission.</p>
            <ul style={{ marginTop: 20 }}>
              <li>Linux-first hardware ecosystem</li>
              <li>Repairable and upgradeable devices</li>
              <li>Privacy-focused technology</li>
              <li>Tools built for real security work</li>
            </ul>
          </div>
        </section>

        {/* 04 — THE LAB */}
        <section id="lab" style={{ marginBottom: 50 }}>
          <h2>The Lab</h2>
          <div className="lab-tags">
            <span className="lab-tag">HARDWARE</span>
            <span className="lab-tag">LINUX</span>
            <span className="lab-tag">NETWORKING</span>
            <span className="lab-tag">SECURITY</span>
            <span className="lab-tag">SELF-HOSTING</span>
          </div>
          <FieldNotes />
        </section>
      </div>

      {/* 05 — THE INTEL FEED */}
      <HackerNewsFeed />

      <div className="container">
        {/* 06 — THE BRAND */}
        {!loading && !error && merch.length > 0 && (
          <section style={{ marginTop: 10, marginBottom: 40 }}>
            <h2>The Brand</h2>
            <div className="products">
              {merch.map((p, i) => <ProductCard key={p.id} product={p} priority={false} />)}
            </div>
          </section>
        )}

        {/* FOUNDER NOTE */}
        <div className="founder-note" style={{ marginTop: 30 }}>
          <p><strong>1337 Wing</strong> was founded by Richard Dean, known online as Agent RED.</p>
          <p style={{ marginTop: 6 }}>An independent developer and security enthusiast building hardware, software, and infrastructure around the principles of ownership, experimentation, and self-reliance.</p>
        </div>
      </div>

      {/* COMMUNITY TERMINAL */}
      <section className="terminal">
        <h2>Community Terminal</h2>
        <p style={{ marginTop: 10 }}>&gt; Found a bug?</p>
        <p>&gt; Want to suggest hardware?</p>
        <p>&gt; Submit an idea.</p>
        <a href="https://github.com/agentred1999/1337-Wing/pulls" target="_blank" rel="noreferrer"
          style={{ color: '#00ff9c', textDecoration: 'underline', display: 'inline-block', marginTop: 10 }}>
          OPEN ISSUE ON GITHUB → <span className="sr-only">(opens in new tab)</span>
        </a>
      </section>
    </>
  )
}
