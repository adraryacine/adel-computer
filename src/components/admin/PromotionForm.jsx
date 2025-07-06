import { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaSave, 
  FaGift, 
  FaPercent, 
  FaCalendarAlt, 
  FaBox,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import { createPromotion, updatePromotion } from '../../services/promotionService';

const PromotionForm = ({ promotion, products, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    product_id: '',
    is_active: true,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title || '',
        description: promotion.description || '',
        discount_percentage: promotion.discount_percentage?.toString() || '',
        product_id: promotion.product_id || '',
        is_active: promotion.is_active !== false,
        valid_from: promotion.valid_from ? new Date(promotion.valid_from).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        valid_until: promotion.valid_until ? new Date(promotion.valid_until).toISOString().split('T')[0] : ''
      });
    }
  }, [promotion]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.discount_percentage) {
      newErrors.discount_percentage = 'Le pourcentage de réduction est requis';
    } else {
      const percentage = parseInt(formData.discount_percentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.discount_percentage = 'Le pourcentage doit être entre 0 et 100';
      }
    }

    if (!formData.product_id) {
      newErrors.product_id = 'Le produit est requis';
    }

    if (!formData.valid_until) {
      newErrors.valid_until = 'La date de fin est requise';
    } else {
      const endDate = new Date(formData.valid_until);
      const startDate = new Date(formData.valid_from);
      if (endDate <= startDate) {
        newErrors.valid_until = 'La date de fin doit être après la date de début';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const promotionData = {
        ...formData,
        discount_percentage: parseInt(formData.discount_percentage),
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until).toISOString()
      };

      if (promotion) {
        await updatePromotion(promotion.id, promotionData);
      } else {
        await createPromotion(promotionData);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save promotion:', error);
      alert('Erreur lors de la sauvegarde de la promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-container">
        <div className="admin-modal-header">
          <h2>
            {promotion ? 'Modifier la promotion' : 'Ajouter une nouvelle promotion'}
          </h2>
          <button className="admin-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="admin-modal-content">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-sections">
              {/* Basic Information */}
              <div className="admin-form-section">
                <h3>Informations de base</h3>
                
                <div className="admin-form-group">
                  <label>
                    <FaGift />
                    Titre de la promotion *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Promotion Gaming - 20%"
                    className={errors.title ? 'admin-input-error' : ''}
                  />
                  {errors.title && <span className="admin-error-message">{errors.title}</span>}
                </div>

                <div className="admin-form-group">
                  <label>
                    <FaGift />
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description de la promotion (optionnel)"
                    rows="3"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>
                      <FaPercent />
                      Pourcentage de réduction *
                    </label>
                    <input
                      type="number"
                      value={formData.discount_percentage}
                      onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
                      placeholder="20"
                      min="0"
                      max="100"
                      className={errors.discount_percentage ? 'admin-input-error' : ''}
                    />
                    {errors.discount_percentage && <span className="admin-error-message">{errors.discount_percentage}</span>}
                  </div>

                  <div className="admin-form-group">
                    <label>
                      <FaToggleOn />
                      Statut
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        className={`admin-btn admin-btn-sm ${formData.is_active ? 'admin-btn-success' : 'admin-btn-secondary'}`}
                        onClick={() => handleInputChange('is_active', !formData.is_active)}
                      >
                        {formData.is_active ? <FaToggleOn /> : <FaToggleOff />}
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="admin-form-section">
                <h3>Sélection du produit</h3>
                
                <div className="admin-form-group">
                  <label>
                    <FaBox />
                    Produit *
                  </label>
                  <select
                    value={formData.product_id}
                    onChange={(e) => handleInputChange('product_id', e.target.value)}
                    className={errors.product_id ? 'admin-input-error' : ''}
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.category} ({product.selling_price} DA)
                      </option>
                    ))}
                  </select>
                  {errors.product_id && <span className="admin-error-message">{errors.product_id}</span>}
                </div>

                {formData.product_id && (
                  <div style={{ 
                    padding: '1rem', 
                    background: '#0f3460', 
                    borderRadius: '0.5rem',
                    marginTop: '1rem'
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                      Produit sélectionné:
                    </h4>
                    {(() => {
                      const selectedProduct = products.find(p => p.id === formData.product_id);
                      if (!selectedProduct) return <p>Produit non trouvé</p>;
                      
                      const originalPrice = parseFloat(selectedProduct.selling_price) || 0;
                      const discountAmount = (originalPrice * parseInt(formData.discount_percentage || 0)) / 100;
                      const discountedPrice = originalPrice - discountAmount;
                      
                      return (
                        <div>
                          <p style={{ margin: '0.25rem 0', color: '#a0a0a0' }}>
                            <strong>Nom:</strong> {selectedProduct.name}
                          </p>
                          <p style={{ margin: '0.25rem 0', color: '#a0a0a0' }}>
                            <strong>Catégorie:</strong> {selectedProduct.category}
                          </p>
                          <p style={{ margin: '0.25rem 0', color: '#a0a0a0' }}>
                            <strong>Prix original:</strong> {originalPrice.toLocaleString()} DA
                          </p>
                          {formData.discount_percentage && (
                            <>
                              <p style={{ margin: '0.25rem 0', color: '#a0a0a0' }}>
                                <strong>Prix réduit:</strong> {discountedPrice.toLocaleString()} DA
                              </p>
                              <p style={{ margin: '0.25rem 0', color: '#10b981' }}>
                                <strong>Économies:</strong> {discountAmount.toLocaleString()} DA
                              </p>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Validity Period */}
              <div className="admin-form-section">
                <h3>Période de validité</h3>
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>
                      <FaCalendarAlt />
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => handleInputChange('valid_from', e.target.value)}
                    />
                    <small>La promotion commencera à partir de cette date</small>
                  </div>

                  <div className="admin-form-group">
                    <label>
                      <FaCalendarAlt />
                      Date de fin *
                    </label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => handleInputChange('valid_until', e.target.value)}
                      className={errors.valid_until ? 'admin-input-error' : ''}
                    />
                    {errors.valid_until && <span className="admin-error-message">{errors.valid_until}</span>}
                    <small>La promotion expirera à cette date</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="admin-form-actions">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="admin-btn admin-btn-primary"
                disabled={isSubmitting}
              >
                <FaSave />
                {isSubmitting ? 'Sauvegarde...' : (promotion ? 'Modifier' : 'Ajouter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm; 