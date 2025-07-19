import React, { useEffect } from 'react';

const UserAlert = ({ message, type = 'success', onClose, duration }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration ?? 1000);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`user-alert user-alert-${type}`}>{message}</div>
  );
};

export default UserAlert; 