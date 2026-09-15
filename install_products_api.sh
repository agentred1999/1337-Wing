#!/bin/bash
set -e

BACKEND_DIR="/home/agentred1999/1337wing/backend"
FRONTEND_SRC="/home/agentred1999/1337wing/frontend/src"

echo "Writing migration + seed SQL..."
mkdir -p "$BACKEND_DIR/database"

cat > "$BACKEND_DIR/database/products_content_migration.sql" << 'FILE_EOF'
-- Adds the columns needed to fully drive the shop page from Postgres
-- instead of the static frontend products.ts array.
-- image_url already exists in the base schema; short_description and specs are new.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description VARCHAR(500),
  ADD COLUMN IF NOT EXISTS specs JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.short_description IS 'Short teaser shown on shop grid cards';
COMMENT ON COLUMN products.specs IS 'Array of {label, value} objects shown on product detail view';
FILE_EOF

cat > "$BACKEND_DIR/database/products_seed.sql" << 'FILE_EOF'
-- Seeds the products table from the existing frontend/src/data/products.ts catalog.
-- Safe to re-run: clears existing rows first (fine since the table is currently empty
-- and this is pre-demo setup, not production data).

TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, description, short_description, price, category, stock, image_url, specs)
VALUES
(
  '1337 Wing Zippo',
  'Brushed steel windproof lighter with a laser-engraved 1337 Wing mark. Limited production run of 100 units, each individually numbered.',
  'Brushed steel Zippo with a laser-engraved 1337 Wing mark. Limited run, individually numbered.',
  50, 'merch', 25, 'zippo1.jpg',
  '[{"label":"Material","value":"Brushed steel"},{"label":"Finish","value":"Laser-engraved"},{"label":"Edition","value":"Limited — 100 units"}]'
),
(
  '1337 Wing Zippo — Matte Black',
  'Matte black windproof lighter with a deep-engraved 1337 Wing mark. Ships in a branded box.',
  'Matte black finish, deep-engraved 1337 Wing mark. Ships in a branded box.',
  60, 'merch', 25, 'zippo2.jpg',
  '[{"label":"Material","value":"Matte black steel"},{"label":"Engraving","value":"1337 Wing mark"},{"label":"Finish","value":"Matte"},{"label":"Ships in","value":"Branded box"}]'
),
(
  '1337 Wing Hoodie',
  'Heavyweight 400gsm cotton fleece hoodie with a glow-in-the-dark screen print. Each unit is individually numbered.',
  'Heavyweight cotton fleece hoodie with a glow-in-the-dark print. Numbered limited run.',
  70, 'merch', 40, 'hoodie1.jpg',
  '[{"label":"Material","value":"400gsm cotton fleece"},{"label":"Print","value":"Glow-in-the-dark screen print"},{"label":"Sizes","value":"S – 3XL"},{"label":"Edition","value":"Numbered limited run"}]'
),
(
  '1337 Wing T-Shirt',
  'Combed cotton tee with a rotating set of print designs across drops. Lightweight and breathable.',
  'Combed cotton tee, rotating print designs each drop.',
  35, 'merch', 60, 'tshirt1.jpg',
  '[{"label":"Material","value":"Combed cotton"},{"label":"Print","value":"Screen print"},{"label":"Sizes","value":"S – 3XL"},{"label":"Edition","value":"Rotating drop"}]'
),
(
  'USB Rubber Ducky',
  'HID injection platform running DuckyScript 3.0. Ships preloaded with a safe demo payload. Compatible with Windows, Linux, and macOS.',
  'HID injection device running DuckyScript 3.0. Ships with a demo payload preloaded.',
  80, 'hardware', 15, 'usbducky.jpg',
  '[{"label":"Interface","value":"USB-A and USB-C"},{"label":"Storage","value":"128MB"},{"label":"Script","value":"DuckyScript 3.0"},{"label":"OS Support","value":"Windows / Linux / macOS"},{"label":"Type","value":"HID injection device"}]'
),
(
  'Custom Keycaps',
  'PBT double-shot keycap set with glow-in-the-dark legends. MX switch compatible, ANSI layout.',
  'PBT double-shot keycaps with glow-in-the-dark legends. MX compatible.',
  45, 'merch', 30, 'keycaps.jpg',
  '[{"label":"Material","value":"PBT double-shot"},{"label":"Backlight","value":"Glow-in-the-dark"},{"label":"Switch","value":"MX compatible"},{"label":"Layout","value":"ANSI 104"}]'
),
(
  '1337 Wing Mesh Node',
  'Meshtastic-based LoRa mesh node. Encrypted, peer-to-peer networking with no internet dependency. Useful for field ops, disaster prep, or general off-grid comms.',
  'Meshtastic LoRa node for encrypted, internet-free communication.',
  200, 'hardware', 10, 'mesh.jpg',
  '[{"label":"Protocol","value":"Meshtastic / LoRa"},{"label":"Range","value":"Up to 15km, open terrain"},{"label":"Battery","value":"3000mAh"},{"label":"Encryption","value":"AES-256"},{"label":"Network","value":"No internet required"}]'
),
(
  '1337 Wing Revenant',
  'Linux-first laptop built for real day-to-day security work. Fully repairable and upgradeable. Ships with Kali or Arch pre-installed, or any distro on request.',
  'Linux-first laptop, fully repairable and upgradeable, ThinkPad-inspired chassis.',
  1000, 'hardware', 5, 'computer.jpg',
  '[{"label":"CPU","value":"Intel Core i7 155H (Meteor Lake)"},{"label":"RAM","value":"16GB DDR5"},{"label":"Storage","value":"512GB NVMe SSD"},{"label":"OS","value":"Any Linux distro, custom order"},{"label":"Display","value":"14\\" IPS 1080p"},{"label":"Repairability","value":"Fully modular"}]'
),
(
  '1337 Wing Cyberdeck',
  'Portable security platform built around a Raspberry Pi CM4, running full Kali Linux ARM. Fits in a backpack. 7" touchscreen, all-day battery.',
  'Portable Kali Linux ARM platform built around a Raspberry Pi CM4.',
  300, 'hardware', 8, 'cyber.jpg',
  '[{"label":"SBC","value":"Raspberry Pi CM4"},{"label":"Display","value":"7\\" touchscreen"},{"label":"Battery","value":"10000mAh"},{"label":"OS","value":"Kali Linux ARM"},{"label":"Connectivity","value":"WiFi + Ethernet"}]'
);
FILE_EOF

