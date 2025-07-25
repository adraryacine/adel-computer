import { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaPaperPlane, FaComments } from 'react-icons/fa';
import gsap from 'gsap';

const ContactForm = ({ onResetForm }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);
  const formContainerRef = useRef(null);

  useEffect(() => {
    // Only run animations when the form is visible
    if (!isSubmitted) {
      // Use a short timeout to ensure the form is rendered before animating
      const timer = setTimeout(() => {
        const form = document.querySelector('.contact-form');
        if (form) {
          gsap.from(form, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          });
          const formGroups = form.querySelectorAll('.form-group');
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

    if (!formData.sujet.trim()) {
      newErrors.sujet = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
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

    // Real-time email validation
    if (name === 'email') {
      const newErrors = { ...errors };
      
      if (!value.trim()) {
        newErrors.email = 'L\'email est requis';
      } else {
        // Check for specific email format issues
        if (!value.includes('@')) {
          newErrors.email = 'L\'email doit contenir le symbole @';
        } else if (value.indexOf('@') === 0) {
          newErrors.email = 'L\'email doit avoir un nom avant le @';
        } else if (value.indexOf('@') === value.length - 1) {
          newErrors.email = 'L\'email doit avoir un domaine après le @';
        } else if (value.split('@').length > 2) {
          newErrors.email = 'L\'email ne peut contenir qu\'un seul @';
        } else {
          const [localPart, domainPart] = value.split('@');
          if (!domainPart.includes('.')) {
            newErrors.email = 'Le domaine doit contenir un point (ex: .com, .fr)';
          } else if (domainPart.indexOf('.') === 0) {
            newErrors.email = 'Le domaine ne peut pas commencer par un point';
          } else if (domainPart.indexOf('.') === domainPart.length - 1) {
            newErrors.email = 'Le domaine doit avoir une extension après le point';
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            newErrors.email = 'Format d\'email invalide (pas d\'espaces autorisés)';
          } else {
            newErrors.email = '';
          }
        }
      }
      
      setErrors(newErrors);
    } else {
      // Clear error when user starts typing for other fields
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
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
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Animate success
    const successMessage = document.querySelector('.contact-success-message');
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
      sujet: '',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
    if (typeof onResetForm === 'function') {
      onResetForm();
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact-success-message">
        <div className="success-icon">✅</div>
        <h3>Message envoyé avec succès !</h3>
        <p>
          Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
        </p>
        <button className="btn btn-primary" onClick={resetForm}>
          Nouveau message
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form-container" ref={formContainerRef}>
      <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nom">
              <FaUser />
              Nom *
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className={errors.nom ? 'error' : ''}
              placeholder="Votre nom"
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

        <div className="form-group">
          <label htmlFor="sujet">
            <FaComments />
            Sujet *
          </label>
          <input
            type="text"
            id="sujet"
            name="sujet"
            value={formData.sujet}
            onChange={handleInputChange}
            className={errors.sujet ? 'error' : ''}
            placeholder="Sujet de votre message"
          />
          {errors.sujet && <span className="error-message">{errors.sujet}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={errors.message ? 'error' : ''}
            placeholder="Votre message..."
            rows="6"
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
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
                Envoyer le Message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 