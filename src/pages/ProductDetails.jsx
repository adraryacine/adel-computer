import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === Number(id));

  // Scroll vers le haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return <div className="container"><h2>Produit introuvable</h2></div>;
  }

  const handleBack = () => {
    navigate('/magasin');
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product);
      // Feedback visuel
      alert(`${product.name} a été ajouté au panier !`);
    }
  };

  return (
    <div className="container product-details-modern">
      <button className="btn btn-secondary mb-4" onClick={handleBack}>
        ← Retour au magasin
      </button>
      <div className="product-details-flex">
        <div className="product-details-imgbox">
          <img src={product.image} alt={product.name} className="product-details-image" />
        </div>
        <div className="product-details-info">
          <div className="product-details-header">
            <span className="product-details-category">{product.category}</span>
            <h1 className="product-details-title">{product.name}</h1>
          </div>
          <div className="product-details-pricebox">
            <span className="product-details-price">{product.price.toFixed(2)} €</span>
            <span className={`product-details-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>{product.inStock ? 'En stock' : 'Rupture de stock'}</span>
          </div>
          <p className="product-details-description">{product.description}</p>
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