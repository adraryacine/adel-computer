import React, { useEffect } from 'react';

const AdminAlert = ({ message, type = 'success', onClose, duration }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration ?? 1000);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`admin-alert admin-alert-${type}`}>{message}</div>
  );
};

export default AdminAlert; 