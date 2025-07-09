import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPercent, 
  FaEuroSign,
  FaClock,
  FaShoppingCart,
  FaTimes,
  FaGift
} from 'react-icons/fa';
import { getProductsWithPromotions } from '../services/promotionService';
import { useCart } from '../context/CartContext';
import './Promotions.css';

const Promotions = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProductsWithPromotions();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load promotions:', err);
      setError('Erreur lors du chargement des promotions');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate time remaining
  const getTimeRemaining = (validUntil) => {
    const now = new Date();
    const end = new Date(validUntil);
    const diff = end - now;
    
    if (diff <= 0) return 'Expiré';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
    return 'Moins d\'une heure';
  };

  // Handle add to cart
  const getProductImage = (product) => {
    let photos = product.photos;
    if (typeof photos === 'string') {
      try {
        photos = JSON.parse(photos);
      } catch {
        // fallback
      }
    }
    return Array.isArray(photos) && photos.length > 0
      ? photos[0]
      : photos || 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      price: product.discountedPrice,
      image: getProductImage(product)
    });
  };

  // Open product modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  if (isLoading) {
    return (
      <div className="promotions-page">
        <div className="promotions-header">
          <div className="promotions-header-content">
            <h1 className="promotions-title">
              <FaGift />
              Produits en Promotion
            </h1>
            <p className="promotions-subtitle">
              Chargement des promotions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promotions-page">
        <div className="promotions-header">
          <div className="promotions-header-content">
            <h1 className="promotions-title">
              <FaGift />
              Produits en Promotion
            </h1>
            <p className="promotions-subtitle">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="promotions-page">
      {/* Header */}
      <div className="promotions-header">
        <div className="promotions-header-content">
          <h1 className="promotions-title">
            <FaGift />
            Produits en Promotion
          </h1>
          <p className="promotions-subtitle">
            Découvrez nos produits avec des réductions exceptionnelles
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="promotions-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit en promotion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="promotions-stats">
        <div className="stat-card">
          <FaGift className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{filteredProducts.length}</span>
            <span className="stat-label">Produits en promotion</span>
          </div>
        </div>
        <div className="stat-card">
          <FaPercent className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">
              {filteredProducts.length > 0 
                ? Math.round(filteredProducts.reduce((sum, p) => sum + p.discountPercentage, 0) / filteredProducts.length)
                : 0}%
            </span>
            <span className="stat-label">Réduction moyenne</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="promotions-grid">
        {filteredProducts.map(product => {
          const timeRemaining = getTimeRemaining(product.promotion.valid_until);
          
          return (
            <div 
              key={product.id} 
              className="promotion-card"
              onClick={() => openProductModal(product)}
            >
              {/* Discount Badge */}
              <div className="discount-badge">
                -{product.discountPercentage}%
              </div>

              {/* Product Image */}
              <div className="promotion-image">
                {(() => {
                  let photos = product.photos;
                  if (typeof photos === 'string') {
                    try {
                      photos = JSON.parse(photos);
                    } catch {
                      // fallback
                    }
                  }
                  const image = Array.isArray(photos) && photos.length > 0 ? photos[0] : photos || 'https://via.placeholder.com/300x200?text=No+Image';
                  return <img src={image} alt={product.name} />;
                })()}
                <div className="promotion-overlay">
                  <div className="promotion-actions">
                    <button
                      className="action-btn add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaShoppingCart />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Content */}
              <div className="promotion-content">
                <div className="product-category">{product.category}</div>
                <h3 className="promotion-title">{product.name}</h3>
                <p className="promotion-description">{product.description}</p>
                
                {/* Pricing */}
                <div className="product-pricing">
                  <div className="price-container">
                    <span className="original-price">{product.originalPrice.toLocaleString()} DA</span>
                    <span className="discounted-price">{product.discountedPrice.toLocaleString()} DA</span>
                  </div>
                  <span className="savings">Économisez {product.discountAmount.toLocaleString()} DA</span>
                </div>

                {/* Status and Time */}
                <div className="promotion-status">
                  <div className="time-remaining">
                    <FaClock />
                    <span>{timeRemaining}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Products Message */}
      {filteredProducts.length === 0 && (
        <div className="no-promotions">
          <FaGift className="no-promotions-icon" />
          <h3>Aucun produit en promotion trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="promotion-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="promotion-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setShowProductModal(false)}
            >
              <FaTimes />
            </button>

            <div className="modal-content">
              <div className="modal-header">
                {(() => {
                  let photos = selectedProduct.photos;
                  if (typeof photos === 'string') {
                    try {
                      photos = JSON.parse(photos);
                    } catch {
                      // fallback
                    }
                  }
                  const image = Array.isArray(photos) && photos.length > 0 ? photos[0] : photos || 'https://via.placeholder.com/300x200?text=No+Image';
                  return <img src={image} alt={selectedProduct.name} />;
                })()}
                <div className="modal-header-content">
                  <div className="product-category">{selectedProduct.category}</div>
                  <h2>{selectedProduct.name}</h2>
                  <p>{selectedProduct.description}</p>
                  <div className="modal-pricing">
                    <span className="modal-original-price">{selectedProduct.originalPrice.toLocaleString()} DA</span>
                    <span className="modal-discounted-price">{selectedProduct.discountedPrice.toLocaleString()} DA</span>
                    <span className="modal-discount-badge">-{selectedProduct.discountPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="modal-body">
                {/* Promotion Info */}
                <div className="modal-section">
                  <h3>Informations promotion</h3>
                  <div className="modal-info">
                    <div className="info-item">
                      <FaClock />
                      <span>Valide jusqu'au {new Date(selectedProduct.promotion.valid_until).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <FaPercent />
                      <span>Réduction: {selectedProduct.discountPercentage}%</span>
                    </div>
                    <div className="info-item">
                      <FaEuroSign />
                      <span>Économies: {selectedProduct.discountAmount.toLocaleString()} DA</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <button
                    className="modal-add-to-cart-btn"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setShowProductModal(false);
                    }}
                    disabled={selectedProduct.quantity <= 0}
                  >
                    <FaShoppingCart />
                    Ajouter au panier - {selectedProduct.discountedPrice.toLocaleString()} DA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions; 