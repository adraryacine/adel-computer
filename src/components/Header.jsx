import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';

const Header = ({ onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Temporarily disabled GSAP animations to test
    // // Animate header on mount
    // const header = document.querySelector('.header');
    // if (header) {
    //   gsap.from(header, {
    //     y: -100,
    //     opacity: 0,
    //     duration: 0.8,
    //     ease: 'power2.out'
    //   });
    // }
    // // Animate nav links only if they exist
    // const navLinks = document.querySelectorAll('.nav-link');
    // if (navLinks.length > 0) {
    //   gsap.from(navLinks, {
    //     y: -20,
    //     opacity: 0,
    //     duration: 0.6,
    //     stagger: 0.1,
    //     delay: 0.3,
    //     ease: 'power2.out'
    //   });
    // }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Temporarily disabled GSAP animations to test
    // if (!isMobileMenuOpen) {
    //   const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link');
    //   if (mobileNavLinks.length > 0) {
    //     gsap.from(mobileNavLinks, {
    //       x: -30,
    //       opacity: 0,
    //       duration: 0.4,
    //       stagger: 0.1,
    //       ease: 'power2.out'
    //     });
    //   }
    // }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

  const navItems = [
    { path: '/magasin', label: 'Magasin' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'À Propos' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            Adel Computer
          </Link>

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

          <div className="header-actions">
            <button
              className="cart-button"
              onClick={handleCartClick}
              aria-label="Ouvrir le panier"
              style={{ border: '2px solid red' }}
            >
              <FaShoppingCart />
              {cart.itemCount > 0 && (
                <span className="cart-badge">{cart.itemCount}</span>
              )}
            </button>

            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

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