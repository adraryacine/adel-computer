import { useState, useEffect, useRef } from 'react';
import { FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaTools, FaPaperPlane } from 'react-icons/fa';
import gsap from 'gsap';
import { sendServiceOTP, verifyServiceOTP, saveServiceBooking } from '../services/serviceService';

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
  const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: Confirmation
  const [otp, setOtp] = useState('');
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
    try {
      // Send OTP
      const result = await sendServiceOTP(formData.email);
      if (result.success) {
        setStep(2);
        if (result.otp) {
          console.log('🔐 OTP for testing:', result.otp);
          alert(`Code OTP généré avec succès!\n\nVotre code de vérification est: ${result.otp}\n\nVérifiez votre email ou utilisez ce code pour continuer.`);
        }
      } else {
        alert("Erreur lors de l'envoi du code OTP. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert("Erreur lors de l'envoi du code OTP. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: 'Le code OTP est requis' });
      return;
    }
    if (otp.length !== 6) {
      setErrors({ otp: 'Le code OTP doit contenir 6 chiffres' });
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyServiceOTP(formData.email, otp);
      // Save booking to database
      const serviceData = {
        ...formData,
        otpCode: otp
      };
      await saveServiceBooking(serviceData);
      setStep(3);
    } catch (error) {
      console.error('Error verifying OTP or saving booking:', error);
      if (error.message === 'Invalid OTP') {
        alert('Code OTP incorrect. Veuillez réessayer.');
      } else {
        alert('Erreur lors de la vérification. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendServiceOTP = async () => {
    setIsSubmitting(true);
    try {
      const result = await sendServiceOTP(formData.email);
      if (result.success) {
        alert('Code OTP renvoyé avec succès!');
        if (result.otp) {
          console.log('🔐 New OTP for testing:', result.otp);
        }
      } else {
        alert('Erreur lors du renvoi du code OTP.');
      }
    } catch (error) {
      alert('Erreur lors du renvoi du code OTP.');
    } finally {
    setIsSubmitting(false);
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
    setStep(1);
  };

  if (step === 3) {
    return (
      <div className="success-message">
        <div className="success-icon">✅</div>
        <h3>Demande envoyée avec succès !</h3>
        <p>
          Votre demande a été envoyée et confirmée. Un professionnel vous contactera sous peu
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
      {step === 1 && (
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
                  Envoi du code par email...
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
      )}
      {step === 2 && (
        <form onSubmit={handleOTPSubmit} className="booking-form">
          <div className="otp-section">
            <div className="otp-info">
              <h3>Vérification par Email</h3>
              <p>
                Nous avons envoyé un code de vérification à <strong>{formData.email}</strong>
              </p>
              <p>Veuillez saisir le code à 6 chiffres reçu par email.</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                <strong>Note:</strong> Vérifiez votre boîte de réception et vos spams.
              </p>
            </div>
            <div className="form-group">
              <label>Code OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (errors.otp) setErrors({});
                }}
                placeholder="000000"
                maxLength="6"
                className={errors.otp ? 'error' : ''}
                autoFocus
              />
              {errors.otp && <span className="error-message">{errors.otp}</span>}
            </div>
            <div className="otp-actions">
              <button type="button" className="btn btn-outline" onClick={resendServiceOTP} disabled={isSubmitting}>
                Renvoyer le code par email
              </button>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              Retour
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Vérification...
                </>
              ) : (
                'Vérifier et Confirmer'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServiceBookingForm; 