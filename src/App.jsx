// ===============================
// APP.JSX - Composant racine de l'application
// Définit la structure globale, le routage, le contexte du panier, et l'agencement principal
// ===============================
// Importation des modules nécessaires pour le routage, l'état local, et les animations
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
// Importation du provider du panier pour le contexte global
import { CartProvider } from './context/CartContext';
// Importation des composants principaux de l'interface
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
// Importation des pages principales
import Magasin from './pages/Magasin';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import ContactProfile from './pages/ContactProfile';
import ProductDetails from './pages/ProductDetails';
import Promotions from './pages/Promotions';
// Importation des styles globaux
import './App.css';

function App() {
  // État local pour savoir si le panier est ouvert ou fermé
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Animation d'entrée de page avec GSAP (désactivée pour l'instant)
    // setTimeout(() => {
    //   const pageContent = document.querySelector('.page-content');
    //   if (pageContent) {
    //     // Animation de transition de page
    //     gsap.from(pageContent, {
    //       opacity: 0,
    //       y: 20,
    //       duration: 0.8,
    //       ease: 'power2.out'
    //     });
    //   }
    // }, 100);
  }, []);

  // Fonction pour ouvrir le panier (affiche le composant Cart)
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  // Fonction pour fermer le panier
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // Structure principale de l'application
  return (
    // Fournit le contexte du panier à toute l'application
    <CartProvider>
      {/* Router pour la navigation entre les pages */}
    <Router>
      <div className="app">
          {/* Barre de navigation en haut de la page */}
          <Header onOpenCart={handleOpenCart} />
          {/* Contenu principal de la page (affiche la page selon l'URL) */}
        <main className="page-content">
          <Routes>
              {/* Page d'accueil et magasin */}
            <Route path="/" element={<Magasin />} />
            <Route path="/magasin" element={<Magasin />} />
              {/* Page des services */}
            <Route path="/services" element={<Services />} />
              {/* Page à propos */}
            <Route path="/about" element={<AboutUs />} />
              {/* Page de contact */}
            <Route path="/contact" element={<ContactProfile />} />
              {/* Page des promotions */}
            <Route path="/promotions" element={<Promotions />} />
              {/* Détails d'un produit (avec id dynamique) */}
              <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
          {/* Pied de page */}
        <Footer />
          {/* Composant du panier (affiché en overlay si ouvert) */}
          <Cart isOpen={isCartOpen} onClose={handleCloseCart} />
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
