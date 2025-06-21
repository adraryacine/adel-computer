// ===============================
// PAGE DÉTAILS PRODUIT
// Affiche les informations détaillées d'un produit sélectionné
// ===============================
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const ProductDetails = () => {
  // Récupère l'id du produit depuis l'URL
  const { id } = useParams();
  // Permet de naviguer entre les pages
  const navigate = useNavigate();
  // Fonction pour ajouter au panier
  const { addToCart } = useCart();
  // Recherche le produit correspondant à l'id
  const product = products.find(p => p.id === Number(id));

  // Scroll vers le haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Si le produit n'existe pas, affiche un message d'erreur
  if (!product) {
    return <div className="container"><h2>Produit introuvable</h2></div>;
  }

  // Retour à la page magasin
  const handleBack = () => {
    navigate('/magasin');
  };

  // Ajoute le produit au panier si en stock
  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product);
      // Feedback visuel
      alert(`${product.name} a été ajouté au panier !`);
    }
  };

  return (
    <div className="container product-details-modern">
      {/* Bouton retour */}
      <button className="btn btn-secondary mb-4" onClick={handleBack}>
        ← Retour au magasin
      </button>
      <div className="product-details-flex">
        {/* Image du produit */}
        <div className="product-details-imgbox">
          <img src={product.image} alt={product.name} className="product-details-image" />
        </div>
        {/* Informations détaillées */}
        <div className="product-details-info">
          <div className="product-details-header">
            <span className="product-details-category">{product.category}</span>
            <h1 className="product-details-title">{product.name}</h1>
          </div>
          <div className="product-details-pricebox">
            <span className="product-details-price">{formatPrice(product.price)} DA</span>
            <span className={`product-details-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>{product.inStock ? 'En stock' : 'Rupture de stock'}</span>
          </div>
          <p className="product-details-description">{product.description}</p>
          {/* Spécifications techniques */}
          <ul className="product-details-specs">
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
          <div className="product-details-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FaShoppingCart />
              {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 