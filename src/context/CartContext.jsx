import { createContext, useContext, useReducer, useEffect } from 'react';

// ===============================
// CONTEXTE DU PANIER (CART CONTEXT)
// Permet de gérer l'état global du panier dans toute l'application
// ===============================

// État initial du panier
const initialState = {
  items: [], // Liste des produits dans le panier
  total: 0, // Prix total
  itemCount: 0 // Nombre total d'articles
};

// Actions possibles pour le reducer du panier
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM', // Ajouter un produit
  REMOVE_ITEM: 'REMOVE_ITEM', // Supprimer un produit
  UPDATE_QUANTITY: 'UPDATE_QUANTITY', // Modifier la quantité d'un produit
  CLEAR_CART: 'CLEAR_CART', // Vider le panier
  LOAD_CART: 'LOAD_CART' // Charger le panier depuis le stockage local
};

// Reducer : fonction qui gère les modifications de l'état du panier
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      // Vérifie si le produit est déjà dans le panier
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Si le produit existe, on augmente la quantité
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        // Sinon, on ajoute le produit avec une quantité de 1
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      // Supprime un produit du panier
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      // Met à jour la quantité d'un produit
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la quantité est 0 ou négative, on supprime le produit
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: id });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      // Vide complètement le panier
      return initialState;
    
    case CART_ACTIONS.LOAD_CART:
      // Charge le panier depuis le stockage local
      return action.payload;
    
    default:
      return state;
  }
};

// Création du contexte du panier
const CartContext = createContext();

// Hook personnalisé pour accéder facilement au contexte du panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider du contexte : englobe l'application pour fournir l'accès au panier
export const CartProvider = ({ children }) => {
  // On utilise useReducer pour gérer l'état complexe du panier
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // À chaque modification du panier, on sauvegarde dans le localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Au montage, on charge le panier depuis le localStorage s'il existe
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Fonctions utilitaires pour manipuler le panier
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Valeur fournie à tous les composants enfants
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  // On englobe les enfants avec le provider du contexte
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 