import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import gsap from 'gsap';

const Footer = () => {
  useEffect(() => {
    // Animate footer elements on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.from(entry.target, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        }
      });
    }, { threshold: 0.1 });

    const footerElements = document.querySelectorAll('.footer-section');
    if (footerElements.length > 0) {
      footerElements.forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { icon: FaFacebook, href: 'https://web.facebook.com/profile.php?id=100069773268161&locale=fr_FR', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/adel.computers/?hl=fr', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaTwitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Adel Computer</h3>
            <p>
              Votre partenaire de confiance pour tous vos besoins informatiques. 
              Nous proposons des solutions sur mesure pour particuliers et entreprises.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h3>Nos Services</h3>
            <Link to="/magasin">Vente de Matériel</Link>
            <Link to="/services">Maintenance & Réparation</Link>
            <Link to="/services">Installation Logicielle</Link>
            <Link to="/services">Support Technique</Link>
          
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>
              <FaMapMarkerAlt style={{ marginRight: '8px' }} />
              123 Rue de la Technologie<br />
              75001 Paris, France
            </p>
            <p>
              <FaPhone style={{ marginRight: '8px' }} />
              034 12 45 17
            </p>
            <p>
              <FaEnvelope style={{ marginRight: '8px' }} />
              contact@adelcomputer.fr
            </p>
          </div>

          <div className="footer-section">
            <h3>Informations</h3>
            <Link to="/about">À Propos</Link>
            <Link to="/contact">Contact</Link>
            <a href="#" target="_blank" rel="noopener noreferrer">Politique de Confidentialité</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Conditions d'Utilisation</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Mentions Légales</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Adel Computer. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 