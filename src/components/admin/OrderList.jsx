// ===============================
// ORDER LIST - Liste des commandes
// ===============================
import { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaTruck, FaBox, FaUser, FaPhone, FaMapMarkerAlt, FaFileExcel } from 'react-icons/fa';
import { updateOrderStatus } from '../../services/orderService';
import * as XLSX from 'xlsx';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderList = ({ orders, onOrderUpdate }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'admin-status-warning';
      case 'confirmed': return 'admin-status-info';
      case 'processing': return 'admin-status-primary';
      case 'shipped': return 'admin-status-info';
      case 'delivered': return 'admin-status-success';
      case 'cancelled': return 'admin-status-error';
      default: return 'admin-status-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      console.error('❌ Invalid status value:', newStatus);
      alert('Statut de commande invalide: ' + newStatus);
      return;
    }
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      onOrderUpdate(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erreur lors de la mise à jour du statut: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Transform order data to match expected format
  const transformOrder = (order) => {
    return {
      ...order,
      customer: {
        name: order.customer_name || 'Client inconnu',
        email: order.email || 'Email non fourni',
        phone: order.phone_number || 'Téléphone non fourni',
        address: order.address || 'Adresse non fournie',
        wilaya: order.wilaya || 'Wilaya non fournie'
      },
      created_at: order.order_date || order.created_at,
      items: Array.isArray(order.items) ? order.items : []
    };
  };

  // Transform all orders
  const transformedOrders = orders.map(transformOrder);

  // Excel export function
  const handleExportExcel = () => {
    const data = transformedOrders.map(order => ({
      'ID': order.id,
      'Nom': order.customer.name,
      'Téléphone': order.customer.phone,
      'Email': order.customer.email,
      'Wilaya': order.customer.wilaya,
      'Adresse': order.customer.address,
      'Date': formatDate(order.created_at),
      'Total': order.final_total || calculateTotal(order.items),
      'Type Livraison': order.delivery_type === 'bureau' ? 'Bureau' : 'Domicile',
      'Statut': getStatusText(order.status),
      'Articles': order.items.map(i => `${i.name} x${i.quantity}`).join(' | ')
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes');
    XLSX.writeFile(wb, 'commandes.xlsx');
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h2>Gestion des Commandes</h2>
        <button className="admin-btn admin-btn-success" onClick={handleExportExcel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaFileExcel /> Exporter Excel
        </button>
      </div>

      {/* Order Stats */}
      <div className="admin-order-stats">
        <div className="admin-stat">
          <FaBox />
          Total: {transformedOrders.length}
        </div>
        <div className="admin-stat">
          <FaCheck />
          Livrées: {transformedOrders.filter(o => o.status === 'delivered').length}
        </div>
        <div className="admin-stat">
          <FaTruck />
          En cours: {transformedOrders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length}
        </div>
        <div className="admin-stat">
          <FaTimes />
          Annulées: {transformedOrders.filter(o => o.status === 'cancelled').length}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Type Livraison</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transformedOrders.map(order => (
              <tr key={order.id}>
                <td className="admin-order-id">#{order.id}</td>
                <td className="admin-customer-info">
  <span className="admin-customer-name">{order.customer.name}</span>
  <p>{order.customer.phone}</p>
</td>
                <td className="admin-order-date">{formatDate(order.created_at)}</td>
                <td className="admin-order-total">{order.final_total || calculateTotal(order.items)} DA</td>
                <td>{order.delivery_type === 'bureau' ? 'Bureau' : 'Domicile'}</td>
                <td>
                  <span className={`admin-status ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="admin-order-actions">
                  <button 
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setSelectedOrder(order)}
                    title="Voir les détails"
                  >
                    <FaEye />
                  </button>
                  
                  {order.status === 'pending' && (
                    <>
                      <button 
                        className="admin-btn admin-btn-success admin-btn-sm"
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        disabled={isUpdating}
                        title="Confirmer"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={isUpdating}
                        title="Annuler"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button 
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={() => handleStatusUpdate(order.id, 'processing')}
                      disabled={isUpdating}
                      title="En traitement"
                    >
                      <FaBox />
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button 
                      className="admin-btn admin-btn-info admin-btn-sm"
                      onClick={() => handleStatusUpdate(order.id, 'shipped')}
                      disabled={isUpdating}
                      title="Expédier"
                    >
                      <FaTruck />
                    </button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <button 
                      className="admin-btn admin-btn-success admin-btn-sm"
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                      disabled={isUpdating}
                      title="Marquer comme livrée"
                    >
                      <FaCheck />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container admin-order-details">
            <div className="admin-modal-header">
              <h2>Détails de la commande #{selectedOrder.id}</h2>
              <button className="admin-modal-close" onClick={() => setSelectedOrder(null)}>
                <FaTimes />
              </button>
            </div>

            {/* Printable Ticket Area */}
            <div className="admin-modal-content printable-ticket" id="printable-ticket">
              {/* Customer Information */}
              <div className="admin-order-section">
                <h3>
                  <FaUser />
                  Informations client
                </h3>
                <div className="admin-customer-details">
                  <p><strong>Nom:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Téléphone:</strong> {selectedOrder.customer.phone}</p>
                  <p><strong>Adresse:</strong> {selectedOrder.customer.address}</p>
                  <p><strong>Wilaya:</strong> {selectedOrder.customer.wilaya}</p>
                  <p><strong>Type de livraison:</strong> {selectedOrder.delivery_type === 'bureau' ? 'Bureau' : 'Domicile'}</p>
                  {selectedOrder.notes && (
                    <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="admin-order-section">
                <h3>
                  <FaBox />
                  Articles commandés
                </h3>
                <div className="admin-order-items">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className="admin-order-item">
                        <img src={item.image} alt={item.name} className="admin-item-image" />
                        <div className="admin-item-details">
                          <h4>{item.name}</h4>
                          <p className="admin-item-category">{item.category}</p>
                          <p className="admin-item-price">{item.price} DA</p>
                          <p className="admin-item-quantity">Quantité: {item.quantity}</p>
                        </div>
                        <div className="admin-item-total">
                          {item.price * item.quantity} DA
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucun article trouvé pour cette commande.</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="admin-order-summary">
                <div className="admin-summary-row">
                  <span>Sous-total:</span>
                  <span>{selectedOrder.total_price || calculateTotal(selectedOrder.items)} DA</span>
                </div>
                {selectedOrder.delivery_fee && (
                  <div className="admin-summary-row">
                    <span>Frais de livraison:</span>
                    <span>{selectedOrder.delivery_fee} DA</span>
                  </div>
                )}
                <div className="admin-summary-row admin-summary-total">
                  <span>Total:</span>
                  <span>{selectedOrder.final_total || calculateTotal(selectedOrder.items)} DA</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="admin-order-status">
                <h3>Statut actuel</h3>
                <span className={`admin-status ${getStatusColor(selectedOrder.status)} admin-status-large`}>
                  {getStatusText(selectedOrder.status)}
                </span>
                <p>Commande créée le {formatDate(selectedOrder.created_at)}</p>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Fermer
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Imprimer le ticket
              </button>
              {selectedOrder.status === 'pending' && (
                <>
                  <button 
                    className="admin-btn admin-btn-success"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, 'confirmed');
                      setSelectedOrder(null);
                    }}
                    disabled={isUpdating}
                  >
                    <FaCheck />
                    Confirmer la commande
                  </button>
                  <button 
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    disabled={isUpdating}
                  >
                    <FaTimes />
                    Annuler la commande
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList; 