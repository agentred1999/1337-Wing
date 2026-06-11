import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.short}</p>
        <div className="price">${product.price}</div>
        <button className="buy-btn" onClick={() => addToCart(product)}>ADD TO CART</button>
        {/* Product Details Page — required feature */}
        <Link to={`/product/${product.id}`} className="spec-btn">VIEW SPECS</Link>
      </div>
    </div>
  )
}
