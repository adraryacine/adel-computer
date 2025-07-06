import { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaTools, FaUser, FaPhone, FaCalendar } from 'react-icons/fa';
import { confirmServiceOTP, getServices } from '../../services/serviceService';

const ServiceList = ({ services, onServiceUpdate }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Gestion des Services</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Type</th>
              <th>OTP Confirmé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>#{service.id.slice(0, 8)}</td>
                <td>
                  <h4>{service.nom}</h4>
                  <p><FaPhone /> {service.telephone}</p>
                  <p>{service.email}</p>
                </td>
                <td>{formatDate(service.created_at)}</td>
                <td><FaTools /> {service.type_service}</td>
                <td>
                  {service.otp_confirmed ? (
                    <span className="admin-status admin-status-success">Oui</span>
                  ) : (
                    <span className="admin-status admin-status-warning">Non</span>
                  )}
                </td>
                <td>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setSelectedService(service)} title="Voir les détails">
                    <FaEye />
                  </button>
                  {!service.otp_confirmed && (
                    <button className="admin-btn admin-btn-success admin-btn-sm" onClick={async () => {
                      setIsUpdating(true);
                      await confirmServiceOTP(service.id);
                      onServiceUpdate();
                      setIsUpdating(false);
                    }} disabled={isUpdating} title="Confirmer OTP">
                      <FaCheck />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Details Modal (optional, similar to OrderList) */}
      {selectedService && (
        <div className="admin-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Détails du Service</h3>
            <p><strong>Nom:</strong> {selectedService.nom}</p>
            <p><strong>Email:</strong> {selectedService.email}</p>
            <p><strong>Téléphone:</strong> {selectedService.telephone}</p>
            <p><strong>Type:</strong> {selectedService.type_service}</p>
            <p><strong>Description:</strong> {selectedService.description}</p>
            <p><strong>Date préférée:</strong> {selectedService.date_preferee}</p>
            <p><strong>Heure préférée:</strong> {selectedService.heure_preferee}</p>
            <p><strong>OTP Confirmé:</strong> {selectedService.otp_confirmed ? 'Oui' : 'Non'}</p>
            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedService(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList; 