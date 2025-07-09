import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import gsap from 'gsap';

const Footer = () => {
  // Removed useEffect for footer animation

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
            <h3>Adel Computers</h3>
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
            <Link to="/magasin" onClick={() => window.scrollTo(0,0)}>Vente de Matériel</Link>
            <Link to="/services" onClick={() => window.scrollTo(0,0)}>Maintenance & Réparation</Link>
            <Link to="/services" onClick={() => window.scrollTo(0,0)}>Installation Logicielle</Link>
            <Link to="/services" onClick={() => window.scrollTo(0,0)}>Support Technique</Link>
          
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
            <Link to="/about" onClick={() => window.scrollTo(0,0)}>À Propos</Link>
            <Link to="/contact" onClick={() => window.scrollTo(0,0)}>Contact</Link>
            <Link to="/privacy" onClick={() => window.scrollTo(0,0)}>Politique de Confidentialité</Link>
            <Link to="/terms" onClick={() => window.scrollTo(0,0)}>Conditions d'Utilisation</Link>
            <Link to="/legal" onClick={() => window.scrollTo(0,0)}>Mentions Légales</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Adel Computers. Tous droits réservés.</p>
          <p className="footer-dev">Développé par <strong>yacine adrar</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 