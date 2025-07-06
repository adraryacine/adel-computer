import { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaGift,
  FaPercent,
  FaCalendarAlt,
  FaBox
} from 'react-icons/fa';
import { 
  fetchAllPromotions, 
  deletePromotion, 
  togglePromotionStatus 
} from '../../services/promotionService';
import { fetchProducts } from '../../services/productService';
import PromotionForm from './PromotionForm';

const PromotionList = ({ onPromotionUpdate }) => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [promotionsData, productsData] = await Promise.all([
        fetchAllPromotions(),
        fetchProducts()
      ]);
      
      setPromotions(promotionsData);
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      return;
    }

    try {
      await deletePromotion(id);
      await loadData();
      if (onPromotionUpdate) onPromotionUpdate();
    } catch (err) {
      console.error('Failed to delete promotion:', err);
      alert('Erreur lors de la suppression de la promotion');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await togglePromotionStatus(id, !currentStatus);
      await loadData();
      if (onPromotionUpdate) onPromotionUpdate();
    } catch (err) {
      console.error('Failed to toggle promotion status:', err);
      alert('Erreur lors de la modification du statut');
    }
  };

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setShowForm(true);
  };

  const handleSavePromotion = async () => {
    await loadData();
    setShowForm(false);
    setEditingPromotion(null);
    if (onPromotionUpdate) onPromotionUpdate();
  };

  const getStatusColor = (isActive, validUntil) => {
    if (!isActive) return 'error';
    const now = new Date();
    const end = new Date(validUntil);
    if (end < now) return 'warning';
    return 'success';
  };

  const getStatusText = (isActive, validUntil) => {
    if (!isActive) return 'Inactive';
    const now = new Date();
    const end = new Date(validUntil);
    if (end < now) return 'Expirée';
    return 'Active';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="admin-section">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <div className="admin-error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={loadData}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Gestion des Promotions</h2>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setEditingPromotion(null);
            setShowForm(true);
          }}
        >
          <FaPlus />
          Ajouter une promotion
        </button>
      </div>

      {/* Promotions Stats */}
      <div className="admin-stock-summary">
        <div className="admin-summary-card">
          <h3>Total des promotions</h3>
          <span className="admin-summary-number">{promotions.length}</span>
        </div>
        <div className="admin-summary-card">
          <h3>Promotions actives</h3>
          <span className="admin-summary-number">
            {promotions.filter(p => p.is_active && new Date(p.valid_until) > new Date()).length}
          </span>
        </div>
        <div className="admin-summary-card">
          <h3>Promotions expirées</h3>
          <span className="admin-summary-number admin-summary-warning">
            {promotions.filter(p => new Date(p.valid_until) <= new Date()).length}
          </span>
        </div>
        <div className="admin-summary-card">
          <h3>Promotions inactives</h3>
          <span className="admin-summary-number admin-summary-error">
            {promotions.filter(p => !p.is_active).length}
          </span>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Promotion</th>
              <th>Réduction</th>
              <th>Validité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promotion => {
              const product = promotion.products;
              const statusColor = getStatusColor(promotion.is_active, promotion.valid_until);
              const statusText = getStatusText(promotion.is_active, promotion.valid_until);
              
              return (
                <tr key={promotion.id}>
                  <td>
                    {product ? (
                      <div className="admin-product-info">
                        <img 
                          src={(() => {
                            let photos = product.photos;
                            if (typeof photos === 'string') {
                              try {
                                photos = JSON.parse(photos);
                              } catch {
                                // fallback
                              }
                            }
                            return Array.isArray(photos) && photos.length > 0 ? photos[0] : photos || 'https://via.placeholder.com/300x200?text=No+Image';
                          })()}
                          alt={product.name} 
                          className="admin-product-thumbnail"
                        />
                        <div>
                          <h4>{product.name}</h4>
                          <p className="admin-product-reference">{product.category}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="admin-out-of-stock">Produit supprimé</span>
                    )}
                  </td>
                  <td>
                    <div>
                      <strong>{promotion.title}</strong>
                      {promotion.description && (
                        <p style={{ fontSize: '0.9rem', color: '#a0a0a0', margin: '0.25rem 0 0 0' }}>
                          {promotion.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status admin-status-primary`}>
                      <FaPercent />
                      {promotion.discount_percentage}%
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>
                        <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                        Jusqu'au {formatDate(promotion.valid_until)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status admin-status-${statusColor}`}>
                      {statusText}
                    </span>
                  </td>
                  <td>
                    <div className="admin-order-actions">
                      <button
                        className="admin-btn admin-btn-sm admin-btn-info"
                        onClick={() => handleEditPromotion(promotion)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => handleToggleStatus(promotion.id, promotion.is_active)}
                        title={promotion.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {promotion.is_active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => handleDeletePromotion(promotion.id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No Promotions Message */}
      {promotions.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#a0a0a0' 
        }}>
          <FaGift style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <h3>Aucune promotion trouvée</h3>
          <p>Commencez par ajouter votre première promotion</p>
        </div>
      )}

      {/* Promotion Form Modal */}
      {showForm && (
        <PromotionForm
          promotion={editingPromotion}
          products={products}
          onSave={handleSavePromotion}
          onClose={() => {
            setShowForm(false);
            setEditingPromotion(null);
          }}
        />
      )}
    </div>
  );
};

export default PromotionList; 