echo "Writing frontend files..."
cat > "$FRONTEND_SRC/utils/useProducts.ts" << 'FILE_EOF'
import { useEffect, useState } from 'react'
import { apiFetch } from './api'
import type { Product, ProductSpec } from '../data/products'

// Raw shape returned by GET /api/products (Postgres row, snake_case).
interface ProductRow {
  id: number
  name: string
  description: string
  short_description: string | null
  price: string // NUMERIC comes back as a string from pg
  category: 'merch' | 'hardware'
  stock: number
  image_url: string | null
  specs: ProductSpec[] | null
}

function mapRow(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    price: parseFloat(row.price),
    category: row.category,
    image: row.image_url ?? '',
    short: row.short_description ?? row.description,
    description: row.description,
    specs: row.specs ?? [],
  }
}

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    apiFetch<ProductRow[]>('/api/products')
      .then((rows) => {
        if (cancelled) return
        setProducts(rows.map(mapRow))
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, error }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const row = await apiFetch<ProductRow>(`/api/products/${id}`)
    return mapRow(row)
  } catch {
    return null
  }
}
FILE_EOF

cat > "$FRONTEND_SRC/data/products.ts" << 'FILE_EOF'
// Product data now lives in Postgres and is fetched via useProducts() / fetchProductById()
// in utils/useProducts.ts. This file only keeps the shared types.

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductCategory = 'merch' | 'hardware';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  short: string;
  description: string;
  specs: ProductSpec[];
}
FILE_EOF

cat > "$FRONTEND_SRC/pages/HomePage.tsx" << 'FILE_EOF'
import { useState } from 'react'
import { useProducts } from '../utils/useProducts'
import type { ProductCategory } from '../data/products'
import ProductCard from '../components/ProductCard'
import HackerNewsFeed from '../components/HackerNewsFeed'
import FieldNotes from '../components/FieldNotes'
import { assetPath } from '../utils/assetPath'

type FilterCategory = 'all' | ProductCategory
type SortOrder = 'default' | 'az' | 'za' | 'low-high' | 'high-low'

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
        <a href="#shop" className="btn">BROWSE THE CATALOG →</a>
      </header>

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
FILE_EOF

cat > "$FRONTEND_SRC/pages/ProductPage.tsx" << 'FILE_EOF'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchProductById } from '../utils/useProducts'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { assetPath } from '../utils/assetPath'

export default function ProductPage() {
  // useParams — required React Router feature
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    fetchProductById(id).then((p) => {
      if (!cancelled) {
        setProduct(p)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 60 }}>
        <p style={{ color: '#00ff9c', fontFamily: 'monospace' }}>&gt; loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 60 }}>
        <p style={{ color: '#00ff9c', fontFamily: 'monospace' }}>&gt; product not found.</p>
        <Link to="/" className="btn" style={{ marginTop: 20, display: 'inline-block' }}>
          ← BACK TO CATALOG
        </Link>
      </div>
    )
  }

  const imgSrc = assetPath(product.image)
  const webpSrc = imgSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  return (
    <div className="container product-detail-page">
      <Link to="/" className="back-link">← BACK TO CATALOG</Link>

      <div className="detail-layout">
        <div className="detail-img-wrap">
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img src={imgSrc} alt={product.name} className="detail-img" />
          </picture>
        </div>

        <div className="detail-info">
          <span className="category-tag">{product.category.toUpperCase()}</span>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>

          <div className="specs-block">
            <h2>&gt; SPECS</h2>
            <table className="specs-table">
              <caption className="sr-only">Technical specifications for {product.name}</caption>
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr key={i}>
                    <th className="spec-label" scope="row">{spec.label}</th>
                    <td className="spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detail-actions">
            <span className="price" style={{ fontSize: '1.8rem' }}>${product.price}</span>
            <button className="buy-btn" style={{ marginTop: 16 }} onClick={() => addToCart(product)}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
FILE_EOF

echo ""
echo "Files written. Now run the migration + seed against Postgres:"
echo "  psql -U agentred1999 -d 1337wing_db -f $BACKEND_DIR/database/products_content_migration.sql"
echo "  psql -U agentred1999 -d 1337wing_db -f $BACKEND_DIR/database/products_seed.sql"
echo ""
echo "Then restart the backend and verify:"
echo "  curl http://localhost:5000/api/products | head -c 300"
