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
// Importation de Vercel Analytics pour le tracking
import { Analytics } from '@vercel/analytics/react';
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
import Admin from './pages/Admin';
// Importation du composant de test Supabase
import SupabaseTest from './SupabaseTest';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LegalNotice from './pages/LegalNotice';
import UserAlert from './components/UserAlert';
// Importation des styles globaux
import './App1.css';

function App() {
  // État local pour savoir si le panier est ouvert ou fermé
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [userAlert, setUserAlert] = useState({ message: '', type: 'success' });

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
            <Route path="/" element={<Magasin setUserAlert={setUserAlert} />} />
            <Route path="/magasin" element={<Magasin setUserAlert={setUserAlert} />} />
              {/* Page des services */}
            <Route path="/services" element={<Services />} />
              {/* Page à propos */}
            <Route path="/about" element={<AboutUs />} />
              {/* Page de contact */}
            <Route path="/contact" element={<ContactProfile />} />
              {/* Page des promotions */}
            <Route path="/promotions" element={<Promotions />} />
              {/* Page d'administration */}
            <Route path="/admin" element={<Admin />} />
              {/* Détails d'un produit (avec id dynamique) */}
              <Route path="/product/:id" element={<ProductDetails setUserAlert={setUserAlert} />} />
              {/* Test de connexion Supabase */}
              <Route path="/supabase-test" element={<SupabaseTest />} />
              {/* Legal pages */}
              <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/conditions-utilisation" element={<TermsOfUse />} />
              <Route path="/mentions-legales" element={<LegalNotice />} />
          </Routes>
        </main>
          {/* Pied de page */}
        <Footer />
          {/* Composant du panier (affiché en overlay si ouvert) */}
          <Cart isOpen={isCartOpen} onClose={handleCloseCart} setUserAlert={setUserAlert} />
          {/* Floating Theme Switch Button */}
          <button
            className="theme-switch-btn"
            onClick={toggleTheme}
            aria-label="Switch theme"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 2000,
              background: 'var(--gradient-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              cursor: 'pointer',
              transition: 'background 0.3s, color 0.3s',
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {/* User Alert */}
          <UserAlert message={userAlert.message} type={userAlert.type} onClose={() => setUserAlert({ message: '', type: 'success' })} />
      </div>
      {/* Vercel Analytics pour le tracking de toutes les pages */}
      <Analytics />
    </Router>
    </CartProvider>
  );
}

export default App;
