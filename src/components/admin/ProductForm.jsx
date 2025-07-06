// ===============================
// PRODUCT FORM - Formulaire d'ajout/modification de produit
// ===============================
import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage, FaBox, FaTag, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import { saveProduct, updateProduct } from '../../services/productService';
import { v4 as uuidv4 } from 'uuid';

const ProductForm = ({ product, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    name: '',
    category: '',
    price: '',
    description: '',
    quantity: '0',
    brand: '',
    reference: '',
    images: '',
    specs: {
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      ecran: '',
      marque: '',
      type: '',
      connectivite: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      // Editing existing product
      setFormData({
        id: product.id,
        name: product.name || '',
        category: product.category || '',
        price: product.price !== undefined && product.price !== null ? String(product.price) : '',
        description: product.description || '',
        quantity: product.quantity !== undefined && product.quantity !== null ? String(product.quantity) : '0',
        brand: product.brand || '',
        reference: product.reference || '',
        images: Array.isArray(product.images) ? product.images.join('\n') : product.image || '',
        specs: {
          processor: product.specs?.processor || '',
          ram: product.specs?.ram || '',
          storage: product.specs?.storage || '',
          graphics: product.specs?.graphics || '',
          ecran: product.specs?.ecran || '',
          marque: product.specs?.marque || '',
          type: product.specs?.type || '',
          connectivite: product.specs?.connectivite || ''
        }
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Le prix doit être un nombre valide supérieur à 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    const quantity = parseInt(formData.quantity);
    if (formData.quantity === '' || isNaN(quantity) || quantity < 0) {
      newErrors.quantity = 'Le stock doit être un nombre valide supérieur ou égal à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSpecsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For new products, send all data
      if (!product?.id) {
        const productData = {
          id: formData.id,
          name: formData.name.trim(),
          category: formData.category,
          selling_price: parseFloat(formData.price) || 0,
          description: formData.description.trim(),
          quantity: parseInt(formData.quantity) || 0,
          brand: formData.brand.trim(),
          reference: formData.reference.trim(),
          photos: formData.images.trim() ? formData.images.split('\n').filter(url => url.trim()) : [],
          specs: {
            processeur: formData.specs.processor,
            ram: formData.specs.ram,
            stockage: formData.specs.storage,
            carte_graphique: formData.specs.graphics,
            ecran: formData.specs.ecran,
            marque: formData.specs.marque,
            type: formData.specs.type,
            connectivite: formData.specs.connectivite
          }
        };

        // Additional validation for numeric fields
        if (isNaN(productData.selling_price) || productData.selling_price < 0) {
          throw new Error('Le prix doit être un nombre valide supérieur ou égal à 0');
        }
        
        if (isNaN(productData.quantity) || productData.quantity < 0) {
          throw new Error('Le stock doit être un nombre valide supérieur ou égal à 0');
        }

        const savedProduct = await saveProduct(productData);
        onSave(savedProduct);
      } else {
        // For existing products, only update changed fields
        const updateData = {};
        
        // Check each field and only include it if it has changed
        if (formData.name.trim() !== product.name) {
          updateData.name = formData.name.trim();
        }
        
        if (formData.category !== product.category) {
          updateData.category = formData.category;
        }
        
        const newPrice = parseFloat(formData.price) || 0;
        if (newPrice !== product.price) {
          updateData.selling_price = newPrice;
        }
        
        if (formData.description.trim() !== product.description) {
          updateData.description = formData.description.trim();
        }
        
        const newQuantity = parseInt(formData.quantity) || 0;
        if (newQuantity !== product.quantity) {
          updateData.quantity = newQuantity;
        }
        
        if (formData.brand.trim() !== (product.brand || '')) {
          updateData.brand = formData.brand.trim();
        }
        
        if (formData.reference.trim() !== (product.reference || '')) {
          updateData.reference = formData.reference.trim();
        }
        
        const newImages = formData.images.trim() ? formData.images.split('\n').filter(url => url.trim()) : [];
        const currentImages = Array.isArray(product.images) ? product.images : [product.image];
        if (JSON.stringify(newImages) !== JSON.stringify(currentImages)) {
          updateData.photos = newImages;
        }
        
        // Check specs changes
        const newSpecs = {
          processeur: formData.specs.processor,
          ram: formData.specs.ram,
          stockage: formData.specs.storage,
          carte_graphique: formData.specs.graphics,
          ecran: formData.specs.ecran,
          marque: formData.specs.marque,
          type: formData.specs.type,
          connectivite: formData.specs.connectivite
        };
        
        const currentSpecs = product.specs || {};
        if (JSON.stringify(newSpecs) !== JSON.stringify(currentSpecs)) {
          updateData.specs = newSpecs;
        }
        
        // Only update if there are changes
        if (Object.keys(updateData).length > 0) {
          // Additional validation for numeric fields
          if (updateData.selling_price !== undefined && (isNaN(updateData.selling_price) || updateData.selling_price < 0)) {
            throw new Error('Le prix doit être un nombre valide supérieur ou égal à 0');
          }
          
          if (updateData.quantity !== undefined && (isNaN(updateData.quantity) || updateData.quantity < 0)) {
            throw new Error('Le stock doit être un nombre valide supérieur ou égal à 0');
          }
          
          const updatedProduct = await updateProduct(product.id, updateData);
          onSave(updatedProduct);
        } else {
          // No changes made
          alert('Aucune modification détectée');
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erreur lors de la sauvegarde du produit: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-container">
        <div className="admin-modal-header">
          <h2>
            {product ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
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
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>
                      <FaBox />
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nom du produit"
                      className={errors.name ? 'admin-input-error' : ''}
                    />
                    {errors.name && <span className="admin-error-message">{errors.name}</span>}
                  </div>

                  <div className="admin-form-group">
                    <label>
                      <FaTag />
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={errors.category ? 'admin-input-error' : ''}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <span className="admin-error-message">{errors.category}</span>}
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>
                      <FaDollarSign />
                      Prix (DA) *
                    </label>
                    <input
                      type="number"
                      value={String(formData.price || '')}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="100"
                      className={errors.price ? 'admin-input-error' : ''}
                    />
                    {errors.price && <span className="admin-error-message">{errors.price}</span>}
                  </div>

                  <div className="admin-form-group">
                    <label>
                      <FaBox />
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={String(formData.quantity || '0')}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="0"
                      min="0"
                      className={errors.quantity ? 'admin-input-error' : ''}
                    />
                    {errors.quantity && <span className="admin-error-message">{errors.quantity}</span>}
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>
                      <FaInfoCircle />
                      Marque
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="Marque du produit"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      <FaInfoCircle />
                      Référence
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                      placeholder="Référence du produit"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>
                    <FaInfoCircle />
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description détaillée du produit"
                    rows="4"
                    className={errors.description ? 'admin-input-error' : ''}
                  />
                  {errors.description && <span className="admin-error-message">{errors.description}</span>}
                </div>
              </div>

              {/* Images */}
              <div className="admin-form-section">
                <h3>Images</h3>
                <div className="admin-form-group">
                  <label>
                    <FaImage />
                    URLs des images (une par ligne)
                  </label>
                  <textarea
                    value={formData.images}
                    onChange={(e) => handleInputChange('images', e.target.value)}
                    placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                    rows="4"
                  />
                  <small>Entrez une URL par ligne pour ajouter plusieurs images</small>
                </div>
              </div>

              {/* Specifications */}
              <div className="admin-form-section">
                <h3>Spécifications techniques</h3>
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Processeur</label>
                    <input
                      type="text"
                      value={formData.specs.processor}
                      onChange={(e) => handleSpecsChange('processor', e.target.value)}
                      placeholder="Ex: Intel Core i7-10700K"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>RAM</label>
                    <input
                      type="text"
                      value={formData.specs.ram}
                      onChange={(e) => handleSpecsChange('ram', e.target.value)}
                      placeholder="Ex: 16GB DDR4"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Stockage</label>
                    <input
                      type="text"
                      value={formData.specs.storage}
                      onChange={(e) => handleSpecsChange('storage', e.target.value)}
                      placeholder="Ex: 512GB SSD"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Carte graphique</label>
                    <input
                      type="text"
                      value={formData.specs.graphics}
                      onChange={(e) => handleSpecsChange('graphics', e.target.value)}
                      placeholder="Ex: NVIDIA RTX 3070"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Écran</label>
                    <input
                      type="text"
                      value={formData.specs.ecran}
                      onChange={(e) => handleSpecsChange('ecran', e.target.value)}
                      placeholder="Ex: 15.6&quot; Full HD"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Connectivité</label>
                    <input
                      type="text"
                      value={formData.specs.connectivite}
                      onChange={(e) => handleSpecsChange('connectivite', e.target.value)}
                      placeholder="Ex: WiFi 6, Bluetooth 5.0"
                    />
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
                {isSubmitting ? 'Sauvegarde...' : (product ? 'Modifier' : 'Ajouter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 