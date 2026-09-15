import { useEffect, useState } from 'react'
import { apiFetch } from './api'
import type { Product, ProductSpec } from '../data/products'

// The DB's product_category enum is a specific hacker-hardware taxonomy
// (accessory/apparel/computer/network_tool/usb_attack_tool/implant/wearable),
// but the shop UI only ever filters/groups by two display buckets: merch vs hardware.
// This maps every DB category down to one of those two buckets for display purposes.
type DbProductCategory =
  | 'accessory'
  | 'apparel'
  | 'computer'
  | 'network_tool'
  | 'usb_attack_tool'
  | 'implant'
  | 'wearable'

const MERCH_CATEGORIES = new Set<DbProductCategory>(['accessory', 'apparel'])

function toDisplayCategory(dbCategory: DbProductCategory): 'merch' | 'hardware' {
  return MERCH_CATEGORIES.has(dbCategory) ? 'merch' : 'hardware'
}

// Raw shape returned by GET /api/products (Postgres row, snake_case).
interface ProductRow {
  id: number
  name: string
  description: string
  short_description: string | null
  price: string // NUMERIC comes back as a string from pg
  category: DbProductCategory
  stock: number
  image_url: string | null
  specs: ProductSpec[] | null
}

function mapRow(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    price: parseFloat(row.price),
    category: toDisplayCategory(row.category),
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
