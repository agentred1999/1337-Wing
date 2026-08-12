import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState, useRef, useEffect } from 'react'
import { assetPath } from '../utils/assetPath'

export default function ProductCard({ product, priority = false }) {
  const { addToCart } = useCart()
  const [imgLoaded, setImgLoaded] = useState(false)
  const imgRef = useRef(null)
  const imgSrc = assetPath(product.image)
  const webpSrc = imgSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImgLoaded(true)
    }
  }, [])

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {!imgLoaded && <div className="skeleton" aria-hidden="true" />}
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            ref={imgRef}
            src={imgSrc}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            style={{ visibility: imgLoaded ? 'visible' : 'hidden' }}
          />
        </picture>
      </div>
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
