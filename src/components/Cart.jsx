// ===============================
// CART (PANIER)
// Affiche le panier sous forme de modal avec gestion des articles, quantités et total
// ===============================
import { useState } from 'react';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import OrderForm from './OrderForm';

const Cart = ({ isOpen, onClose }) => {
  // Accès au contexte du panier et aux fonctions de gestion
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  // Pour naviguer vers le magasin
  const navigate = useNavigate();
  // État pour gérer l'affichage du formulaire de commande
  const [showOrderForm, setShowOrderForm] = useState(false);

  console.log('Cart component rendering, isOpen:', isOpen);
  console.log('Cart component props:', { isOpen, onClose });

  // Gère le changement de quantité d'un article
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Ouvre le formulaire de commande
  const handleCheckout = () => {
    setShowOrderForm(true);
  };

  // Ferme le formulaire de commande
  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
  };

  // Gère la finalisation de la commande
  const handleOrderComplete = (orderData) => {
    console.log('Order completed:', orderData);
    
    // Ici vous pouvez envoyer la commande à votre backend/Supabase
    // saveOrderToDatabase(orderData);
    
    // Vider le panier après commande réussie
    clearCart();
    
    // Fermer le panier et le formulaire
    onClose();
    setShowOrderForm(false);
    
    // Optionnel: Rediriger vers une page de confirmation
    // navigate('/order-confirmation');
  };

  // Permet de continuer les achats (retour au magasin)
  const handleContinueShopping = () => {
    onClose();
    navigate('/magasin');
  };

  // Si le panier n'est pas ouvert, on ne rend rien
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay du panier (clique à l'extérieur pour fermer) */}
      <div className="cart-overlay" onClick={onClose}>
        {/* Conteneur principal du panier (stop la propagation du clic) */}
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

          {/* Si le panier est vide */}
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
              {/* Liste des articles du panier */}
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-category">{item.category}</p>
                      <p className="cart-item-price">{formatPrice(item.price)} DA</p>
                    </div>
                    
                    {/* Gestion de la quantité */}
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
                    
                    {/* Total pour cet article */}
                    <div className="cart-item-total">
                      {formatPrice(item.price * item.quantity)} DA
                    </div>
                    
                    {/* Bouton pour supprimer l'article */}
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

              {/* Pied du panier : total et actions */}
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">{formatPrice(cart.total)} DA</span>
                  </div>
                  
                  <div className="cart-actions">
                    <button className="btn btn-secondary" onClick={clearCart}>
                      Vider le panier
                    </button>
                    <button 
                      className="btn btn-primary checkout-btn"
                      onClick={handleCheckout}
                    >
                      Commander
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Formulaire de commande */}
      {showOrderForm && (
        <OrderForm
          cartItems={cart.items}
          totalPrice={cart.total}
          onClose={handleCloseOrderForm}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </>
  );
};

export default Cart; 