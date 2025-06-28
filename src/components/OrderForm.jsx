import { useState } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaTruck, FaCreditCard, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { formatPrice } from '../utils/formatPrice';
import { sendOTP, verifyOTP, saveOrder } from '../services/orderService';

const OrderForm = ({ cartItems, totalPrice, onClose, onOrderComplete }) => {
  const [step, setStep] = useState(1); // 1: Customer Info, 2: OTP Verification, 3: Confirmation
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    wilaya: '',
    address: '',
    notes: ''
  });
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Wilayas of Algeria
  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
    'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
  ];

  // Delivery fees based on wilaya (you can customize this)
  const getDeliveryFee = (wilaya) => {
    const majorCities = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna'];
    return majorCities.includes(wilaya) ? 500 : 800; // 500 DA for major cities, 800 DA for others
  };

  const deliveryFee = getDeliveryFee(formData.wilaya);
  const finalTotal = totalPrice + deliveryFee;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^(0|00213|\+213)[567][0-9]{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Numéro de téléphone invalide';
    }

    if (!formData.wilaya) {
      newErrors.wilaya = 'La wilaya est requise';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send OTP using the service
      await sendOTP(formData.phoneNumber);
      
      setStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Erreur lors de l\'envoi du code OTP. Veuillez réessayer.');
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
      // Verify OTP using the service
      await verifyOTP(formData.phoneNumber, otp);
      
      // Save order to database
      const orderData = {
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        wilaya: formData.wilaya,
        address: formData.address,
        notes: formData.notes,
        items: cartItems,
        totalPrice,
        deliveryFee,
        finalTotal,
        orderDate: new Date().toISOString()
      };
      
      await saveOrder(orderData);
      
      setStep(3);
      
      // Call the callback to complete the order
      if (onOrderComplete) {
        onOrderComplete(orderData);
      }
    } catch (error) {
      console.error('Error verifying OTP or saving order:', error);
      if (error.message === 'Invalid OTP') {
        alert('Code OTP incorrect. Veuillez réessayer.');
      } else {
        alert('Erreur lors de la vérification. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    setIsSubmitting(true);
    try {
      await sendOTP(formData.phoneNumber);
      alert('Code OTP renvoyé avec succès!');
    } catch (error) {
      alert('Erreur lors du renvoi du code OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form-overlay">
      <div className="order-form-container">
        <div className="order-form-header">
          <h2>
            {step === 1 && <FaCreditCard />}
            {step === 2 && <FaShieldAlt />}
            {step === 3 && <FaCheckCircle />}
            {step === 1 && 'Finaliser la Commande'}
            {step === 2 && 'Vérification OTP'}
            {step === 3 && 'Commande Confirmée'}
          </h2>
          <button className="order-form-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Step 1: Customer Information */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-section">
              <h3>Informations Client</h3>
              
              <div className="form-group">
                <label>
                  <FaUser />
                  Nom Complet *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Votre nom complet"
                  className={errors.customerName ? 'error' : ''}
                />
                {errors.customerName && <span className="error-message">{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label>
                  <FaPhone />
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="0XX XX XX XX XX"
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Adresse de Livraison</h3>
              
              <div className="form-group">
                <label>
                  <FaMapMarkerAlt />
                  Wilaya *
                </label>
                <select
                  value={formData.wilaya}
                  onChange={(e) => handleInputChange('wilaya', e.target.value)}
                  className={errors.wilaya ? 'error' : ''}
                >
                  <option value="">Sélectionnez votre wilaya</option>
                  {wilayas.map(wilaya => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
                {errors.wilaya && <span className="error-message">{errors.wilaya}</span>}
              </div>

              <div className="form-group">
                <label>
                  <FaMapMarkerAlt />
                  Adresse Complète *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Votre adresse complète (rue, quartier, etc.)"
                  rows="3"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label>Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Instructions spéciales pour la livraison..."
                  rows="2"
                />
              </div>
            </div>

            <div className="order-summary">
              <h3>Récapitulatif de la Commande</h3>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name}</span>
                    <span>{item.quantity}x {formatPrice(item.price)} DA</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-line">
                  <span>Sous-total:</span>
                  <span>{formatPrice(totalPrice)} DA</span>
                </div>
                <div className="summary-line">
                  <span>Frais de livraison ({formData.wilaya || 'Wilaya'}):</span>
                  <span>{formatPrice(deliveryFee)} DA</span>
                </div>
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)} DA</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Envoi du code OTP...
                  </>
                ) : (
                  'Confirmer la Commande'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOTPSubmit} className="order-form">
            <div className="otp-section">
              <div className="otp-info">
                <h3>Vérification par SMS</h3>
                <p>
                  Nous avons envoyé un code de vérification à <strong>{formData.phoneNumber}</strong>
                </p>
                <p>Veuillez saisir le code à 6 chiffres reçu par SMS.</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  <strong>Note:</strong> Pour la démo, vérifiez la console pour voir le code OTP généré.
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
                <button type="button" className="btn btn-outline" onClick={resendOTP} disabled={isSubmitting}>
                  Renvoyer le code
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

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="order-confirmation">
            <div className="confirmation-icon">
              <FaCheckCircle />
            </div>
            <h3>Commande Confirmée!</h3>
            <p>
              Merci pour votre commande. Notre équipe va vous contacter très bientôt 
              pour confirmer les détails de livraison.
            </p>
            
            <div className="order-details">
              <h4>Détails de la Commande</h4>
              <div className="detail-item">
                <span>Numéro de téléphone:</span>
                <span>{formData.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <span>Adresse de livraison:</span>
                <span>{formData.address}, {formData.wilaya}</span>
              </div>
              <div className="detail-item">
                <span>Total payé:</span>
                <span>{formatPrice(finalTotal)} DA</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="btn btn-primary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm; 