import { useState } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaTruck, FaCreditCard, FaShieldAlt, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import { formatPrice } from '../utils/formatPrice';
import { sendEmailOTP, verifyEmailOTP, saveOrder } from '../services/orderService';
import { updateProductStock, fetchProductById } from '../services/productService';

const OrderForm = ({ cartItems, totalPrice, onClose, onOrderComplete }) => {
  const [step, setStep] = useState(1); // 1: Customer Info, 2: OTP Verification, 3: Confirmation
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phoneNumber: '',
    wilaya: '',
    address: '',
    notes: '',
    deliveryType: 'domicile'
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

  // Delivery fees based on wilaya and delivery type
  const getDeliveryFee = (wilaya, deliveryType) => {
    const majorCities = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna'];
    let baseFee = 1000;
    if (wilaya === 'Béjaïa' || wilaya === 'Bejaia') baseFee = 400;
    else if (majorCities.includes(wilaya)) baseFee = 700;
    // Add 200 DA if domicile
    if (deliveryType === 'domicile') baseFee += 200;
    return baseFee;
  };
  const deliveryFee = getDeliveryFee(formData.wilaya, formData.deliveryType);
  const finalTotal = totalPrice + deliveryFee;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
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
      const result = await sendEmailOTP(formData.email);
      
      if (result.success) {
        setStep(2);
        // If OTP is provided in result (for testing), show it
        if (result.otp) {
          console.log('🔐 OTP for testing:', result.otp);
          // Show OTP to user in a friendly way
          alert(`Code OTP généré avec succès!\n\nVotre code de vérification est: ${result.otp}\n\nVérifiez votre email ou utilisez ce code pour continuer.`);
        }
      } else {
        alert('Erreur lors de l\'envoi du code OTP. Veuillez réessayer.');
      }
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
      // Check stock for each product before confirming order
      for (const item of cartItems) {
        const product = await fetchProductById(item.id);
        if (item.quantity > product.quantity) {
          setIsSubmitting(false);
          alert(`Stock insuffisant pour le produit "${item.name}". Stock disponible: ${product.quantity}, demandé: ${item.quantity}`);
          return;
        }
      }
      // Verify OTP using the service
      await verifyEmailOTP(formData.email, otp);
      // Save order to database
      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        wilaya: formData.wilaya,
        address: formData.address,
        notes: formData.notes,
        deliveryType: formData.deliveryType,
        items: cartItems,
        totalPrice,
        deliveryFee,
        finalTotal,
        orderDate: new Date().toISOString()
      };
      await saveOrder(orderData);
      // Update stock for each product
      for (const item of cartItems) {
        const product = await fetchProductById(item.id);
        await updateProductStock(item.id, product.quantity - item.quantity);
      }
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

  const resendEmailOTP = async () => {
    setIsSubmitting(true);
    try {
      const result = await sendEmailOTP(formData.email);
      if (result.success) {
        alert('Code OTP renvoyé avec succès!');
        // If OTP is provided in result (for testing), show it
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
                  <FaEnvelope />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Votre email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
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

            <div className="form-section">
              <h3>Type de Livraison</h3>
              <div className="form-group" style={{ display: 'flex', justifyContent: 'center', gap: '2em', background: 'var(--bg-tertiary, #f1f5f9)', borderRadius: '12px', padding: '1em 0', margin: '1em 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', cursor: 'pointer', fontWeight: 500, fontSize: '1.08em', padding: '0.5em 1.2em', borderRadius: '8px', border: formData.deliveryType === 'domicile' ? '2px solid var(--accent-primary, #2563eb)' : '2px solid transparent', background: formData.deliveryType === 'domicile' ? 'rgba(37,99,235,0.07)' : 'transparent', transition: 'all 0.2s' }}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="domicile"
                    checked={formData.deliveryType === 'domicile'}
                    onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'domicile' }))}
                    style={{ accentColor: 'var(--accent-primary, #2563eb)', width: '1.2em', height: '1.2em' }}
                  />
                  Livraison à domicile <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: '0.98em' }}>(+200 DA)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', cursor: 'pointer', fontWeight: 500, fontSize: '1.08em', padding: '0.5em 1.2em', borderRadius: '8px', border: formData.deliveryType === 'bureau' ? '2px solid var(--accent-primary, #2563eb)' : '2px solid transparent', background: formData.deliveryType === 'bureau' ? 'rgba(37,99,235,0.07)' : 'transparent', transition: 'all 0.2s' }}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="bureau"
                    checked={formData.deliveryType === 'bureau'}
                    onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'bureau' }))}
                    style={{ accentColor: 'var(--accent-primary, #2563eb)', width: '1.2em', height: '1.2em' }}
                  />
                  Livraison au bureau
                </label>
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
                    Envoi du code par email...
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
                <button type="button" className="btn btn-outline" onClick={resendEmailOTP} disabled={isSubmitting}>
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
                <span>Email:</span>
                <span>{formData.email}</span>
              </div>
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