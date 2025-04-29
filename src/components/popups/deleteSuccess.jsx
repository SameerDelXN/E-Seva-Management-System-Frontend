import React, { useEffect, useState } from 'react';
import './SuccessPopup.css'; // Shared styles for all popups

const DeleteSuccessPopup = ({ onClose }) => {
  const [isDeleting, setIsDeleting] = useState(true);

  useEffect(() => {
    // First show deleting state for 2 seconds
    const deletingTimer = setTimeout(() => {
      setIsDeleting(false);
    }, 2000);

    // Then show success message for 1 second before closing
    const successTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(deletingTimer);
      clearTimeout(successTimer);
    };
  }, [onClose]);

  return (
    <div className="success-popup delete-popup">
      <div className="popup-content">
        <div className="popup-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>{isDeleting ? 'Deleting...' : 'Data Deleted Successfully!'}</h3>
        <p>{isDeleting ? 'Please wait while we delete your data...' : 'The selected data has been successfully removed from the system.'}</p>
        <button 
          onClick={onClose} 
          className="close-btn"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'OK'}
        </button>
      </div>
    </div>
  );
};

export default DeleteSuccessPopup;