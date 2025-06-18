import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Magasin from './pages/Magasin';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import ContactProfile from './pages/ContactProfile';
import ProductDetails from './pages/ProductDetails';
import './App.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Temporarily disabled GSAP animations to test
    // setTimeout(() => {
    //   const pageContent = document.querySelector('.page-content');
    //   if (pageContent) {
    //     // Page transition animation
    //     gsap.from(pageContent, {
    //       opacity: 0,
    //       y: 20,
    //       duration: 0.8,
    //       ease: 'power2.out'
    //     });
    //   }
    // }, 100);
  }, []);

  const handleOpenCart = () => {
    console.log('handleOpenCart called, setting isCartOpen to true');
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    console.log('handleCloseCart called, setting isCartOpen to false');
    setIsCartOpen(false);
  };

  console.log('App rendering, isCartOpen:', isCartOpen);

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header onOpenCart={handleOpenCart} />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Magasin />} />
              <Route path="/magasin" element={<Magasin />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactProfile />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </main>
          <Footer />
          <Cart isOpen={isCartOpen} onClose={handleCloseCart} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
