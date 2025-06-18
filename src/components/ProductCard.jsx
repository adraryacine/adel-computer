import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product);
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
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
        {!product.inStock && (
          <div className="out-of-stock">Rupture de stock</div>
        )}
        {isHovered && (
          <div className="product-overlay">
            <button 
              className="btn-overlay"
              onClick={handleDetailsClick}
            >
              <FaInfoCircle /> Détails
            </button>
            {product.inStock && (
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
          <span className="price">{product.price} €</span>
          <span className={`stock-status ${product.inStock ? 'in-stock' : ''}`}>
            {product.inStock ? 'En stock' : 'Rupture de stock'}
          </span>
        </div>

        <div className="product-actions">
          <button 
            className="btn"
            onClick={handleDetailsClick}
          >
            Détails
          </button>
          {product.inStock && (
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