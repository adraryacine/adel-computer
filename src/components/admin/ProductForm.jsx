// ===============================
// PRODUCT FORM - Formulaire d'ajout/modification de produit
// ===============================
import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSave, FaImage, FaBox, FaTag, FaDollarSign, FaInfoCircle, FaUpload, FaLink, FaTrash } from 'react-icons/fa';
import { saveProduct, updateProduct } from '../../services/productService';
import { uploadImage, uploadMultipleImages, getRLSInstructions, deleteImage } from '../../services/uploadService';
import { testProductImagesBucket } from '../../utils/storageSetup';

const ProductForm = ({ product, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
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
  const [imageMode, setImageMode] = useState('link'); // 'link' or 'upload'
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // For editing existing products
  const [uploadedImagePaths, setUploadedImagePaths] = useState([]); // Track paths for deletion
  const [existingImagePaths, setExistingImagePaths] = useState([]); // Track existing image paths
  const [linkImages, setLinkImages] = useState([]); // Track link images separately
  const [uploadingImages, setUploadingImages] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Test storage bucket access
    const testStorage = async () => {
      try {
        const result = await testProductImagesBucket();
        setStorageReady(result.success);
        setStorageMessage(result.message);
        
        if (!result.success) {
          console.warn('⚠️ Storage not ready:', result.message);
        }
      } catch (error) {
        console.error('Failed to test storage:', error);
        setStorageReady(false);
        setStorageMessage('Erreur lors du test du stockage');
      }
    };
    
    testStorage();
  }, []);

  const refreshStorageTest = async () => {
    try {
      const result = await testProductImagesBucket();
      setStorageReady(result.success);
      setStorageMessage(result.message);
      
      if (result.success) {
        alert('✅ Stockage d\'images activé avec succès !');
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Failed to refresh storage test:', error);
      setStorageReady(false);
      setStorageMessage('Erreur lors du test du stockage');
    }
  };

  useEffect(() => {
    if (product) {
      // Editing existing product
      setFormData({
        name: product.name || '',
        category: typeof product.category === 'object' && product.category !== null ? product.category.id : product.category || '',
        price: product.price !== undefined && product.price !== null ? String(product.price) : '',
        description: product.description || '',
        quantity: product.quantity !== undefined && product.quantity !== null ? String(product.quantity) : '0',
        brand: product.brand || '',
        reference: product.reference || '',
        images: '', // Don't include existing images in the textarea to avoid duplication
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
      
      // Set existing images for editing
      const currentImages = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
      setExistingImages(currentImages);
      setUploadedImages([]); // Reset uploaded images when editing
      setUploadedImagePaths([]); // Reset uploaded image paths
      setLinkImages([]); // Reset link images when editing
      
      // Extract paths from existing images (if they're Supabase URLs)
      const extractPaths = (images) => {
        return images.map(img => {
          // Check if it's a Supabase storage URL
          if (img.includes('supabase.co/storage/v1/object/public/product-images/')) {
            const pathMatch = img.match(/product-images\/(.+)$/);
            return pathMatch ? pathMatch[1] : null;
          }
          return null;
        }).filter(path => path !== null);
      };
      
      setExistingImagePaths(extractPaths(currentImages));
    } else {
      // New product - reset all state
      setFormData({
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
      setExistingImages([]);
      setUploadedImages([]);
      setUploadedImagePaths([]);
      setExistingImagePaths([]);
      setLinkImages([]);
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

  const handleFileUpload = async (files) => {
    try {
      setUploadingImages(true);
      const fileArray = Array.from(files);
      
      console.log('📤 Uploading files:', fileArray.map(f => f.name));
      
      const uploadResults = await uploadMultipleImages(fileArray);
      
      const newImages = uploadResults.map(result => result.url);
      const newPaths = uploadResults.map(result => result.path);
      
      setUploadedImages(prev => [...prev, ...newImages]);
      setUploadedImagePaths(prev => [...prev, ...newPaths]);
      
      console.log('✅ Files uploaded successfully');
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      // Check if it's an RLS error and show specific instructions
      if (error.message && error.message.includes('politique de sécurité (RLS)')) {
        const rlsInstructions = getRLSInstructions();
        const instructionsText = rlsInstructions.steps.join('\n');
        
        alert(
          '❌ Erreur lors de l\'upload des images:\n\n' +
          error.message + '\n\n' +
          'Instructions pour résoudre le problème:\n' +
          instructionsText
        );
      } else {
        alert('Erreur lors de l\'upload des images: ' + error.message);
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeUploadedImage = async (index) => {
    try {
      const imagePath = uploadedImagePaths[index];
      
      // Delete from Supabase storage if it's a Supabase image
      if (imagePath) {
        console.log('🗑️ Deleting uploaded image from storage:', imagePath);
        await deleteImage(imagePath);
      }
      
      // Remove from state
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      setUploadedImagePaths(prev => prev.filter((_, i) => i !== index));
      
    } catch (error) {
      console.error('❌ Failed to delete image:', error);
      alert('Erreur lors de la suppression de l\'image: ' + error.message);
    }
  };

  const removeExistingImage = async (index) => {
    try {
      const imagePath = existingImagePaths[index];
      
      // Delete from Supabase storage if it's a Supabase image
      if (imagePath) {
        console.log('🗑️ Deleting existing image from storage:', imagePath);
        await deleteImage(imagePath);
      }
      
      // Remove from state
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setExistingImagePaths(prev => prev.filter((_, i) => i !== index));
      
    } catch (error) {
      console.error('❌ Failed to delete existing image:', error);
      alert('Erreur lors de la suppression de l\'image: ' + error.message);
    }
  };

  const removeLinkImage = (index) => {
    setLinkImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleLinkImagesChange = (value) => {
    // Update form data
    handleInputChange('images', value);
    
    // Parse and update link images state
    const links = value.trim() ? value.split('\n').filter(url => url.trim()) : [];
    setLinkImages(links);
  };

  const isSupabaseImage = (imageUrl) => {
    return imageUrl && imageUrl.includes('supabase.co/storage/v1/object/public/product-images/');
  };

  const getAllImages = () => {
    const allImages = [...existingImages, ...uploadedImages, ...linkImages];
    
    // If there are no real images, return empty array (no fallback/mock images)
    if (allImages.length === 0) {
      return [];
    }
    
    return allImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const allImages = getAllImages();
      
      // For new products, send all data
      if (!product?.id) {
        const productData = {
          name: formData.name.trim(),
          category: formData.category,
          selling_price: parseFloat(formData.price) || 0,
          description: formData.description.trim(),
          quantity: parseInt(formData.quantity) || 0,
          brand: formData.brand.trim(),
          reference: formData.reference.trim(),
          photos: allImages,
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
        
        const currentImages = Array.isArray(product.images) ? product.images : [product.image];
        if (JSON.stringify(allImages) !== JSON.stringify(currentImages)) {
          updateData.photos = allImages;
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
      
      // Clean up uploaded images if save failed
      if (uploadedImagePaths.length > 0) {
        console.log('🧹 Cleaning up uploaded images due to save error');
        await cleanupUploadedImages();
      }
      
      alert('Erreur lors de la sauvegarde du produit: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanupUploadedImages = async () => {
    if (uploadedImagePaths.length > 0) {
      console.log('🧹 Cleaning up uploaded images:', uploadedImagePaths);
      
      const deletePromises = uploadedImagePaths.map(async (path) => {
        try {
          await deleteImage(path);
        } catch (error) {
          console.error('Failed to delete image during cleanup:', path, error);
        }
      });
      
      await Promise.all(deletePromises);
    }
  };

  const handleClose = async () => {
    // Clean up uploaded images if form is closed without saving
    if (uploadedImagePaths.length > 0) {
      const shouldCleanup = window.confirm(
        'Vous avez des images uploadées qui n\'ont pas été sauvegardées. ' +
        'Voulez-vous les supprimer du stockage ?'
      );
      
      if (shouldCleanup) {
        await cleanupUploadedImages();
      }
    }
    
    onClose();
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-container">
        <div className="admin-modal-header">
          <h2>
            {product ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h2>
          <button className="admin-modal-close" onClick={handleClose}>
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
                        <option key={category.id} value={category.id}>
                          {category.icon ? `${category.icon} ` : ''}{category.name}
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
                
                {/* Image Mode Toggle */}
                <div className="admin-form-group">
                  <div className="admin-image-mode-toggle">
                    <button
                      type="button"
                      className={`admin-btn admin-btn-sm ${imageMode === 'link' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                      onClick={() => setImageMode('link')}
                    >
                      <FaLink />
                      Liens
                    </button>
                    <button
                      type="button"
                      className={`admin-btn admin-btn-sm ${imageMode === 'upload' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                      onClick={() => setImageMode('upload')}
                    >
                      <FaUpload />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Link Mode */}
                {imageMode === 'link' && (
                  <div className="admin-form-group">
                    <label>
                      <FaImage />
                      URLs des images (une par ligne)
                    </label>
                    <textarea
                      value={formData.images}
                      onChange={(e) => handleLinkImagesChange(e.target.value)}
                      placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                      rows="4"
                    />
                    <small>Entrez une URL par ligne pour ajouter plusieurs images</small>
                  </div>
                )}

                {/* Upload Mode */}
                {imageMode === 'upload' && (
                  <div className="admin-form-group">
                    <label>
                      <FaUpload />
                      Images du produit
                    </label>
                    
                    {!storageReady ? (
                      <div className="admin-storage-warning">
                        <p>⚠️ {storageMessage}</p>
                        <div className="admin-storage-instructions">
                          <h5>Pour activer l'upload d'images :</h5>
                          <ol>
                            <li>Allez dans votre dashboard Supabase</li>
                            <li>Naviguez vers <strong>Storage</strong></li>
                            <li>Cliquez sur <strong>Create a new bucket</strong></li>
                            <li>Nom : <code>product-images</code></li>
                            <li>Cochez <strong>Public</strong></li>
                            <li>Taille max : <code>5MB</code></li>
                            <li>Types autorisés : <code>image/jpeg, image/png, image/gif, image/webp</code></li>
                          </ol>
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          onClick={() => setImageMode('link')}
                        >
                          <FaLink />
                          Utiliser les liens pour l'instant
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-info"
                          onClick={refreshStorageTest}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          🔄 Tester à nouveau
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* File Input */}
                        <div className="admin-file-upload-area">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImages}
                          >
                            <FaUpload />
                            {uploadingImages ? 'Upload en cours...' : 'Sélectionner des images'}
                          </button>
                          <small>Formats acceptés: JPG, PNG, GIF. Taille max: 5MB par image</small>
                        </div>

                        {/* Uploaded Images Preview */}
                        {uploadedImages.length > 0 && (
                          <div className="admin-uploaded-images">
                            <h4>Images uploadées:</h4>
                            <div className="admin-images-grid">
                              {uploadedImages.map((imageUrl, index) => (
                                <div key={index} className="admin-image-preview">
                                  <img src={imageUrl} alt={`Image ${index + 1}`} />
                                  <button
                                    type="button"
                                    className="admin-remove-image"
                                    onClick={() => removeUploadedImage(index)}
                                    title="Supprimer cette image"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Combined Images Preview */}
                {getAllImages().length > 0 && (
                  <div className="admin-form-group">
                    <h4>Images du produit ({getAllImages().length}):</h4>
                    <div className="admin-images-grid">
                      {/* Existing Images */}
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="admin-image-preview">
                          <img src={imageUrl} alt={`Image existante ${index + 1}`} />
                          {isSupabaseImage(imageUrl) && (
                            <button
                              type="button"
                              className="admin-remove-image"
                              onClick={() => removeExistingImage(index)}
                              title="Supprimer cette image du stockage"
                            >
                              <FaTrash />
                            </button>
                          )}
                          <div className="admin-image-label">
                            {isSupabaseImage(imageUrl) ? 'Stockage' : 'Lien externe'}
                          </div>
                        </div>
                      ))}
                      
                      {/* Uploaded Images */}
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={`uploaded-${index}`} className="admin-image-preview">
                          <img src={imageUrl} alt={`Image uploadée ${index + 1}`} />
                          <button
                            type="button"
                            className="admin-remove-image"
                            onClick={() => removeUploadedImage(index)}
                            title="Supprimer cette image du stockage"
                          >
                            <FaTrash />
                          </button>
                          <div className="admin-image-label">Nouvelle</div>
                        </div>
                      ))}
                      
                      {/* Link Images */}
                      {linkImages.map((imageUrl, index) => (
                        <div key={`link-${index}`} className="admin-image-preview">
                          <img src={imageUrl} alt={`Image lien ${index + 1}`} />
                          <button
                            type="button"
                            className="admin-remove-image"
                            onClick={() => removeLinkImage(index)}
                            title="Supprimer ce lien"
                          >
                            <FaTrash />
                          </button>
                          <div className="admin-image-label">Lien</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                onClick={handleClose}
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