// ===============================
// STOCK MANAGEMENT - Gestion des stocks
// ===============================
import { useState } from 'react';
import { FaBox, FaPlus, FaMinus, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import { updateProductStock } from '../../services/productService';

const StockManagement = ({ products, onStockUpdate }) => {
  const [stockUpdates, setStockUpdates] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStockChange = (productId, newValue) => {
    const numValue = parseInt(newValue) || 0;
    setStockUpdates(prev => ({
      ...prev,
      [productId]: numValue
    }));
  };

  const handleQuickUpdate = (productId, increment) => {
    const currentStock = stockUpdates[productId] !== undefined 
      ? stockUpdates[productId] 
      : products.find(p => p.id === productId)?.inStock || 0;
    
    const newStock = Math.max(0, currentStock + increment);
    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
  };

  const handleSaveStock = async (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined) return;

    setIsUpdating(true);
    try {
      await updateProductStock(productId, newStock);
      
      onStockUpdate(productId, newStock);
      setStockUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[productId];
        return newUpdates;
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Erreur lors de la mise à jour du stock: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveAll = async () => {
    if (Object.keys(stockUpdates).length === 0) return;

    setIsUpdating(true);
    try {
      // Update all changed stocks
      for (const [productId, newStock] of Object.entries(stockUpdates)) {
        await updateProductStock(productId, newStock);
        onStockUpdate(productId, newStock);
      }
      
      setStockUpdates({});
    } catch (error) {
      console.error('Error updating stocks:', error);
      alert('Erreur lors de la mise à jour des stocks: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'admin-status-error', text: 'Rupture de stock', icon: <FaExclamationTriangle /> };
    if (stock <= 5) return { status: 'admin-status-warning', text: 'Stock faible', icon: <FaExclamationTriangle /> };
    return { status: 'admin-status-success', text: 'En stock', icon: <FaBox /> };
  };

  const lowStockProducts = products.filter(p => p.inStock <= 5);
  const outOfStockProducts = products.filter(p => p.inStock === 0);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Gestion des Stocks</h2>
        {Object.keys(stockUpdates).length > 0 && (
          <button 
            className="admin-btn admin-btn-primary"
            onClick={handleSaveAll}
            disabled={isUpdating}
          >
            <FaSave />
            Sauvegarder tous les changements ({Object.keys(stockUpdates).length})
          </button>
        )}
      </div>

      {/* Stock Alerts */}
      <div className="admin-alerts">
        {outOfStockProducts.length > 0 && (
          <div className="admin-alert admin-alert-error">
            <FaExclamationTriangle />
            <strong>{outOfStockProducts.length}</strong> produit(s) en rupture de stock
          </div>
        )}
        
        {lowStockProducts.length > 0 && (
          <div className="admin-alert admin-alert-warning">
            <FaExclamationTriangle />
            <strong>{lowStockProducts.length}</strong> produit(s) avec un stock faible (≤5)
          </div>
        )}
      </div>

      {/* Stock Summary */}
      <div className="admin-stock-summary">
        <div className="admin-summary-card">
          <h3>Total des produits</h3>
          <span className="admin-summary-number">{products.length}</span>
        </div>
        <div className="admin-summary-card">
          <h3>En stock</h3>
          <span className="admin-summary-number">{products.filter(p => p.inStock > 0).length}</span>
        </div>
        <div className="admin-summary-card">
          <h3>Stock faible</h3>
          <span className="admin-summary-number admin-summary-warning">{lowStockProducts.length}</span>
        </div>
        <div className="admin-summary-card">
          <h3>Rupture</h3>
          <span className="admin-summary-number admin-summary-error">{outOfStockProducts.length}</span>
        </div>
      </div>

      {/* Products Stock Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock actuel</th>
              <th>Nouveau stock</th>
              <th>Actions</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const currentStock = stockUpdates[product.id] !== undefined 
                ? stockUpdates[product.id] 
                : product.inStock;
              const stockStatus = getStockStatus(currentStock);
              const hasChanges = stockUpdates[product.id] !== undefined;

              return (
                <tr key={product.id} className={hasChanges ? 'admin-row-changed' : ''}>
                  <td className="admin-product-info">
                    <img src={product.image} alt={product.name} className="admin-product-thumbnail" />
                    <div>
                      <h4>{product.name}</h4>
                      <p className="admin-product-reference">{product.reference}</p>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td className="admin-current-stock">
                    <span className={product.inStock === 0 ? 'admin-out-of-stock' : ''}>
                      {product.inStock}
                    </span>
                  </td>
                  <td className="admin-new-stock">
                    <div className="admin-stock-input-group">
                      <button 
                        className="admin-stock-btn"
                        onClick={() => handleQuickUpdate(product.id, -1)}
                        disabled={currentStock <= 0}
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        value={currentStock}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        min="0"
                        className="admin-stock-input"
                      />
                      <button 
                        className="admin-stock-btn"
                        onClick={() => handleQuickUpdate(product.id, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td className="admin-stock-actions">
                    {hasChanges && (
                      <button 
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={() => handleSaveStock(product.id)}
                        disabled={isUpdating}
                      >
                        <FaSave />
                        Sauvegarder
                      </button>
                    )}
                  </td>
                  <td className="admin-stock-status">
                    <span className={`admin-status ${stockStatus.status}`}>
                      {stockStatus.icon}
                      {stockStatus.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      <div className="admin-bulk-actions">
        <h3>Actions en lot</h3>
        <div className="admin-bulk-buttons">
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => {
              const updates = {};
              products.forEach(p => {
                updates[p.id] = Math.max(0, p.inStock - 1);
              });
              setStockUpdates(updates);
            }}
          >
            Diminuer tous les stocks de 1
          </button>
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => {
              const updates = {};
              products.forEach(p => {
                updates[p.id] = p.inStock + 1;
              });
              setStockUpdates(updates);
            }}
          >
            Augmenter tous les stocks de 1
          </button>
          <button 
            className="admin-btn admin-btn-danger"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir mettre tous les stocks à 0 ?')) {
                const updates = {};
                products.forEach(p => {
                  updates[p.id] = 0;
                });
                setStockUpdates(updates);
              }
            }}
          >
            Mettre tous les stocks à 0
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockManagement; 