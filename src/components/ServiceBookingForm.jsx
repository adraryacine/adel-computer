import { useState, useEffect, useRef } from 'react';
import { FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaTools, FaPaperPlane } from 'react-icons/fa';
import gsap from 'gsap';

const ServiceBookingForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeService: '',
    description: '',
    datePreferee: '',
    heurePreferee: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    // Only run animations when the form is visible
    if (!isSubmitted) {
      // Use a short timeout to ensure the form is rendered before animating
      const timer = setTimeout(() => {
        if (formRef.current) {
          gsap.from(formRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          });
          const formGroups = formRef.current.querySelectorAll('.form-group');
          if (formGroups.length > 0) {
            gsap.from(formGroups, {
              x: -30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              delay: 0.2,
              ease: 'power2.out'
            });
          }
        }
      }, 100); // 100ms delay

      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const serviceTypes = [
    { value: 'reparation', label: 'Réparation PC' },
    { value: 'installation', label: 'Installation logicielle' },
    { value: 'nettoyage', label: 'Nettoyage' },
    { value: 'upgrade', label: 'Upgrade & Personnalisation' },
    { value: 'autre', label: 'Autre' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    if (!formData.typeService) {
      newErrors.typeService = 'Le type de service est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description du problème est requise';
    }

    if (!formData.datePreferee) {
      newErrors.datePreferee = 'La date préférée est requise';
    }

    if (!formData.heurePreferee) {
      newErrors.heurePreferee = 'L\'heure préférée est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Animate error shake
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: [-10, 10, -10, 10, 0],
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Animate success
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
      gsap.to(successMessage, {
        scale: [0.8, 1.1, 1],
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      typeService: '',
      description: '',
      datePreferee: '',
      heurePreferee: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="success-message">
        <div className="success-icon">✅</div>
        <h3>Demande envoyée avec succès !</h3>
        <p>
          Votre demande a été envoyée. Un professionnel vous contactera sous peu 
          pour confirmer votre rendez-vous.
        </p>
        <button className="btn btn-primary" onClick={resetForm}>
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <form ref={formRef} onSubmit={handleSubmit} className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nom">
              <FaUser />
              Nom Complet *
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className={errors.nom ? 'error' : ''}
              placeholder="Votre nom complet"
            />
            {errors.nom && <span className="error-message">{errors.nom}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telephone">
              <FaPhone />
              Téléphone *
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className={errors.telephone ? 'error' : ''}
              placeholder="06 12 34 56 78"
            />
            {errors.telephone && <span className="error-message">{errors.telephone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="typeService">
              <FaTools />
              Type de Service *
            </label>
            <select
              id="typeService"
              name="typeService"
              value={formData.typeService}
              onChange={handleInputChange}
              className={errors.typeService ? 'error' : ''}
            >
              <option value="">Sélectionnez un service</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
            {errors.typeService && <span className="error-message">{errors.typeService}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description du Problème *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={errors.description ? 'error' : ''}
            placeholder="Décrivez votre problème ou vos besoins..."
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="datePreferee">
              <FaCalendar />
              Date Préférée *
            </label>
            <input
              type="date"
              id="datePreferee"
              name="datePreferee"
              value={formData.datePreferee}
              onChange={handleInputChange}
              className={errors.datePreferee ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.datePreferee && <span className="error-message">{errors.datePreferee}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="heurePreferee">
              <FaClock />
              Heure Préférée *
            </label>
            <select
              id="heurePreferee"
              name="heurePreferee"
              value={formData.heurePreferee}
              onChange={handleInputChange}
              className={errors.heurePreferee ? 'error' : ''}
            >
              <option value="">Sélectionnez une heure</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.heurePreferee && <span className="error-message">{errors.heurePreferee}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Envoyer la Demande
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceBookingForm; 