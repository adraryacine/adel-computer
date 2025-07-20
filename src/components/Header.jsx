// ===============================
// HEADER (EN-TÊTE DE NAVIGATION)
// Affiche la barre de navigation, le logo, le bouton panier et le menu mobile
// ===============================
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import logoAdel from '../assets/logo-adel.png';

const Header = ({ onOpenCart }) => {
  // État pour savoir si la page est scrollée (pour effet visuel)
  const [isScrolled, setIsScrolled] = useState(false);
  // État pour afficher ou cacher le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Permet de connaître la page courante
  const location = useLocation();
  // Accès au panier global
  const { cart } = useCart();

  // Ajoute un effet lors du scroll pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animations GSAP désactivées pour l'instant
    // Voir App.jsx pour l'exemple
  }, []);

  // Ouvre ou ferme le menu mobile
  const toggleMobileMenu = () => {
    console.log('Mobile menu button clicked!');
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Animation GSAP désactivée
  };

  // Ferme le menu mobile
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Gère le clic sur le bouton panier
  const handleCartClick = () => {
    console.log('Cart button clicked!');
    console.log('onOpenCart function:', onOpenCart);
    if (onOpenCart) {
      console.log('Calling onOpenCart...');
      onOpenCart();
    } else {
      console.log('onOpenCart is not defined!');
    }
    closeMobileMenu();
  };

  // Liste des liens de navigation
  const navItems = [
    { path: '/magasin', label: 'Magasin' },
    { path: '/promotions', label: 'Promotions' },
    { path: '/about', label: 'À Propos' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo cliquable */}
          <Link to="/" className="logo" onClick={closeMobileMenu} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.2rem 0'}}>
            <img src={logoAdel} alt="Adel Computers Logo" style={{height: '40px', width: '40px', objectFit: 'contain', display: 'block'}} />
          </Link>

          {/* Menu de navigation principal (desktop) */}
          <nav className="nav-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions à droite : bouton panier et menu mobile */}
          <div className="header-actions">
            <button
              className="cart-button"
              onClick={handleCartClick}
              aria-label="Ouvrir le panier"
            >
              <FaShoppingCart />
              {/* Badge du nombre d'articles dans le panier */}
              {cart.itemCount > 0 && (
                <span className="cart-badge">{cart.itemCount}</span>
              )}
            </button>

            {/* Bouton pour ouvrir/fermer le menu mobile */}
            <button
              className="mobile-menu-toggle"
              onClick={(e) => { console.log('Button onClick fired'); toggleMobileMenu(); }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Menu mobile (affiché sur petits écrans) */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <nav className="nav-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            {/* Lien panier dans le menu mobile */}
            <button className="nav-link cart-link-mobile" onClick={handleCartClick}>
              <FaShoppingCart />
              Panier ({cart.itemCount})
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 