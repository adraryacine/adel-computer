import { useEffect, useRef } from 'react';
import { FaUsers, FaLightbulb, FaHandshake, FaAward } from 'react-icons/fa';
import gsap from 'gsap';

const AboutUs = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector('.about-header');
    if (header) {
      gsap.from(header, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'opacity'
      });
    }
    const content = document.querySelector('.about-content');
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
    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'opacity' }
          );
        } else {
          entry.target.style.opacity = 1;
        }
      });
    }, { threshold: 0.1 });
    const sections = document.querySelectorAll('.about-section, .team-member');
    if (sections.length > 0) {
      sections.forEach(section => observer.observe(section));
    }
    return () => {
      if (sections.length > 0) {
        sections.forEach(section => section.style.opacity = 1);
      }
      observer.disconnect();
    };
  }, []);

  const values = [
    {
      icon: FaUsers,
      title: "Expertise",
      description: "Une équipe de techniciens qualifiés avec plus de 10 ans d'expérience dans le domaine informatique."
    },
    {
      icon: FaHandshake,
      title: "Confiance",
      description: "Nous établissons des relations durables avec nos clients basées sur la transparence et la fiabilité."
    },
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "Nous restons à la pointe de la technologie pour vous proposer les meilleures solutions."
    },
    {
      icon: FaAward,
      title: "Qualité",
      description: "Un engagement total envers l'excellence et la satisfaction client dans chaque intervention."
    }
  ];

  const team = [
    {
      name: "Ahmed Benali",
      role: "Fondateur & Directeur",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Expert en informatique avec 15 ans d'expérience. Passionné par l'innovation technologique et l'excellence du service client.",
      specialties: ["Gestion d'entreprise", "Stratégie IT", "Support client"]
    },
    {
      name: "amine sidane",
      role: "Technicienne Senior",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Spécialiste en réparation et maintenance informatique. Certifiée sur les dernières technologies.",
      specialties: ["Réparation PC", "Maintenance", "Formation"]
    },
    {
      name: "Marc Dubois",
      role: "Expert Ventes",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Conseiller commercial spécialisé dans les solutions informatiques pour entreprises et particuliers.",
      specialties: ["Conseil client", "Solutions sur mesure", "Support commercial"]
    },
  
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Header Section */}
        <div className="about-header">
          <h1>À Propos d'Adel Computers</h1>
          <p className="about-subtitle">
            Votre partenaire de confiance pour tous vos besoins informatiques
          </p>
        </div>

        {/* About Content */}
        <div className="about-content">
          {/* History & Mission Section */}
          <div className="about-section">
            <div className="section-content">
              <h2>Notre Histoire et Mission</h2>
              <div className="history-text">
                <p>
                  Fondée en 2003, Adel Computers est née de la passion pour la technologie 
                  et du désir d'offrir des solutions informatiques accessibles et de qualité 
                  aux particuliers et aux entreprises.
                </p>
                <p>
                  Notre mission est de démocratiser l'accès aux technologies de pointe 
                  en proposant des services personnalisés, des conseils experts et un 
                  accompagnement complet dans tous vos projets informatiques.
                </p>
                <p>
                  Nous croyons fermement que la technologie doit être au service de l'humain, 
                  c'est pourquoi nous nous efforçons de rendre l'informatique accessible, 
                  fiable et adaptée aux besoins de chacun.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="about-section">
            <h2>Nos Valeurs</h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <value.icon />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="about-section">
            <h2>Rencontrez Notre Équipe</h2>
            <p className="team-intro">
              Une équipe passionnée et expérimentée à votre service
            </p>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member-photo">
                    <img src={member.photo} alt={member.name} />
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-description">{member.description}</p>
                    <div className="member-specialties">
                      <h4>Spécialités :</h4>
                      <ul>
                        {member.specialties.map((specialty, specIndex) => (
                          <li key={specIndex}>{specialty}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="about-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">12+</div>
                <div className="stat-label">Années d'expérience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Clients satisfaits</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Interventions réalisées</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 