import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductPage() {
  // useParams — required React Router feature
  const { id } = useParams()
  const { addToCart } = useCart()

  const product = products.find(p => p.id === id)

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

  const webpSrc = product.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  return (
    <div className="container product-detail-page">
      <Link to="/" className="back-link">← BACK TO CATALOG</Link>

      <div className="detail-layout">
        <div className="detail-img-wrap">
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img src={product.image} alt={product.name} className="detail-img" />
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
