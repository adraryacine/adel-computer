import { useEffect, useRef } from 'react';
import ServiceBookingForm from '../components/ServiceBookingForm';
import { FaTools, FaLaptop, FaDownload, FaBroom, FaCog } from 'react-icons/fa';
import gsap from 'gsap';

const Services = () => {
  const servicesRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector('.services-header');
    if (header) {
      gsap.from(header, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'opacity'
      });
    }
    const content = document.querySelector('.services-content');
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
    // Animate service cards on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'opacity' }
          );
        } else {
          entry.target.style.opacity = 1;
        }
      });
    }, { threshold: 0.1 });
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      serviceCards.forEach(card => observer.observe(card));
    }
    return () => {
      if (serviceCards.length > 0) {
        serviceCards.forEach(card => card.style.opacity = 1);
      }
      observer.disconnect();
    };
  }, []);

  const services = [
    {
      icon: FaTools,
      title: "Réparation PC",
      description: "Diagnostic et réparation de tous types d'ordinateurs (portables et fixes). Remplacement de composants, nettoyage, optimisation des performances.",
      features: ["Diagnostic gratuit", "Garantie 3 mois", "Pièces d'origine"]
    },
    {
      icon: FaDownload,
      title: "Installation Logicielle",
      description: "Installation et configuration de tous types de logiciels : système d'exploitation, applications bureautiques, logiciels spécialisés.",
      features: ["Installation propre", "Configuration optimale", "Formation utilisateur"]
    },
    {
      icon: FaBroom,
      title: "Nettoyage & Maintenance",
      description: "Nettoyage complet de votre ordinateur, maintenance préventive, optimisation du système et sauvegarde de données.",
      features: ["Nettoyage physique", "Optimisation système", "Sauvegarde données"]
    },
    {
      icon: FaCog,
      title: "Upgrade & Personnalisation",
      description: "Amélioration des performances par l'ajout de composants (RAM, SSD, carte graphique) et personnalisation selon vos besoins.",
      features: ["Conseils personnalisés", "Installation professionnelle", "Test de performance"]
    }
  ];

  return (
    <div className="services-page" style={{opacity: 1}}>
      <div className="container" style={{opacity: 1}}>
        {/* Header Section */}
        <div className="services-header" style={{opacity: 1}}>
          <h1 style={{color: 'var(--text-primary)'}} >Nos Services</h1>
          <p className="services-subtitle" style={{color: 'var(--text-secondary)'}}>
            Des solutions informatiques complètes pour particuliers et entreprises
          </p>
        </div>

        {/* Services Content */}
        <div className="services-content" style={{opacity: 1}}>
          {/* Services Description */}
          <div className="services-description" style={{opacity: 1}}>
            <div className="description-text">
              <h2>Notre Expertise</h2>
              <p>
                Chez Adel Computer, nous mettons notre expertise au service de vos besoins informatiques. 
                Notre équipe de techniciens qualifiés vous accompagne dans tous vos projets, 
                de la simple maintenance à la configuration de solutions complexes.
              </p>
              <p>
                Nous nous engageons à vous fournir un service de qualité, des conseils personnalisés 
                et des solutions adaptées à votre budget et à vos besoins.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="services-grid" style={{opacity: 1}}>
            {services.map((service, index) => (
              <div key={index} className="service-card" style={{opacity: 1}}>
                <div className="service-icon" style={{color: 'var(--accent-primary)'}}>
                  <service.icon />
                </div>
                <h3 className="service-title" style={{color: 'var(--text-primary)'}}>{service.title}</h3>
                <p className="service-description" style={{color: 'var(--text-secondary)'}}>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} style={{color: 'var(--accent-success)'}}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Booking Section */}
          <div className="booking-section" style={{opacity: 1}}>
            <div className="booking-header">
              <h2>Prendre rendez-vous avec un professionnel</h2>
              <p>
                Contactez-nous pour planifier une intervention ou obtenir un devis personnalisé. 
                Notre équipe vous répondra dans les plus brefs délais.
              </p>
            </div>
            
            <ServiceBookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 