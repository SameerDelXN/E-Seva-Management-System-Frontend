import React, { useState } from 'react';
import './SuccessPopup.css'; // Reusing the same styles
import DeleteSuccessPopup from './deleteSuccess';

const DeleteConfirmationPopup = ({ onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Wait for a short delay to show the deleting state
      setTimeout(() => {
        setShowSuccess(true);
      }, 1000);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onCancel();
    }
  };

  if (showSuccess) {
    return <DeleteSuccessPopup onClose={handleClose} />;
  }

  return (
    <div className="success-popup delete-popup">
      <div className="popup-content">
        <div className="popup-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V11M12 15V14M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Are You Sure to Delete?</h3>
        <p>This action cannot be undone. <br/>The data will be permanently removed.</p>
        <div className="popup-buttons">
          <button 
            onClick={handleClose} 
            className="cancel-btn"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            className="confirm-btn"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;