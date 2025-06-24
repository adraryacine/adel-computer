import { useState, useEffect, useMemo } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaCopy, 
  FaCheck, 
  FaClock, 
  FaPercent, 
  FaEuroSign,
  FaStar,
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaGift,
  FaTag,
  FaInfoCircle,
  FaShoppingCart,
  FaHeart
} from 'react-icons/fa';
import { 
  promotions, 
  promotionCategories, 
  getPromotionCategory, 
  calculateDiscount, 
  isPromotionValid, 
  getPromotionStatus 
} from '../data/promotions';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import './Promotions.css';

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount-high');
  const [showFilters, setShowFilters] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { addToCart } = useCart();

  // Obtenir les produits en promotion avec leurs prix réduits
  const productsWithPromotions = useMemo(() => {
    const productsWithPromos = [];

    products.forEach(product => {
      // Trouver toutes les promotions applicables à ce produit
      const applicablePromotions = promotions.filter(promotion => {
        if (!isPromotionValid(promotion)) return false;
        
        // Vérifier si le produit est dans la liste spécifique
        if (promotion.applicableProducts.length > 0) {
          return promotion.applicableProducts.includes(product.id);
        }
        
        // Vérifier si le produit est dans les catégories applicables
        return promotion.applicableCategories.includes('all') || 
               promotion.applicableCategories.includes(product.category);
      });

      if (applicablePromotions.length > 0) {
        // Prendre la promotion avec la plus grande réduction
        const bestPromotion = applicablePromotions.reduce((best, current) => {
          const bestDiscount = calculateDiscount(best, product.price);
          const currentDiscount = calculateDiscount(current, product.price);
          return currentDiscount > bestDiscount ? current : best;
        });

        const discountAmount = calculateDiscount(bestPromotion, product.price);
        const discountedPrice = product.price - discountAmount;
        const discountPercentage = Math.round((discountAmount / product.price) * 100);

        productsWithPromos.push({
          ...product,
          promotion: bestPromotion,
          discountedPrice,
          discountAmount,
          discountPercentage,
          originalPrice: product.price
        });
      }
    });

    return productsWithPromos;
  }, []);

  // Filtrage et tri des produits en promotion
  const filteredProducts = useMemo(() => {
    let filtered = productsWithPromotions.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             product.category === selectedCategory ||
                             (product.promotion && getPromotionCategory(product.promotion) === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });

    // Tri
    switch (sortBy) {
      case 'discount-high':
        filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'discount-low':
        filtered.sort((a, b) => a.discountPercentage - b.discountPercentage);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        filtered.sort((a, b) => {
          if (a.promotion?.isFeatured && !b.promotion?.isFeatured) return -1;
          if (!a.promotion?.isFeatured && b.promotion?.isFeatured) return 1;
          return b.discountPercentage - a.discountPercentage;
        });
        break;
    }

    return filtered;
  }, [productsWithPromotions, searchTerm, selectedCategory, sortBy]);

  // Copier le code promo
  const copyPromoCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // Ouvrir le modal de détails du produit
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Ajouter au panier
  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      price: product.discountedPrice // Utiliser le prix réduit
    });
  };

  // Calculer le temps restant
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

  return (
    <div className="promotions-page">
      {/* Header de la page */}
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

      {/* Barre de recherche et filtres */}
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

        <div className="promotions-actions">
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filtres
          </button>

          <div className="sort-dropdown">
            <FaSort className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="discount-high">Plus de réduction</option>
              <option value="discount-low">Moins de réduction</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
              <option value="featured">Promotions vedettes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="promotions-filters">
          <div className="filter-categories">
            {promotionCategories.map(category => (
              <button
                key={category.id}
                className={`filter-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques des promotions */}
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
        <div className="stat-card">
          <FaEuroSign className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">
              {filteredProducts.reduce((sum, p) => sum + p.discountAmount, 0).toLocaleString()} DA
            </span>
            <span className="stat-label">Économies totales</span>
          </div>
        </div>
      </div>

      {/* Grille des produits en promotion */}
      <div className="promotions-grid">
        {filteredProducts.map(product => {
          const timeRemaining = getTimeRemaining(product.promotion.validUntil);
          
          return (
            <div 
              key={product.id} 
              className={`promotion-card ${product.promotion.isFeatured ? 'featured' : ''}`}
              onClick={() => openProductModal(product)}
            >
              {/* Badge vedette */}
              {product.promotion.isFeatured && (
                <div className="featured-badge">
                  <FaStar />
                  Vedette
                </div>
              )}

              {/* Badge de réduction */}
              <div className="discount-badge">
                -{product.discountPercentage}%
              </div>

              {/* Image du produit */}
              <div className="promotion-image">
                <img src={product.image} alt={product.name} />
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
                    <button className="action-btn wishlist-btn">
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenu du produit */}
              <div className="promotion-content">
                <div className="product-category">{product.category}</div>
                <h3 className="promotion-title">{product.name}</h3>
                <p className="promotion-description">{product.description}</p>
                
                {/* Prix */}
                <div className="product-pricing">
                  <div className="price-container">
                    <span className="original-price">{product.originalPrice.toLocaleString()} DA</span>
                    <span className="discounted-price">{product.discountedPrice.toLocaleString()} DA</span>
                  </div>
                  <span className="savings">Économisez {product.discountAmount.toLocaleString()} DA</span>
                </div>

                {/* Code promo */}
                <div className="promotion-code">
                  <span className="code-label">Code promo:</span>
                  <div className="code-container">
                    <span className="code-text">{product.promotion.code}</span>
                    <button
                      className="copy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyPromoCode(product.promotion.code);
                      }}
                    >
                      {copiedCode === product.promotion.code ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* Statut et temps restant */}
                <div className="promotion-status">
                  <div className="time-remaining">
                    <FaClock />
                    <span>{timeRemaining}</span>
                  </div>
                  <div className="stock-status">
                    {product.inStock ? (
                      <span className="in-stock">En stock</span>
                    ) : (
                      <span className="out-of-stock">Rupture</span>
                    )}
                  </div>
                </div>

                {/* Note */}
                {product.rating && (
                  <div className="product-rating">
                    <FaStar />
                    <span>{product.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && (
        <div className="no-promotions">
          <FaGift className="no-promotions-icon" />
          <h3>Aucun produit en promotion trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Modal de détails du produit */}
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
                <img src={selectedProduct.image} alt={selectedProduct.name} />
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
                {/* Code promo */}
                <div className="modal-section">
                  <h3>Code Promo</h3>
                  <div className="modal-code-container">
                    <span className="modal-code">{selectedProduct.promotion.code}</span>
                    <button
                      className="modal-copy-btn"
                      onClick={() => copyPromoCode(selectedProduct.promotion.code)}
                    >
                      {copiedCode === selectedProduct.promotion.code ? <FaCheck /> : <FaCopy />}
                      Copier
                    </button>
                  </div>
                </div>

                {/* Conditions */}
                <div className="modal-section">
                  <h3>Conditions d'utilisation</h3>
                  <div className="modal-conditions">
                    {selectedProduct.promotion.conditions.map((condition, index) => (
                      <div key={index} className="modal-condition">
                        <FaInfoCircle />
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spécifications */}
                {selectedProduct.specs && (
                  <div className="modal-section">
                    <h3>Spécifications</h3>
                    <div className="product-specs">
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <div key={key} className="spec-item">
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informations promotion */}
                <div className="modal-section">
                  <h3>Informations promotion</h3>
                  <div className="modal-info">
                    <div className="info-item">
                      <FaCalendarAlt />
                      <span>Valide jusqu'au {new Date(selectedProduct.promotion.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <FaUsers />
                      <span>{selectedProduct.promotion.usedCount}/{selectedProduct.promotion.usageLimit} utilisations</span>
                    </div>
                    <div className="info-item">
                      <FaTag />
                      <span>Minimum d'achat: {selectedProduct.promotion.minPurchase.toLocaleString()} DA</span>
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
                    disabled={!selectedProduct.inStock}
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