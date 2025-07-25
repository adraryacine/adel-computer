// ===============================
// PAGE DÉTAILS PRODUIT
// Affiche les informations détaillées d'un produit sélectionné
// ===============================
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaImage } from 'react-icons/fa';
import { fetchProductById } from '../services/productService.js';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import ImageGallery from '../components/ImageGallery';

const ProductDetails = ({ setUserAlert }) => {
  // Récupère l'id du produit depuis l'URL
  const { id } = useParams();
  // Permet de naviguer entre les pages
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  
  // États pour le produit et le chargement
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll vers le haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Charger le produit depuis Supabase
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Loading product with ID:', id);
        const productData = await fetchProductById(parseInt(id));
        setProduct(productData);
        
        console.log('✅ Product loaded:', productData);
      } catch (err) {
        console.error('❌ Error loading product:', err);
        setError(`Erreur de chargement: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // Affichage du loading
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/magasin')}>
            Retour au magasin
          </button>
        </div>
      </div>
    );
  }

  // Si le produit n'existe pas, affiche un message d'erreur
  if (!product) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Produit introuvable</h2>
          <p>Le produit que vous recherchez n'existe pas.</p>
          <button className="btn btn-primary" onClick={() => navigate('/magasin')}>
            Retour au magasin
          </button>
        </div>
      </div>
    );
  }

  // Retour à la page magasin
  const handleBack = () => {
    navigate('/magasin');
  };

  // Find how many of this product are already in the cart
  const cartItem = cart.items.find(item => item.id === (product ? product.id : null));
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const stockLimitReached = product && cartQuantity >= product.quantity && product.quantity > 0;

  // Ajoute le produit au panier si en stock
  const handleAddToCart = () => {
    if (product.quantity > 0 && !stockLimitReached) {
      addToCart(product);
      if (setUserAlert) setUserAlert({ message: 'Produit ajouté au panier !', type: 'success' });
    } else if (setUserAlert) {
      setUserAlert({ message: stockLimitReached ? 'Stock maximum atteint pour ce produit.' : 'Produit en rupture de stock.', type: 'error' });
    }
  };

  return (
    <div className="container product-details-modern">
      {/* Bouton retour */}
      <button className="btn btn-secondary mb-4" onClick={handleBack}>
        ← Retour au magasin
      </button>
      <div className="product-details-flex">
        {/* Image Gallery */}
        <div className="product-details-imgbox">
          {product.images && product.images.length > 0 ? (
            <ImageGallery 
              images={product.images} 
              productName={product.name}
            />
          ) : product.image ? (
            <ImageGallery 
              images={[product.image]} 
              productName={product.name}
            />
          ) : (
            <div className="product-image-placeholder">
              <FaImage />
              <span>Aucune image disponible</span>
            </div>
          )}
        </div>
        {/* Informations détaillées */}
        <div className="product-details-info">
          <div className="product-details-header">
            <span className="product-details-category">{product.category}</span>
            <h1 className="product-details-title">{product.name}</h1>
          </div>
          <div className="product-details-pricebox">
            <span className="product-details-price">{formatPrice(product.price)} DA</span>
            <span className={`product-details-stock ${product.quantity > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.quantity > 0 ? 'En stock' : 'Rupture de stock'}
            </span>
          </div>
          <p className="product-details-description">{product.description}</p>
          
          {/* Informations supplémentaires du produit */}
          {product.brand && (
            <div className="product-details-extra">
              <p><strong>Marque:</strong> {product.brand}</p>
              {product.reference && <p><strong>Référence:</strong> {product.reference}</p>}
              {product.quantity && <p><strong>Quantité disponible:</strong> {product.quantity}</p>}
              {product.warranty && <p><strong>Garantie:</strong> {product.warranty}</p>}
            </div>
          )}
          
          {/* Spécifications techniques */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <ul className="product-details-specs">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          )}
          
          <div className="product-details-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
              {product.quantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 