import { useEffect, useRef } from 'react';
import ContactForm from '../components/ContactForm';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUser, FaLock } from 'react-icons/fa';
import gsap from 'gsap';

const ContactProfile = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector('.contact-header');
    if (header) {
      gsap.from(header, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'opacity'
      });
    }
    const content = document.querySelector('.contact-content');
    if (content) {
      gsap.from(content, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        clearProps: 'opacity'
      });
    }
    const infoCards = document.querySelectorAll('.contact-info-card');
    if (infoCards.length > 0) {
      gsap.fromTo(infoCards,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.2, delay: 0.4, ease: 'power2.out', clearProps: 'opacity' }
      );
    }
    return () => {
      if (infoCards.length > 0) {
        infoCards.forEach(card => card.style.opacity = 1);
    }
    };
  }, []);

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Adresse",
      content: "123 Rue de la Technologie<br />75001 Paris, France",
      link: "https://maps.google.com"
    },
    {
      icon: FaPhone,
      title: "Téléphone",
      content: "+33 1 23 45 67 89",
      link: "tel:+33123456789"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: "contact@adelcomputer.fr",
      link: "mailto:contact@adelcomputer.fr"
    },
    {
      icon: FaClock,
      title: "Horaires",
      content: "Lun-Ven: 9h-18h<br />Sam: 9h-17h<br />Dim: Fermé"
    }
  ];

  return (
    <div className="contact-profile-page" style={{opacity: 1}}>
      <div className="container" style={{opacity: 1}}>
        {/* Header Section */}
        <div className="contact-header" style={{opacity: 1}}>
          <h1 style={{color: 'var(--text-primary)'}}>Contact & Mon Compte</h1>
          <p className="contact-subtitle" style={{color: 'var(--text-secondary)'}}>
            Contactez-nous ou gérez votre profil utilisateur
          </p>
        </div>

        {/* Contact Content */}
        <div className="contact-content" style={{opacity: 1}}>
          {/* Contact Information Section */}
          <div className="contact-section" style={{opacity: 1}}>
            <h2>Informations de Contact</h2>
            <div className="contact-info-grid" style={{opacity: 1}}>
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card" style={{opacity: 1}}>
                  <div className="contact-icon" style={{color: 'var(--accent-primary)'}}>
                    <info.icon />
                  </div>
                  <div className="contact-details">
                    <h3 style={{color: 'var(--text-primary)'}}>{info.title}</h3>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        dangerouslySetInnerHTML={{ __html: info.content }}
                        style={{color: 'var(--accent-info)'}}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: info.content }} style={{color: 'var(--text-secondary)'}} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-section" style={{opacity: 1}}>
            <h2>Nous Contacter</h2>
            <p className="contact-form-intro">
              Vous avez une question ou besoin d'assistance ? 
              N'hésitez pas à nous contacter via le formulaire ci-dessous.
            </p>
            <ContactForm />
          </div>

          {/* Profile Section */}
          <div className="contact-section" style={{opacity: 1}}>
            <div className="profile-section">
              <div className="profile-header">
                <div className="profile-icon">
                  <FaUser />
                </div>
                <h2>Mon Compte (En développement)</h2>
              </div>
              <div className="profile-content">
                <p>
                  Ceci est la section de profil utilisateur. Les fonctionnalités futures incluront :
                </p>
                <ul className="profile-features">
                  <li>Historique des commandes</li>
                  <li>Informations de compte</li>
                  <li>Préférences personnalisées</li>
                  <li>Suivi des services</li>
                  <li>Factures et devis</li>
                  <li>Support technique personnalisé</li>
                </ul>
                <div className="profile-placeholder">
                  <div className="placeholder-icon">
                    <FaLock />
                  </div>
                  <p>
                    Cette section sera bientôt disponible. 
                    Nous travaillons actuellement sur l'implémentation 
                    de ces fonctionnalités pour améliorer votre expérience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="contact-section" style={{opacity: 1}}>
            <h2>Notre Localisation</h2>
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-icon">
                  <FaMapMarkerAlt />
                </div>
                <p>Carte interactive en cours de développement</p>
                <p className="map-address">
                  123 Rue de la Technologie, 75001 Paris, France
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile; 