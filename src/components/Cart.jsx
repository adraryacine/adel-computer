import { useState } from 'react';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  console.log('Cart component rendering, isOpen:', isOpen);
  console.log('Cart component props:', { isOpen, onClose });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Ici vous pourriez rediriger vers une page de paiement
    // Pour l'instant, on affiche juste un message
    setTimeout(() => {
      alert('Fonctionnalité de paiement à implémenter !');
      setIsCheckingOut(false);
    }, 1000);
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/magasin');
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>
            <FaShoppingCart />
            Panier ({cart.itemCount})
          </h2>
          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <FaShoppingCart className="cart-empty-icon" />
            <h3>Votre panier est vide</h3>
            <p>Ajoutez des produits pour commencer vos achats</p>
            <button className="btn btn-primary" onClick={handleContinueShopping}>
              <FaArrowLeft />
              Continuer les achats
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">{formatPrice(cart.total)}</span>
                </div>
                
                <div className="cart-actions">
                  <button className="btn btn-secondary" onClick={clearCart}>
                    Vider le panier
                  </button>
                  <button 
                    className="btn btn-primary checkout-btn"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Traitement...' : 'Commander'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart; 