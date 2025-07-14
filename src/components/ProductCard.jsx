import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaInfoCircle, FaImage } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.quantity > 0) {
      addToCart({ ...product, stock: product.quantity });
      // Feedback visuel optionnel
      console.log(`${product.name} ajouté au panier`);
    }
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">
            <FaImage />
            <span>Aucune image</span>
          </div>
        )}
        {product.quantity <= 0 && (
          <div className="out-of-stock">Rupture de stock</div>
        )}
        {product.images && product.images.length > 1 && (
          <div className="multiple-images-indicator">
            {product.images.length} photos
          </div>
        )}
        {isHovered && (
          <div className="product-overlay">
            <button 
              className="btn-overlay"
              onClick={handleDetailsClick}
            >
              <FaInfoCircle /> Détails
            </button>
            {product.quantity > 0 && (
              <button 
                className="btn-overlay"
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Ajouter
              </button>
            )}
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price">
          <span className="price">{formatPrice(product.price)} DA</span>
          <span className={`stock-status ${product.quantity > 0 ? 'in-stock' : ''}`}>
            {product.quantity > 0 ? 'En stock' : 'Rupture de stock'}
          </span>
        </div>

        <div className="product-actions">
          <button 
            className="btn"
            onClick={handleDetailsClick}
          >
            Détails
          </button>
          {product.quantity > 0 && (
            <button 
              className="btn"
              onClick={handleAddToCart}
            >
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 